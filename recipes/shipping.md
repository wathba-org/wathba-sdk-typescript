# Shipping recipe

Use this recipe only in a trusted Node.js 24+ server after Wathba CLI reports `logistics.shipping` active and its human-owned setup actions complete. External-service registration/login, pickup-address submission, wallet funding, capability activation, and app-key issuance belong to Wathba CLI and hosted member pages. They are not SDK or member-app responsibilities.

## Bind the credential to the runtime origin

The API client origin and the credential binding origin must be identical. This is especially important in development and test environments:

```ts
import {
  WathbaClient,
  createGcpSecretManagerCredentialProvider,
} from '@wathba/sdk';

const apiOrigin = 'https://apidev.wathba.info';

const credentialProvider = createGcpSecretManagerCredentialProvider({
  secretVersionResource:
    'projects/123456789012/secrets/wathba-app-dev/versions/7',
  allowedApiOrigin: apiOrigin,
  allowedCapabilities: ['logistics.shipping'],
  allowedScopes: ['shipments:create', 'tools:execute'],
});

export const wathba = new WathbaClient({
  baseUrl: apiOrigin,
  credentialProvider,
  retry: { maximumAttempts: 2, delayMs: 100 },
});
```

The SDK re-resolves the credential for each bounded attempt. A mutation retry replays the exact URL, body bytes, and `Idempotency-Key`; it never creates a replacement key. Persist that key with the application’s logical shipment command so process restarts can do the same.

## Create one capped sandbox shipment

Staging currently certifies `order_first`: the external service may select and charge for the courier during creation, while Wathba reserves and enforces the request’s maximum exposure. This is test-only and must not be treated as production route certification.

```ts
import {
  createIdempotencyKey,
  pollWathbaOutcome,
} from '@wathba/sdk';
import { wathba } from './wathba.js';

const outcome = await wathba.shipping.create({
  projectId: 'prj_123',
  environmentId: 'env_123',
  mode: 'order_first',
  amountMinor: 5_000,
  currency: 'SAR',
  orderReference: '100001',
  recipient: {
    name: 'Customer Name',
    email: 'customer@example.com',
    phone: '966500000000',
    address: {
      line: 'King Fahd Road',
      cityId: 'riyadh',
    },
  },
  items: [
    {
      name: 'Test item',
      quantity: 1,
      amountMinor: 1_000,
    },
  ],
  parcel: {
    weightGrams: 1_000,
  },
  idempotencyKey: createIdempotencyKey(),
});

const converged =
  outcome.kind === 'pending'
    ? await pollWathbaOutcome(
        () =>
          wathba.shipping.getStatus({
            projectId: 'prj_123',
            executionId: outcome.value.executionId,
          }),
        { maximumAttempts: 10, delayMs: 1_000 },
      )
    : outcome;
```

`amountMinor` is the authorized maximum exposure, not proof of the final provider charge. Item amounts describe the provider-opaque order total. Recipient email, at least one item, and parcel weight are required by the normalized contract.

Treat only `final` as terminal. Keep `pending` or `blocked` executions pending and converge them through the SDK’s safe execution-status read using the same project credential. An `action_required` result contains only Wathba’s member-safe hosted action; show that URL to the member and never call the external service directly.

Do not log request bodies, recipient data, tracking/label URLs, credential values, provider payloads, or external-service identifiers. Store only the application facts your own retention policy requires.
