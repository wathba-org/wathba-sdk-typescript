# Universal Wathba Checkout

Use the server SDK to create a Payment Intent. Never create it in browser or
mobile code because that would expose the Wathba API key.

```ts
const intent = await wathba.payments.createIntent({
  projectId,
  environmentId,
  amountMinor: 5_000,
  currency: 'SAR',
  orderReference: order.id,
  allowedPaymentMethods: ['card', 'apple_pay', 'stc_pay'],
  clientBinding: { kind: 'web_origin', value: 'https://shop.example.com' },
  returnUrl: 'https://shop.example.com/payments/return',
  idempotencyKey: order.paymentIdempotencyKey,
});
```

Persist the logical idempotency key with the order. Return only
`paymentIntentId`, `checkout.url`, `checkout.token`, and
`checkout.expiresAt` to the app. The checkout token is single-purpose and
short-lived; do not persist it, put it in a query string, analytics, logs, or
browser storage.

## Web

```html
<script src="https://checkout.wathba.example/checkout/v1.js"></script>
<script>
  WathbaCheckout.open({
    checkoutToken: response.checkout.token,
    checkoutUrl: response.checkout.url,
  });
</script>
```

The launcher places the token in the URL fragment and opens the hosted checkout
as a top-level window. Do not iframe the page.

## Mobile

- iOS: open `checkout.url#checkout_token=<token>` using an ephemeral
  `ASWebAuthenticationSession`.
- Android: open the same fragment URL using a Chrome Custom Tab.
- Do not use a WebView. Apple Pay and other wallet availability is determined
  by Wathba's hosted origin, the device, browser, and project readiness.

## Completion

The return URL is not payment proof. Verify signed Wathba webhooks using
`verifyWathbaWebhook`, or read the intent from the server:

```ts
const result = await wathba.payments.getIntent({
  projectId,
  paymentIntentId,
});

if (result.kind === 'final' && result.value.status === 'succeeded') {
  await fulfillOrderOnce(result.value.paymentIntentId);
}
```

Create a fresh checkout session for an unexpired payable intent when a checkout
token expires. Cancel an intent only before provider dispatch. Refund a
succeeded payment through `requestRefund` and converge it through
`getRefund`.
