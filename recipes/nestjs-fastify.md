# NestJS with Fastify recipe

Register a singleton client and read the member-configured project key only in
the server process.

```ts
import { Module } from '@nestjs/common';
import { WathbaClient } from '@wathba-cli/sdk';

@Module({
  providers: [
    {
      provide: WathbaClient,
      useFactory: () =>
        new WathbaClient({
          credentialProvider: {
            async resolve() {
              const apiKey = process.env.WATHBA_API_KEY;
              if (!apiKey) {
                throw new Error('WATHBA_API_KEY is not configured');
              }
              return { apiKey };
            },
          },
        }),
    },
  ],
  exports: [WathbaClient],
})
export class WathbaSdkModule {}
```

Controllers call an application use case; they do not resolve, read, log, or return the credential. Keep idempotency identity in the app's durable command record so retries reuse the same key.

The authorized member creates a test or production project key in the portal
and configures it outside the agent's view. Keep it in server-only runtime
configuration. Do not add it to a Nest config response, log line, source file,
or browser bundle. Development uses the test key with
`https://apidev.wathba.info`; production uses its separate key and origin.

Model `final`, `pending`, and `action_required` explicitly in the application layer. Schedule only safe read operations for convergence; do not turn a pending provider outcome into an HTTP success claim or replay a mutation with a fresh key.

External shipping-account setup remains a hosted member-portal workflow, never a Nest controller concern. See [Shipping](./shipping.md) for the complete sandbox `order_first` request.
