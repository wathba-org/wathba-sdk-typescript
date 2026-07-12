# Node server recipe

Create one client per server process. Resolve the Wathba app credential from the runtime's approved secret destination immediately before each request.

```ts
import {
  WathbaClient,
  createGcpSecretManagerCredentialProvider,
  createIdempotencyKey,
} from '@wathba/sdk';

const wathba = new WathbaClient({
  credentialProvider: createGcpSecretManagerCredentialProvider({
    // These safe values come from the exact active Wathba binding/lock.
    secretVersionResource:
      'projects/123456789012/secrets/wathba-app/versions/7',
    allowedCapabilities: ['messaging.otp'],
    allowedScopes: ['otp:send'],
  }),
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

The exact numeric secret-version resource and approved capability/scope arrays are non-secret binding facts generated into the integration lock; do not replace the version with `latest`. The default provider uses the GCP workload metadata identity, verifies the payload checksum, and fails closed if the request falls outside that binding. Never pass a service-account key to the app or agent.

Persist the idempotency key with the logical command if your app may retry after a restart. The returned value is a typed outcome; only `final` is terminal, while `pending` must converge through a safe status read and `action_required` must be completed by the member. Do not persist or log the credential returned by the provider.

For payments and shipping, branch on the typed outcome. Queue a bounded safe read for `pending`, render only the member-safe portal URL for `action_required`, and treat only `final` as terminal. Never automatically retry a mutation with a new idempotency key.
