# Node server recipe

Create one client per server process. The authorized member creates the exact
test or production project key in the Wathba portal and configures it in the
server runtime outside the coding agent's view.

```ts
import {
  WathbaClient,
  createIdempotencyKey,
} from '@wathba/sdk';

const wathba = new WathbaClient({
  credentialProvider: {
    async resolve() {
      const apiKey = process.env.WATHBA_API_KEY;
      if (!apiKey) throw new Error('WATHBA_API_KEY is not configured');
      return { apiKey };
    },
  },
});

export async function sendLoginOtp(email: string) {
  return wathba.otp.send({
    projectId: project.id,
    environmentId: project.environmentId,
    email,
    purpose: 'login',
    idempotencyKey: createIdempotencyKey(),
  });
}
```

Use the test key only with `https://apidev.wathba.info` and the production key
only with `https://api.wathba.info`. Test and production keys are separate.
There is no member-cloud credential destination or GCP workload-identity setup.
Never pass the key to the coding agent or put its value in source control.

Persist the idempotency key with the logical command if your app may retry after a restart. The returned value is a typed outcome; only `final` is terminal, while `pending` must converge through a safe status read and `action_required` must be completed by the member. Do not log or return the configured project key.

For payments and shipping, branch on the typed outcome. Queue a bounded safe read for `pending`, render only the member-safe portal URL for `action_required`, and treat only `final` as terminal. Never automatically retry a mutation with a new idempotency key.

For the complete capped staging request and its onboarding boundary, see [Shipping](./shipping.md).
