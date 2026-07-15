# `@wathba/sdk`

Server-only TypeScript client for Wathba capabilities. The raw operation types and runtime validators are generated from the exact immutable Wathba OpenAPI 3.1.2 artifact. The package has zero production dependencies and contains no provider SDK, provider endpoint, or browser credential path.

```ts
import {
  WathbaClient,
  createIdempotencyKey,
  pollWathbaOutcome,
} from '@wathba/sdk';

const wathba = new WathbaClient({
  credentialProvider: {
    async resolve({ requiredScopes }) {
      // Select an approved Wathba app credential from your server secret store.
      return { apiKey: await loadWathbaKeyFromYourServerSecretStore() };
    },
  },
  // Retries are opt-in, bounded, and replay the exact idempotency key and body.
  retry: { maximumAttempts: 2, delayMs: 100 },
});

const outcome = await wathba.otp.send({
  projectId: 'prj_123',
  environmentId: 'env_123',
  email: 'user@example.com',
  purpose: 'login',
  idempotencyKey: createIdempotencyKey(),
});
```

OTP uses the same `final | pending | action_required` union as payments and shipping; a `201` or `202` transport status alone is never treated as proof of a completed business outcome.

Ergonomic clients are grouped by capability and preserve Wathba's three runtime outcomes. A human action is never coerced into a transport error or a false success:

```ts
const outcome = await wathba.shipping.create({
  projectId: 'prj_123',
  environmentId: 'env_123',
  // Sandbox-only: Wathba caps the provider-selected courier and spend.
  mode: 'order_first',
  amountMinor: 5_000,
  currency: 'SAR',
  orderReference: '100001',
  recipient: {
    name: 'Customer',
    email: 'customer@example.com',
    phone: '966500000000',
    address: { line: 'King Fahd Road', cityId: 'riyadh' },
  },
  items: [{ name: 'Item', quantity: 1, amountMinor: 1_000 }],
  parcel: { weightGrams: 1_000 },
  idempotencyKey: createIdempotencyKey(),
});

switch (outcome.kind) {
  case 'final':
    return outcome.value;
  case 'pending':
    return pollWathbaOutcome(
      () =>
        wathba.shipping.getStatus({
          projectId: 'prj_123',
          executionId: outcome.value.executionId,
        }),
      { maximumAttempts: 10, delayMs: 1_000 },
    );
  case 'action_required':
    return showMemberAction(outcome.actionRef.browserUrl);
}
```

`order_first` is a capped sandbox certification path, not a production courier-selection guarantee. `amountMinor` is the maximum SAR exposure authorized for the logical shipment; item `amountMinor` values describe the provider-opaque order total. Recipient email, a non-empty item list, and parcel weight are required. Production stays fail closed until Wathba can prove the chosen courier and maximum cost before the provider write.

## External-service onboarding is not an SDK operation

This SDK starts at the member-app runtime boundary, after a human has connected or registered the external shipping account, completed pickup-address and wallet readiness, activated `logistics.shipping`, and installed a scoped Wathba app credential through Wathba CLI and hosted member actions. It deliberately exposes no provider install/login, password, pickup-address, wallet-funding, activation, or key-minting method. Never add those provider or control-plane calls to member application code.

For a non-production Wathba origin, bind both sides to the same exact HTTPS origin. Changing only `baseUrl` correctly makes the GCP credential provider fail closed:

```ts
const apiOrigin = 'https://apidev.wathba.info';
const credentialProvider = createGcpSecretManagerCredentialProvider({
  secretVersionResource:
    'projects/123456789012/secrets/wathba-app-dev/versions/7',
  allowedApiOrigin: apiOrigin,
  allowedCapabilities: ['logistics.shipping'],
  allowedScopes: ['shipments:create', 'tools:execute'],
});

const devWathba = new WathbaClient({
  baseUrl: apiOrigin,
  credentialProvider,
});
```

`pollWathbaOutcome` is bounded and accepts a caller-supplied safe read operation only. It never replays a mutation. Payments expose every published product, hosted-link, payment-read, and refund operation through typed ergonomic methods; shipping exposes the published create operation and its read-only execution-status operation. The raw client exposes every published operation without inventing unsupported aliases.

Keep an idempotency key with the logical command and reuse it for retries. Create a new key only for a new intent. Resolve the Wathba credential inside the trusted server runtime; never pass it to browser code, an AI agent, logs, or source control.

For the certified GCP destination, use the exact numeric secret-version resource returned by the Wathba binding. The provider rejects aliases such as `latest`, a different API origin, capabilities outside the approved binding, and scopes outside the approved binding. It uses the workload identity metadata service by default and verifies Secret Manager's CRC32C checksum before returning the credential to the in-process client:

```ts
import {
  WathbaClient,
  createGcpSecretManagerCredentialProvider,
} from '@wathba/sdk';

const credentialProvider = createGcpSecretManagerCredentialProvider({
  secretVersionResource:
    'projects/123456789012/secrets/wathba-app/versions/7',
  allowedCapabilities: ['messaging.otp'],
  allowedScopes: ['otp:send'],
});

const wathba = new WathbaClient({ credentialProvider });
```

