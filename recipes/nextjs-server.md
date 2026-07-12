# Next.js server recipe

Construct the client only in a server-only module, then call that module from a Route Handler or Server Action.

```ts
import 'server-only';
import {
  WathbaClient,
  createGcpSecretManagerCredentialProvider,
} from '@wathba/sdk';

export const wathba = new WathbaClient({
  credentialProvider: createGcpSecretManagerCredentialProvider({
    secretVersionResource:
      'projects/123456789012/secrets/wathba-app/versions/7',
    allowedCapabilities: ['messaging.otp'],
    allowedScopes: ['otp:send'],
  }),
});
```

The CLI replaces the example binding facts with the exact active numeric version and approved capability/scopes. Never use `latest`. Never import the SDK from a Client Component. Never serialize the client, credential, error object, or request payload into React props. The package's browser export rejects accidental browser bundling, but the server-only module boundary remains part of the app's design.

If an operation returns `action_required`, pass only the validated member-safe action URL or a server-owned reference to the UI. Keep the Wathba credential, raw problem object, and correlation details on the server.
