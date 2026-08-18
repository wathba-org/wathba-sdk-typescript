import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { WathbaClient, WathbaPaymentsClient, asIdempotencyKey } from '@wathba-cli/sdk';

const shippingFixture = JSON.parse(
  await readFile(
    new URL('../fixtures/v1/shipping-round-trip.json', import.meta.url),
    'utf8',
  ),
);

const credentialProvider = {
  async resolve() {
    return { apiKey: 'wth_sdk_test_key' };
  },
};

test('shipping.create sends the complete sandbox order_first contract and preserves pending', async () => {
  let observed;
  const client = new WathbaClient({
    baseUrl: 'https://api.test.wathba.info',
    credentialProvider,
    fetch: async (url, init) => {
      observed = { url: String(url), init };
      return Response.json(
        shippingFixture.pending.body,
        { status: shippingFixture.pending.status },
      );
    },
  });

  const outcome = await client.shipping.create({
    projectId: shippingFixture.request.path.projectId,
    ...shippingFixture.request.body,
    idempotencyKey: asIdempotencyKey(shippingFixture.request.idempotencyKey),
  });

  assert.equal(outcome.kind, 'pending');
  assert.deepEqual(outcome.value, shippingFixture.pending.body);
  assert.equal(
    observed.url,
    `https://api.test.wathba.info/v1/platform/projects/${shippingFixture.request.path.projectId}/shipments`,
  );
  assert.equal(
    observed.init.headers.get('idempotency-key'),
    shippingFixture.request.idempotencyKey,
  );
  const body = JSON.parse(observed.init.body);
  assert.equal(body.projectId, undefined);
  assert.equal(body.idempotencyKey, undefined);
  assert.deepEqual(body, shippingFixture.request.body);
});

test('shipping transport retry replays the exact URL, idempotency key, and request bytes', async () => {
  const requests = [];
  const idempotencyKey = asIdempotencyKey('idem_shipping_retry_001');
  const client = new WathbaClient({
    baseUrl: 'https://api.test.wathba.info',
    credentialProvider,
    retry: { maximumAttempts: 2, delayMs: 0 },
    fetch: async (url, init) => {
      requests.push({ url: String(url), init });
      if (requests.length === 1) throw new Error('simulated_transport_failure');
      return Response.json(
        shippingFixture.pending.body,
        { status: shippingFixture.pending.status },
      );
    },
  });

  const outcome = await client.shipping.create({
    projectId: shippingFixture.request.path.projectId,
    ...shippingFixture.request.body,
    idempotencyKey,
  });

  assert.equal(outcome.kind, 'pending');
  assert.equal(requests.length, 2);
  assert.equal(requests[0].url, requests[1].url);
  assert.equal(requests[0].init.method, requests[1].init.method);
  assert.equal(requests[0].init.body, requests[1].init.body);
  assert.equal(
    requests[0].init.headers.get('idempotency-key'),
    requests[1].init.headers.get('idempotency-key'),
  );
  assert.equal(requests[1].init.headers.get('idempotency-key'), idempotencyKey);
  assert.equal(requests[1].init.body, JSON.stringify(shippingFixture.request.body));
});

test('shipping.getStatus performs only the published safe read and converges the fixture', async () => {
  let observed;
  let credentialRequest;
  const client = new WathbaClient({
    baseUrl: 'https://api.test.wathba.info',
    credentialProvider: {
      async resolve(request) {
        credentialRequest = request;
        return { apiKey: 'wth_sdk_test_key' };
      },
    },
    fetch: async (url, init) => {
      observed = { url: String(url), init };
      return Response.json(shippingFixture.resolved.body, {
        status: shippingFixture.resolved.status,
      });
    },
  });

  const outcome = await client.shipping.getStatus(
    shippingFixture.statusRequest.path,
  );

  assert.equal(outcome.kind, 'final');
  assert.deepEqual(outcome.value, shippingFixture.resolved.body);
  assert.deepEqual(credentialRequest, {
    apiOrigin: 'https://api.test.wathba.info',
    capability: 'logistics.shipping',
    operationId: 'getShipmentExecutionStatus',
    requiredScopes: ['tools:execute'],
  });
  assert.equal(
    observed.url,
    `https://api.test.wathba.info/v1/platform/projects/${shippingFixture.statusRequest.path.projectId}/executions/${shippingFixture.statusRequest.path.executionId}`,
  );
  assert.equal(observed.init.method, 'GET');
  assert.equal(observed.init.body, undefined);
  assert.equal(observed.init.headers.get('idempotency-key'), null);
});

