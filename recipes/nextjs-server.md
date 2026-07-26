# Next.js server recipe

Construct the client only in a server-only module, then call that module from a Route Handler or Server Action.

```ts
import 'server-only';
import { WathbaClient } from '@wathba-cli/sdk';

export const wathba = new WathbaClient({
  credentialProvider: {
    async resolve() {
      const apiKey = process.env.WATHBA_API_KEY;
      if (!apiKey) throw new Error('WATHBA_API_KEY is not configured');
      return { apiKey };
    },
  },
});
```

The authorized member creates the test or production key in the Wathba portal
and configures it outside the agent's view. Never import the SDK from a Client
Component. Never serialize the client, credential, error object, or request
payload into React props. The package's browser export rejects accidental
browser bundling, but the server-only module boundary remains part of the
app's design.

For development or test, set `baseUrl` to
`https://apidev.wathba.info` and configure a test-environment key. Production
uses a separate production key and `https://api.wathba.info`.

If an operation returns `action_required`, pass only the validated member-safe action URL or a server-owned reference to the UI. Keep the Wathba credential, raw problem object, and correlation details on the server.

Do not put external-service registration/login, pickup-address submission, wallet funding, activation, or key issuance in a Route Handler or Server Action. Those are hosted member-portal actions. See [Shipping](./shipping.md) for the runtime-only staging request.
