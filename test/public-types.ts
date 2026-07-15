import {
  WathbaClient,
  asIdempotencyKey,
  type CreatePaymentProductInput,
  type CreatePaymentProductResult,
  type CreateShipmentInput,
  type CreateShipmentResult,
  type GetShipmentExecutionStatusInput,
  type GetShipmentExecutionStatusResult,
  type SendOtpInput,
  type SendOtpResult,
  type WathbaOutcome,
  type WathbaProblem,
} from '@wathba/sdk';
import type { OperationInputMap } from '@wathba/sdk/raw';

declare const client: WathbaClient;

const otp: SendOtpInput = {
  projectId: 'prj_types',
  environmentId: 'env_types',
  email: 'user@example.com',
  purpose: 'login',
  idempotencyKey: asIdempotencyKey('idem_types_otp'),
};
const result: Promise<WathbaOutcome<SendOtpResult>> = client.otp.send(otp);
void result;

const paymentProduct: CreatePaymentProductInput = {
  projectId: 'prj_types',
  environmentId: 'env_types',
  name: 'Premium plan',
  prices: [{ amountMinor: 10_000, currency: 'SAR' }],
  idempotencyKey: asIdempotencyKey('idem_types_payment_product'),
};
const paymentOutcome: Promise<WathbaOutcome<CreatePaymentProductResult>> =
  client.payments.createProduct(paymentProduct);
void paymentOutcome;

const shipment: CreateShipmentInput = {
  projectId: 'prj_types',
  environmentId: 'env_types',
  mode: 'order_first',
  amountMinor: 5_000,
  currency: 'SAR',
  recipient: {
    name: 'Customer',
    email: 'customer@example.com',
    phone: '966500000000',
    address: { line: 'King Fahd Road', cityId: 'riyadh' },
  },
  items: [{ name: 'Item', quantity: 1, amountMinor: 1_000 }],
  parcel: { weightGrams: 1_000 },
  idempotencyKey: asIdempotencyKey('idem_types_shipment'),
};
const shipmentOutcome: Promise<WathbaOutcome<CreateShipmentResult>> =
  client.shipping.create(shipment);
void shipmentOutcome;

const shipmentStatus: GetShipmentExecutionStatusInput = {
  projectId: 'prj_types',
  executionId: 'exe_types',
};
const shipmentStatusOutcome: Promise<
  WathbaOutcome<GetShipmentExecutionStatusResult>
> = client.shipping.getStatus(shipmentStatus);
void shipmentStatusOutcome;

function useOutcome(outcome: WathbaOutcome<CreateShipmentResult>): string {
  if (outcome.kind === 'action_required') return outcome.actionRef.browserUrl;
  return outcome.value.executionId;
}
void useOutcome;

const linkQuery: OperationInputMap['listPaymentLinks']['query'] = { status: 'active' };
void linkQuery;

const billingEffect: WathbaProblem['billingEffect'] = 'none';
void billingEffect;

// @ts-expect-error OTP is send-only in the pinned launch contract.
client.otp.verify(otp);

// @ts-expect-error Idempotency strings must be validated and branded first.
client.otp.send({ ...otp, idempotencyKey: 'unbranded' });

// @ts-expect-error Generated query enums reject values outside the OpenAPI contract.
const invalidLinkQuery: OperationInputMap['listPaymentLinks']['query'] = { status: 'unknown_value' };
void invalidLinkQuery;

// @ts-expect-error Stable problem billing effects are a closed contract.
const invalidBillingEffect: WathbaProblem['billingEffect'] = 'maybe';
void invalidBillingEffect;

// @ts-expect-error Shipping only accepts canonical published mode values.
client.shipping.create({ ...shipment, mode: 'choose_any_provider' });

// @ts-expect-error Payment product commands require a branded idempotency key.
client.payments.createProduct({ ...paymentProduct, idempotencyKey: 'unbranded' });
