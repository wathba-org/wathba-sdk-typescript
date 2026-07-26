# Shipping recipe

Use this recipe only in a trusted Node.js 24+ server after Wathba CLI reports `logistics.shipping` active and its human-owned setup actions complete. External-service registration/login, pickup-address submission, wallet funding, capability activation, and project-key issuance belong to hosted member pages. They are not SDK or member-app responsibilities.

## Configure the test project key

The authorized member creates the exact test-environment key in the Wathba
portal and configures it in the server runtime outside the coding agent's view:

```ts
import { WathbaClient } from '@wathba-cli/sdk';

const apiOrigin = 'https://apidev.wathba.info';

export const wathba = new WathbaClient({
  baseUrl: apiOrigin,
  credentialProvider: {
    async resolve() {
      const apiKey = process.env.WATHBA_API_KEY;
      if (!apiKey) throw new Error('WATHBA_API_KEY is not configured');
      return { apiKey };
    },
  },
  retry: { maximumAttempts: 2, delayMs: 100 },
});
```

The SDK re-resolves the configured key for each bounded attempt. A mutation retry replays the exact URL, body bytes, and `Idempotency-Key`; it never creates a replacement key. Persist the idempotency key with the application’s logical shipment command so process restarts can do the same. Never persist the Wathba API key in that command record.

## Create one capped sandbox shipment

Staging currently certifies `order_first`: the external service may select and charge for the courier during creation, while Wathba reserves and enforces the request’s maximum exposure. This is test-only and must not be treated as production route certification.

```ts
import {
  createIdempotencyKey,
  pollWathbaOutcome,
} from '@wathba-cli/sdk';
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