test('shipping.getStatus retries only the bounded safe read and re-resolves credentials', async () => {
  const requests = [];
  const credentialRequests = [];
  const client = new WathbaClient({
    baseUrl: 'https://api.test.wathba.info',
    retry: { maximumAttempts: 2, delayMs: 0 },
    credentialProvider: {
      async resolve(request) {
        credentialRequests.push(request);
        return { apiKey: 'wth_sdk_test_key' };
      },
    },
    fetch: async (url, init) => {
      requests.push({ url: String(url), init });
      if (requests.length === 1) {
        throw new Error('simulated_status_transport_failure');
      }
      return Response.json(shippingFixture.resolved.body, {
        status: shippingFixture.resolved.status,
      });
    },
  });

  const outcome = await client.shipping.getStatus(
    shippingFixture.statusRequest.path,
  );

  assert.equal(outcome.kind, 'final');
  assert.deepEqual(outcome.value, shippingFixture.resolved.body);
  assert.equal(requests.length, 2);
  assert.equal(credentialRequests.length, 2);
  assert.deepEqual(credentialRequests[0], credentialRequests[1]);
  assert.deepEqual(credentialRequests[1], {
    apiOrigin: 'https://api.test.wathba.info',
    capability: 'logistics.shipping',
    operationId: 'getShipmentExecutionStatus',
    requiredScopes: ['tools:execute'],
  });
  const expectedUrl =
    `https://api.test.wathba.info/v1/platform/projects/` +
    `${shippingFixture.statusRequest.path.projectId}/executions/` +
    shippingFixture.statusRequest.path.executionId;
  for (const request of requests) {
    assert.equal(request.url, expectedUrl);
    assert.equal(request.init.method, 'GET');
    assert.equal(request.init.body, undefined);
    assert.equal(request.init.headers.get('idempotency-key'), null);
  }
});

test('shipping.create rejects missing amount, recipient email, items, or parcel before credentials', async () => {
  let credentialResolutions = 0;
  const client = new WathbaClient({
    credentialProvider: {
      async resolve() {
        credentialResolutions += 1;
        return { apiKey: 'wth_sdk_test_key' };
      },
    },
    fetch: async () => {
      throw new Error('fetch_must_not_run');
    },
  });
  const invalidInputs = ['amountMinor', 'email', 'items', 'parcel'].map(
    (missing) => {
      const input = {
        projectId: shippingFixture.request.path.projectId,
        ...structuredClone(shippingFixture.request.body),
        idempotencyKey: asIdempotencyKey(
          `${shippingFixture.request.idempotencyKey}_${missing}`,
        ),
      };
      if (missing === 'email') delete input.recipient.email;
      else delete input[missing];
      return input;
    },
  );

  for (const input of invalidInputs) {
    await assert.rejects(
      client.shipping.create(input),
      (error) => error.code === 'wathba_invalid_request',
    );
  }
  assert.equal(credentialResolutions, 0);
});

test('payments.createIntent returns a short-lived hosted checkout without exposing a provider key', async () => {
  const client = new WathbaClient({
    credentialProvider,
    fetch: async () =>
      Response.json(
        {
          paymentIntentId: 'pi_sdk_001',
          paymentLinkId: null,
          projectId: 'prj_payments_001',
          environmentId: 'env_payments_001',
          status: 'requires_payment_method',
          amountMinor: 10000,
          currency: 'SAR',
          orderReference: 'order-sdk-001',
          description: null,
          requestedPaymentMethods: ['card', 'apple_pay'],
          availablePaymentMethods: ['card'],
          returnUrl: 'https://shop.example.test/payments/return',
          metadata: {},
          checkout: {
            sessionId: 'wcs_sdk_001',
            token: `wct_${'a'.repeat(48)}`,
            url: 'https://checkout.wathba.test/checkout/wcs_sdk_001',
            expiresAt: '2026-08-19T10:05:00.000Z',
          },
          paymentId: null,
          createdAt: '2026-08-19T10:00:00.000Z',
          updatedAt: '2026-08-19T10:00:00.000Z',
          succeededAt: null,
          failedAt: null,
          cancelledAt: null,
        },
        { status: 201 },
      ),
  });

  const outcome = await client.payments.createIntent({
    projectId: 'prj_payments_001',
    environmentId: 'env_payments_001',
    amountMinor: 10000,
    currency: 'SAR',
    clientBinding: { kind: 'web_origin', value: 'https://shop.example.test' },
    allowedPaymentMethods: ['card', 'apple_pay'],
    returnUrl: 'https://shop.example.test/payments/return',
    orderReference: 'order-sdk-001',
    idempotencyKey: asIdempotencyKey('idem_payment_intent_sdk_001'),
  });

  assert.equal(outcome.kind, 'pending');
  assert.equal(outcome.value.paymentIntentId, 'pi_sdk_001');
  assert.match(outcome.value.checkout.token, /^wct_/);
  assert.equal(JSON.stringify(outcome.value).includes('publishable'), false);
  assert.equal(JSON.stringify(outcome.value).includes('secret'), false);
});

