import assert from 'node:assert/strict';
import test from 'node:test';
import { WathbaClient, WathbaPaymentsClient, asIdempotencyKey } from '@wathba/sdk';

const credentialProvider = {
  async resolve() {
    return { apiKey: 'wth_sdk_test_key' };
  },
};

test('shipping.create sends the provider-opaque contract and preserves pending', async () => {
  let observed;
  const client = new WathbaClient({
    baseUrl: 'https://api.test.wathba.info',
    credentialProvider,
    fetch: async (url, init) => {
      observed = { url: String(url), init };
      return Response.json(
        {
          executionId: 'exe_shipping_001',
          state: 'pending',
          statusCode: 202,
          message: 'shipping_request_pending',
          capability: 'logistics.shipping',
          operationCode: 'createShipment',
          amountMinor: 2500,
          currency: 'SAR',
        },
        { status: 202 },
      );
    },
  });

  const outcome = await client.shipping.create({
    projectId: 'prj_shipping_001',
    environmentId: 'env_shipping_001',
    mode: 'preselected_courier',
    courierPartnerId: 'courier_allowed_001',
    recipient: {
      name: 'Customer',
      phone: '966500000000',
      address: { line: 'King Fahd Road', cityId: 'riyadh' },
    },
    items: [{ name: 'Item', quantity: 1 }],
    idempotencyKey: asIdempotencyKey('idem_shipping_sdk_001'),
  });

  assert.equal(outcome.kind, 'pending');
  assert.equal(outcome.value.executionId, 'exe_shipping_001');
  assert.equal(
    observed.url,
    'https://api.test.wathba.info/v1/platform/projects/prj_shipping_001/shipments',
  );
  assert.equal(
    observed.init.headers.get('idempotency-key'),
    'idem_shipping_sdk_001',
  );
  const body = JSON.parse(observed.init.body);
  assert.equal(body.projectId, undefined);
  assert.equal(body.idempotencyKey, undefined);
  assert.equal(body.courierPartnerId, 'courier_allowed_001');
});

test('payments.createProduct is ergonomic and returns a typed final outcome', async () => {
  const client = new WathbaClient({
    credentialProvider,
    fetch: async () =>
      Response.json(
        {
          id: 'pprd_sdk_001',
          productId: 'pprd_sdk_001',
          projectId: 'prj_payments_001',
          environmentId: 'env_payments_001',
          status: 'active',
          visibility: 'catalog',
          origin: 'member_created',
          autoCreatedForLinkId: null,
          name: 'Premium plan',
          description: null,
          type: 'one_off',
          prices: [
            {
              id: 'price_sdk_001',
              priceId: 'price_sdk_001',
              currency: 'SAR',
              amountMinor: 10000,
              taxBehavior: 'exclusive',
              status: 'active',
            },
          ],
          unitAmountMinor: 10000,
          currency: 'SAR',
          metadata: {},
          linkedPaymentLinkId: null,
          createdAt: '2026-07-11T10:00:00.000Z',
          updatedAt: '2026-07-11T10:00:00.000Z',
          archivedAt: null,
          version: 1,
        },
        { status: 201 },
      ),
  });

  const outcome = await client.payments.createProduct({
    projectId: 'prj_payments_001',
    environmentId: 'env_payments_001',
    name: 'Premium plan',
    prices: [{ amountMinor: 10000, currency: 'SAR' }],
    idempotencyKey: asIdempotencyKey('idem_payment_product_sdk_001'),
  });

  assert.equal(outcome.kind, 'final');
  assert.equal(outcome.value.productId, 'pprd_sdk_001');
});

test('payments ergonomic surface maps every remaining published operation exactly once', async () => {
  const calls = [];
  const payments = new WathbaPaymentsClient({
    async execute(operationId, input) {
      calls.push({ operationId, input });
      return { operationId };
    },
  });
  const idempotencyKey = asIdempotencyKey('idem_payment_surface_001');
  const projectId = 'prj_payments_001';
  const productId = 'pprd_payments_001';
  const linkId = 'plk_payments_001';
  const paymentId = 'pay_payments_001';

  const cases = [
    {
      run: () => payments.listProducts({ projectId, query: { active: true } }),
      operationId: 'listPaymentProducts',
      input: { path: { projectId }, query: { active: true } },
    },
    {
      run: () => payments.getProduct({ projectId, productId }),
      operationId: 'getPaymentProduct',
      input: { path: { projectId, productId } },
    },
    {
      run: () => payments.updateProduct({ projectId, productId, name: 'Updated', idempotencyKey }),
      operationId: 'updatePaymentProduct',
      input: { path: { projectId, productId }, body: { name: 'Updated' }, idempotencyKey },
    },
    {
      run: () => payments.archiveProduct({ projectId, productId, idempotencyKey }),
      operationId: 'archivePaymentProduct',
      input: { path: { projectId, productId }, idempotencyKey },
    },
    {
      run: () => payments.promoteProduct({ projectId, productId, idempotencyKey }),
      operationId: 'promotePaymentProduct',
      input: { path: { projectId, productId }, idempotencyKey },
    },
    {
      run: () => payments.listLinks({ projectId, query: { status: 'active' } }),
      operationId: 'listPaymentLinks',
      input: { path: { projectId }, query: { status: 'active' } },
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
      run: () => payments.reactivateLink({ projectId, linkId, idempotencyKey }),
      operationId: 'reactivatePaymentLink',
      input: { path: { projectId, linkId }, idempotencyKey },
    },
    {
      run: () => payments.listPayments({ projectId, query: { status: 'unknown' } }),
      operationId: 'listPayments',
      input: { path: { projectId }, query: { status: 'unknown' } },
    },
    {
      run: () => payments.listRefunds({ projectId, paymentId }),
      operationId: 'listPaymentRefunds',
      input: { path: { projectId, paymentId } },
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
