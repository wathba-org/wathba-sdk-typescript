import {
  WathbaClient,
  asIdempotencyKey,
  type CreatePaymentIntentInput,
  type CreatePaymentIntentResult,
  type CreateShipmentInput,
  type CreateShipmentResult,
  type GetShipmentExecutionStatusInput,
  type GetShipmentExecutionStatusResult,
  type SendOtpInput,
  type SendOtpResult,
  type VerifyOtpInput,
  type VerifyOtpResult,
  type WathbaOutcome,
  type WathbaProblem,
  type SendVerificationCodeInput,
  type SendVerificationCodeResult,
  type CheckVerificationCodeInput,
} from '@wathba-cli/sdk';
import type { OperationInputMap } from '@wathba-cli/sdk/raw';

declare const client: WathbaClient;

const authenticaSend: SendVerificationCodeInput = {
  projectId: 'prj_types', environmentId: 'env_types',
  recipient: { email: 'user@example.com' },
  idempotencyKey: asIdempotencyKey('idem_authentica_send'),
};
const authenticaResult: Promise<WathbaOutcome<SendVerificationCodeResult>> = client.verification.sendOtp(authenticaSend);
void authenticaResult;
const authenticaVerify: CheckVerificationCodeInput = {
  projectId: 'prj_types', environmentId: 'env_types', sendExecutionId: 'exj_original',
  otp: '0123', idempotencyKey: asIdempotencyKey('idem_authentica_verify'),
};
void client.verification.verifyOtp(authenticaVerify);
// @ts-expect-error The linked application's channel applies; a send cannot pick one.
void client.verification.sendOtp({ ...authenticaSend, channel: 'email' });
// @ts-expect-error The published rate is charged; a send names no cost ceiling.
void client.verification.sendOtp({ ...authenticaSend, maxCostSar: '0.0001' });
// @ts-expect-error A verification code must preserve leading zeroes.
void client.verification.verifyOtp({ ...authenticaVerify, otp: 1234 });
// @ts-expect-error Original-send verification cannot change its recipient.
void client.verification.verifyOtp({ ...authenticaVerify, recipient: { email: 'other@example.com' } });

const otp: SendOtpInput = {
  projectId: 'prj_types',
  environmentId: 'env_types',
  email: 'user@example.com',
  purpose: 'login',
  idempotencyKey: asIdempotencyKey('idem_types_otp'),
};
const result: Promise<WathbaOutcome<SendOtpResult>> = client.otp.send(otp);
void result;

const otpVerification: VerifyOtpInput = {
  projectId: 'prj_types',
  environmentId: 'env_types',
  email: 'user@example.com',
  otp: '482913',
  idempotencyKey: asIdempotencyKey('idem_types_otp_verify'),
};
const verificationResult: Promise<WathbaOutcome<VerifyOtpResult>> =
  client.otp.verify(otpVerification);
void verificationResult;

const paymentIntent: CreatePaymentIntentInput = {
  projectId: 'prj_types',
  environmentId: 'env_types',
  amountMinor: 10_000,
  currency: 'SAR',
  clientBinding: { kind: 'web_origin', value: 'https://shop.example.test' },
  allowedPaymentMethods: ['card', 'apple_pay', 'stc_pay'],
  idempotencyKey: asIdempotencyKey('idem_types_payment_intent'),
};
const paymentOutcome: Promise<WathbaOutcome<CreatePaymentIntentResult>> =
  client.payments.createIntent(paymentIntent);
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

const intentBody: OperationInputMap['createPaymentIntent']['body'] = {
  environmentId: 'env_types',
  amountMinor: 10_000,
  currency: 'SAR',
  clientBinding: { kind: 'web_origin', value: 'https://shop.example.test' },
};
void intentBody;

const billingEffect: WathbaProblem['billingEffect'] = 'none';
void billingEffect;

// @ts-expect-error OTP verification requires the code supplied by the member.
client.otp.verify(otp);

// @ts-expect-error Idempotency strings must be validated and branded first.
client.otp.send({ ...otp, idempotencyKey: 'unbranded' });

const invalidPaymentMethods: OperationInputMap['createPaymentIntent']['body'] = {
  ...intentBody,
  // @ts-expect-error Generated wallet enums reject unsupported methods.
  allowedPaymentMethods: ['cash'],
};
void invalidPaymentMethods;

// @ts-expect-error Stable problem billing effects are a closed contract.
const invalidBillingEffect: WathbaProblem['billingEffect'] = 'maybe';
void invalidBillingEffect;

// @ts-expect-error Shipping only accepts canonical published mode values.
client.shipping.create({ ...shipment, mode: 'choose_any_provider' });

// @ts-expect-error Payment Intent commands require a branded idempotency key.
client.payments.createIntent({ ...paymentIntent, idempotencyKey: 'unbranded' });

const ejarInput: import('@wathba-cli/sdk').GetEjarContractInput = {
  projectId: 'prj_types', environmentId: 'env_types', contractNumber: '10000000000',
  idempotencyKey: asIdempotencyKey('idem_types_ejar_lookup'),
};
const ejarOutcome: Promise<WathbaOutcome<import('@wathba-cli/sdk').GetEjarContractResult>> =
  client.ejar.getContract(ejarInput);
void ejarOutcome;
function useEjarResult(result: import('@wathba-cli/sdk').GetEjarContractResult): string {
  if (result.state === 'pending') return result.executionId;
  if (result.result.found) return result.result.contract.contractType;
  const empty: null = result.result.contract;
  return String(empty);
}
void useEjarResult;
// @ts-expect-error Contract numbers remain strings rather than JavaScript numbers.
client.ejar.getContract({ ...ejarInput, contractNumber: 10000000000 });
// @ts-expect-error Each lookup intent requires a branded idempotency key.
client.ejar.getContract({ ...ejarInput, idempotencyKey: 'unbranded' });