test('payments ergonomic surface maps the universal intent, link, record, and refund operations', async () => {
  const calls = [];
  const payments = new WathbaPaymentsClient({
    async execute(operationId, input) {
      calls.push({ operationId, input });
      return { operationId, status: 'succeeded' };
    },
  });
  const idempotencyKey = asIdempotencyKey('idem_payment_surface_001');
  const projectId = 'prj_payments_001';
  const paymentIntentId = 'pi_payments_001';
  const linkId = 'plk_payments_001';
  const paymentId = 'pay_payments_001';
  const refundId = 'prf_payments_001';
  const clientBinding = { kind: 'web_origin', value: 'https://shop.example.test' };

  const cases = [
    {
      run: () =>
        payments.createIntent({
          projectId,
          environmentId: 'env_payments_001',
          amountMinor: 5000,
          currency: 'SAR',
          clientBinding,
          idempotencyKey,
        }),
      operationId: 'createPaymentIntent',
      input: {
        path: { projectId },
        body: {
          environmentId: 'env_payments_001',
          amountMinor: 5000,
          currency: 'SAR',
          clientBinding,
        },
        idempotencyKey,
      },
    },
    {
      run: () => payments.listIntents({ projectId }),
      operationId: 'listPaymentIntents',
      input: { path: { projectId } },
    },
    {
      run: () => payments.getIntent({ projectId, paymentIntentId }),
      operationId: 'getPaymentIntent',
      input: { path: { projectId, paymentIntentId } },
    },
    {
      run: () =>
        payments.cancelIntent({
          projectId,
          paymentIntentId,
          reason: 'member_cancelled',
          idempotencyKey,
        }),
      operationId: 'cancelPaymentIntent',
      input: {
        path: { projectId, paymentIntentId },
        body: { reason: 'member_cancelled' },
        idempotencyKey,
      },
    },
    {
      run: () =>
        payments.createCheckoutSession({
          projectId,
          paymentIntentId,
          clientBinding,
          idempotencyKey,
        }),
      operationId: 'createCheckoutSession',
      input: {
        path: { projectId, paymentIntentId },
        body: { clientBinding },
        idempotencyKey,
      },
    },
    {
      run: () => payments.createLink({ projectId, items: [], humanApprovalGrantId: 'supg_1', idempotencyKey }),
      operationId: 'createPaymentLink',
      input: { path: { projectId }, body: { items: [], humanApprovalGrantId: 'supg_1' }, idempotencyKey },
    },
    {
      run: () => payments.listLinks({ projectId }),
      operationId: 'listPaymentLinks',
      input: { path: { projectId } },
    },
    {
      run: () => payments.getLink({ projectId, linkId }),
      operationId: 'getPaymentLink',
      input: { path: { projectId, linkId } },
    },
    {
      run: () => payments.updateLink({ projectId, linkId, checkoutTitle: 'Updated', idempotencyKey }),
      operationId: 'updatePaymentLink',
      input: { path: { projectId, linkId }, body: { checkoutTitle: 'Updated' }, idempotencyKey },
    },
    {
      run: () => payments.deactivateLink({ projectId, linkId, idempotencyKey }),
      operationId: 'deactivatePaymentLink',
      input: { path: { projectId, linkId }, idempotencyKey },
    },
    {
      run: () => payments.reactivateLink({ projectId, linkId, humanApprovalGrantId: 'supg_2', idempotencyKey }),
      operationId: 'reactivatePaymentLink',
      input: { path: { projectId, linkId }, body: { humanApprovalGrantId: 'supg_2' }, idempotencyKey },
    },
    {
      run: () => payments.listPayments({ projectId }),
      operationId: 'listPayments',
      input: { path: { projectId } },
    },
    {
      run: () => payments.getPayment({ projectId, paymentId }),
      operationId: 'getPayment',
      input: { path: { projectId, paymentId } },
    },
    {
      run: () => payments.requestRefund({ projectId, paymentId, reason: 'customer_request', idempotencyKey }),
      operationId: 'requestPaymentRefund',
      input: { path: { projectId, paymentId }, body: { reason: 'customer_request' }, idempotencyKey },
    },
    {
      run: () => payments.listRefunds({ projectId, paymentId }),
      operationId: 'listPaymentRefunds',
      input: { path: { projectId, paymentId } },
    },
    {
      run: () => payments.getRefund({ projectId, refundId }),
      operationId: 'getPaymentRefund',
      input: { path: { projectId, refundId } },
    },
  ];

  for (const contract of cases) {
    const outcome = await contract.run();
    assert.equal(outcome.kind, 'final');
    assert.equal(outcome.value.operationId, contract.operationId);
  }
  assert.deepEqual(
    calls,
    cases.map(({ operationId, input }) => ({ operationId, input })),
  );
});
