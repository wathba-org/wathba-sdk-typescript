# `@wathba/sdk`

Server-only TypeScript client for Wathba capabilities. The raw operation types and runtime validators are generated from the exact immutable Wathba OpenAPI 3.1.2 artifact. The package has zero production dependencies and contains no provider SDK, provider endpoint, or browser credential path.

```ts
import { WathbaClient, createIdempotencyKey } from '@wathba/sdk';

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
  mode: 'preselected_courier',
  courierPartnerId: 'courier_allowed_123',
  recipient: {
    name: 'Customer',
    phone: '966500000000',
    address: { line: 'King Fahd Road', cityId: 'riyadh' },
  },
  items: [{ name: 'Item', quantity: 1 }],
  idempotencyKey: createIdempotencyKey(),
});

switch (outcome.kind) {
  case 'final':
    return outcome.value;
  case 'pending':
    return queueSafeStatusCheck(outcome.value.executionId);
  case 'action_required':
    return showMemberAction(outcome.actionRef.browserUrl);
}
```

`pollWathbaOutcome` is bounded and accepts a caller-supplied safe read operation only. It never replays a mutation. Payments expose every published product, hosted-link, payment-read, and refund operation through typed ergonomic methods; shipping exposes only the create operation present in the pinned launch contract. The raw client exposes every published operation without inventing unsupported aliases.

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

See [`recipes/`](./recipes) for Node, Next.js server, and NestJS/Fastify wiring.

Server-side webhook verification is exported as `verifyWathbaWebhook`. It verifies the exact raw body before parsing, enforces the `v1` timestamped HMAC contract and five-minute freshness window, resolves only the declared signing-secret version, compares signatures timing-safely, validates the strict event envelope, and requires an atomic durable replay-store claim. A valid redelivery returns `kind: 'duplicate'`; acknowledge it without applying the business effect again. Never use an already-parsed body or an in-memory replay store in production.

## Publication

Tags are release authority: `vX.Y.Z` must exactly match `package.json`. The release workflow reruns the complete verification suite, publishes through npm trusted publishing with provenance, retrieves the registry artifact, verifies its SHA-512 registry integrity and required contract surfaces, extracts and byte-verifies `release.json`, and attaches its SHA-256 digest in `publication-attestation.json` to the immutable GitHub release. Configure the `npm-production` GitHub environment and the npm `@wathba` trusted publisher before creating the first tag; the workflow deliberately fails closed when either external control is absent.
