# NestJS with Fastify recipe

Register a singleton client and inject the deployment's server-side credential destination adapter.

```ts
import { Module } from '@nestjs/common';
import {
  WathbaClient,
  createGcpSecretManagerCredentialProvider,
} from '@wathba/sdk';

@Module({
  providers: [
    {
      provide: WathbaClient,
      useFactory: () =>
        new WathbaClient({
          credentialProvider: createGcpSecretManagerCredentialProvider({
            secretVersionResource:
              'projects/123456789012/secrets/wathba-app/versions/7',
            allowedCapabilities: ['messaging.otp'],
            allowedScopes: ['otp:send'],
          }),
        }),
    },
  ],
  exports: [WathbaClient],
})
export class WathbaSdkModule {}
```

Controllers call an application use case; they do not resolve, read, log, or return the credential. Keep idempotency identity in the app's durable command record so retries reuse the same key.

The CLI replaces the example with the active binding's exact numeric version and approved capability/scopes. The provider uses the runtime workload identity, rejects `latest`, and fails closed outside that binding; do not inject a service-account key or credential value into Nest configuration.

Model `final`, `pending`, and `action_required` explicitly in the application layer. Schedule only safe read operations for convergence; do not turn a pending provider outcome into an HTTP success claim or replay a mutation with a fresh key.
