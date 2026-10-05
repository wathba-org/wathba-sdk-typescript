# Shipping recipe

Use this recipe only in a trusted Node.js 24+ server after Wathba CLI reports `logistics.shipping` enabled. The one member-wide external shipping account is connected or registered by the member human on hosted member pages, or by a Wathba operator. Pickup addresses, external-wallet funding, and project-key issuance also belong to hosted member pages. AI agents, the SDK, and member-app code never start that registration or connection, handle the external account password, or call setup routes. Readiness is necessary, not permission to create shipments.

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

## Create one sandbox preview shipment

Shipment creation is a sandbox development preview that runs only in an approved Wathba test deployment; production shipment creation is not available. In `order_first` mode the external service may select and charge for the courier during creation. Wathba creates no wallet reservation, settlement, quote, or Wathba-collected fee: funding and shipping charges stay between the member and the external shipping account. A pickup address is not proof of the shipment's origin or carrier.

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

`amountMinor` is checked against the catalog's per-request limit. It is not a Wathba reservation and does not cap what the external shipping account charges. Item amounts describe the provider-opaque order total. Recipient email, at least one item, and parcel weight are required by the normalized contract.

Treat only `final` as terminal. The SDK classifies only a `pending` execution state as `pending`; every other state, including `blocked`, is `final`. While an execution is `pending` or its outcome is unknown (for example, a lost response), poll only the SDK’s safe execution-status read using the same project credential, and retry an uncertain create only with its original idempotency key and body. A `blocked` execution is a final fail-closed refusal, not a pending one: do not poll it. Surface its message, fix the cause (such as readiness or controls), and create a shipment again only as a new explicit decision. Never automatically replace, re-key, or retry a mutation. An `action_required` result contains only Wathba’s member-safe hosted action; show that URL to the member and never call the external service directly.

Do not log request bodies, recipient data, tracking/label URLs, credential values, provider payloads, or external-service identifiers. Store only the application facts your own retention policy requires.