The GCP runtime identity must be certified by Wathba for only that exact numeric version. Do not grant or request `latest`, and do not pass service-account keys to this provider.

The credential provider receives only safe selection facts—API origin, canonical operation ID, capability code, and required Wathba scopes. It never receives the request body. Provider failures and transport failures are returned as sanitized `WathbaSdkError` values. Stable API problems are returned as `WathbaApiError` with the exact generated `WathbaProblem` shape.

Both ESM and CommonJS are exported. Browser-condition imports resolve to a rejecting module and browser-condition TypeScript builds expose no client exports. Node.js 24 or newer is required.

The package includes the pinned OpenAPI artifact, AI-integration protocol schemas, release digests, and shared compatibility fixtures used by Wathba platform CI. Canonical package-root `release.json` binds the SDK version to the exact OpenAPI, fixture-set, and protocol-set digests; the runtime export is generated from the same object. `pnpm generate:check` fails on generated drift; `pnpm contracts:check` fails on artifact, fixture, protocol, digest, or contract-version drift.

See [`recipes/`](./recipes) for Node, Next.js server, NestJS/Fastify, and the sandbox shipping flow.

Server-side webhook verification is exported as `verifyWathbaWebhook`. It verifies the exact raw body before parsing, enforces the `v1` timestamped HMAC contract and five-minute freshness window, resolves only the declared signing-secret version, compares signatures timing-safely, validates the strict event envelope, and requires an atomic durable replay-store claim. A valid redelivery returns `kind: 'duplicate'`; acknowledge it without applying the business effect again. Never use an already-parsed body or an in-memory replay store in production.

## Publication

Tags are the steady-state release authority: `vX.Y.Z` must exactly match `package.json` and point to a commit reachable from `origin/main`. The release workflow reruns the complete verification suite and packs one immutable candidate. If that version is absent, it publishes the candidate through npm trusted publishing with provenance. If the version already exists, it skips publication only after proving the registry SHA-512 integrity is exactly the candidate integrity. It then installs that exact immutable version into an isolated temporary project with lifecycle scripts disabled and requires `npm audit signatures --json --include-attestations` to cryptographically verify its registry signature and SLSA provenance. Only the exact package/version entry may pass, with no invalid or missing audit result. Wathba then binds the verified subject digest to the candidate and permits only the bootstrap-workflow/main pair or release-workflow/exact-version-tag pair at the current GitHub repository and commit. Finally it retrieves the registry artifact, verifies its required contract surfaces and byte-exact `release.json`, and attaches those provenance facts in `publication-attestation.json` to the GitHub release. The attestation keeps npm provenance separate from the exact Catalog-007 registry subset `{ schemaVersion, package, version, registryUri, distIntegrity }`; `registryMetadataDigest` is the SHA-256 of that subset's RFC 8785 canonical JSON bytes. Catalog 007 consumes the durable `v0.1.0` asset at `https://github.com/wathba-org/wathba-sdk-typescript/releases/download/v0.1.0/publication-attestation.json`; a short-lived Actions artifact is not release authority. This makes a tag run safely resumable after npm accepted immutable bytes without silently accepting an unprovenanced or incorrectly sourced publication.

The first `@wathba/sdk` publication is a deliberately separate one-time bootstrap because npm cannot configure a trusted publisher for a package that does not exist yet:

1. Create the protected GitHub environment `npm-production`. Add a short-lived granular npm publishing token as the environment secret `NPM_TOKEN`; never put the value in a workflow input, repository variable, command, or log.
2. From current `main`, run **Bootstrap first SDK publish** and type `PUBLISH @wathba/sdk 0.1.0 ONCE`. When the version is absent, the workflow requires the dispatched commit to be current `origin/main`, exposes the short-lived token only as `NODE_AUTH_TOKEN` on the single publish step, and publishes the packed candidate with provenance. If npm accepted the immutable version but a later step failed, dispatch or rerun the workflow from `main` even if `main` has advanced: it skips both the publish step and token use, cryptographically audits npm's signed provenance, derives the publication source commit from that verified statement, requires the source to remain an ancestor of current `origin/main`, checks out that exact source, and reproduces the candidate before completing or re-verifying the `v0.1.0` release. The tag and `githubSha` evidence bind to the signed source commit rather than the recovery dispatch commit. An existing asset must match every stable evidence field and is never overwritten. The 90-day Actions artifact is only a convenience copy; the tag release asset is the durable evidence.
3. On npm, configure the new package's trusted GitHub Actions publisher for organization `wathba-org`, repository `wathba-sdk-typescript`, workflow `release.yml`, environment `npm-production`, and allowed action `npm publish`. With an interactive session on the current npm CLI, the equivalent command is `npm trust github @wathba/sdk --repo wathba-org/wathba-sdk-typescript --file release.yml --env npm-production --allow-publish`; complete npm's 2FA challenge locally and never put that session or its credentials in CI.
4. Delete the `NPM_TOKEN` GitHub environment secret and revoke the granular token at npm before proceeding.
5. Verify that the bootstrap-created `v0.1.0` tag points to the npm-provenance source commit (the original publication dispatch commit, which may differ from a later recovery dispatch) and that its release has exactly one `publication-attestation.json` asset. All later versions publish only through the trusted publisher; do not restore a long-lived npm token.
