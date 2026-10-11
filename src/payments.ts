import type {
  OperationInputMap,
  OperationResponseMap,
} from './generated/operations.js';
import {
  captureWathbaOutcome,
  type WathbaOutcome,
  type WathbaOutcomeClassification,
} from './outcome.js';
import { RawWathbaClient } from './raw-client.js';

type CreateIntentOperation = OperationInputMap['createPaymentIntent'];
type ListIntentsOperation = OperationInputMap['listPaymentIntents'];
type GetIntentOperation = OperationInputMap['getPaymentIntent'];
type CancelIntentOperation = OperationInputMap['cancelPaymentIntent'];
type CreateCheckoutOperation = OperationInputMap['createCheckoutSession'];
type CreateLinkOperation = OperationInputMap['createPaymentLink'];
type ListLinksOperation = OperationInputMap['listPaymentLinks'];
type GetLinkOperation = OperationInputMap['getPaymentLink'];
type UpdateLinkOperation = OperationInputMap['updatePaymentLink'];
type DeactivateLinkOperation = OperationInputMap['deactivatePaymentLink'];
type ReactivateLinkOperation = OperationInputMap['reactivatePaymentLink'];
type ListPaymentsOperation = OperationInputMap['listPayments'];
type GetPaymentOperation = OperationInputMap['getPayment'];
type RequestRefundOperation = OperationInputMap['requestPaymentRefund'];
type GetRefundOperation = OperationInputMap['getPaymentRefund'];
type ListRefundsOperation = OperationInputMap['listPaymentRefunds'];

/**
 * Creates a single-use Payment Intent from trusted server code. Amounts use
 * the smallest currency unit. The returned checkout token is short-lived and
 * may be passed only to Wathba Checkout; never persist or log it.
 */
export type CreatePaymentIntentInput = Readonly<
  CreateIntentOperation['body'] & {
    readonly projectId: CreateIntentOperation['path']['projectId'];
    readonly idempotencyKey: CreateIntentOperation['idempotencyKey'];
  }
>;
export type CreatePaymentIntentResult = OperationResponseMap['createPaymentIntent'];

export type ListPaymentIntentsInput = Readonly<ListIntentsOperation['path']>;
export type ListPaymentIntentsResult = OperationResponseMap['listPaymentIntents'];

export type GetPaymentIntentInput = Readonly<GetIntentOperation['path']>;
export type GetPaymentIntentResult = OperationResponseMap['getPaymentIntent'];

export type CancelPaymentIntentInput = Readonly<
  CancelIntentOperation['body'] &
    CancelIntentOperation['path'] & {
      readonly idempotencyKey: CancelIntentOperation['idempotencyKey'];
    }
>;
export type CancelPaymentIntentResult = OperationResponseMap['cancelPaymentIntent'];

export type CreateCheckoutSessionInput = Readonly<
  CreateCheckoutOperation['body'] &
    CreateCheckoutOperation['path'] & {
      readonly idempotencyKey: CreateCheckoutOperation['idempotencyKey'];
    }
>;
export type CreateCheckoutSessionResult = OperationResponseMap['createCheckoutSession'];

/**
 * Payment Links were a shareable wrapper around the same Payment Intent and
 * hosted Wathba Checkout engine.
 *
 * @deprecated Payment Links were deprecated on 2026-10-10 and sunset on
 * 2026-12-31. Use `payments.createIntent` with hosted Wathba Checkout instead.
 */
export type CreatePaymentLinkInput = Readonly<
  CreateLinkOperation['body'] & {
    readonly projectId: CreateLinkOperation['path']['projectId'];
    readonly idempotencyKey: CreateLinkOperation['idempotencyKey'];
  }
>;
/**
 * @deprecated Payment Links were deprecated on 2026-10-10 and sunset on
 * 2026-12-31. Use `payments.createIntent` with hosted Wathba Checkout instead.
 */
export type CreatePaymentLinkResult = OperationResponseMap['createPaymentLink'];

/**
 * @deprecated Payment Links were deprecated on 2026-10-10 and sunset on
 * 2026-12-31. Use `payments.createIntent` with hosted Wathba Checkout instead.
 */
export type ListPaymentLinksInput = Readonly<ListLinksOperation['path']>;
/**
 * @deprecated Payment Links were deprecated on 2026-10-10 and sunset on
 * 2026-12-31. Use `payments.createIntent` with hosted Wathba Checkout instead.
 */
export type ListPaymentLinksResult = OperationResponseMap['listPaymentLinks'];

/**
 * @deprecated Payment Links were deprecated on 2026-10-10 and sunset on
 * 2026-12-31. Use `payments.createIntent` with hosted Wathba Checkout instead.
 */
export type GetPaymentLinkInput = Readonly<GetLinkOperation['path']>;
/**
 * @deprecated Payment Links were deprecated on 2026-10-10 and sunset on
 * 2026-12-31. Use `payments.createIntent` with hosted Wathba Checkout instead.
 */
export type GetPaymentLinkResult = OperationResponseMap['getPaymentLink'];

/**
 * @deprecated Payment Links were deprecated on 2026-10-10 and sunset on
 * 2026-12-31. Use `payments.createIntent` with hosted Wathba Checkout instead.
 */
export type UpdatePaymentLinkInput = Readonly<
  UpdateLinkOperation['body'] &
    UpdateLinkOperation['path'] & {
      readonly idempotencyKey: UpdateLinkOperation['idempotencyKey'];
    }
>;
/**
 * @deprecated Payment Links were deprecated on 2026-10-10 and sunset on
 * 2026-12-31. Use `payments.createIntent` with hosted Wathba Checkout instead.
 */
export type UpdatePaymentLinkResult = OperationResponseMap['updatePaymentLink'];

/**
 * @deprecated Payment Links were deprecated on 2026-10-10 and sunset on
 * 2026-12-31. Use `payments.createIntent` with hosted Wathba Checkout instead.
 */
export type DeactivatePaymentLinkInput = Readonly<
  DeactivateLinkOperation['path'] & {
    readonly idempotencyKey: DeactivateLinkOperation['idempotencyKey'];
  }
>;
/**
 * @deprecated Payment Links were deprecated on 2026-10-10 and sunset on
 * 2026-12-31. Use `payments.createIntent` with hosted Wathba Checkout instead.
 */
export type DeactivatePaymentLinkResult =
  OperationResponseMap['deactivatePaymentLink'];

/**
 * @deprecated Payment Links were deprecated on 2026-10-10 and sunset on
 * 2026-12-31. Use `payments.createIntent` with hosted Wathba Checkout instead.
 */
export type ReactivatePaymentLinkInput = Readonly<
  ReactivateLinkOperation['body'] &
    ReactivateLinkOperation['path'] & {
      readonly idempotencyKey: ReactivateLinkOperation['idempotencyKey'];
    }
>;
/**
 * @deprecated Payment Links were deprecated on 2026-10-10 and sunset on
 * 2026-12-31. Use `payments.createIntent` with hosted Wathba Checkout instead.
 */
export type ReactivatePaymentLinkResult =
  OperationResponseMap['reactivatePaymentLink'];

export type ListPaymentsInput = Readonly<ListPaymentsOperation['path']>;
export type ListPaymentsResult = OperationResponseMap['listPayments'];

export type GetPaymentInput = Readonly<GetPaymentOperation['path']>;
export type GetPaymentResult = OperationResponseMap['getPayment'];

export type RequestPaymentRefundInput = Readonly<
  RequestRefundOperation['body'] &
    RequestRefundOperation['path'] & {
      readonly idempotencyKey: RequestRefundOperation['idempotencyKey'];
    }
>;
export type RequestPaymentRefundResult =
  OperationResponseMap['requestPaymentRefund'];

export type GetPaymentRefundInput = Readonly<GetRefundOperation['path']>;
export type GetPaymentRefundResult = OperationResponseMap['getPaymentRefund'];

export type ListPaymentRefundsInput = Readonly<ListRefundsOperation['path']>;
export type ListPaymentRefundsResult = OperationResponseMap['listPaymentRefunds'];

export class WathbaPaymentsClient {
  constructor(private readonly raw: RawWathbaClient) {}

  createIntent(
    input: CreatePaymentIntentInput,
  ): Promise<WathbaOutcome<CreatePaymentIntentResult>> {
    const { projectId, idempotencyKey, ...body } = input;
    return captureWathbaOutcome(
      () =>
        this.raw.execute('createPaymentIntent', {
          path: { projectId },
          body,
          idempotencyKey,
        }),
      classifyPaymentIntent,
    );
  }

  listIntents(
    input: ListPaymentIntentsInput,
  ): Promise<WathbaOutcome<ListPaymentIntentsResult>> {
    const { projectId } = input;
    return captureWathbaOutcome(() =>
      this.raw.execute('listPaymentIntents', {
        path: { projectId },
      }),
    );
  }

  getIntent(
    input: GetPaymentIntentInput,
  ): Promise<WathbaOutcome<GetPaymentIntentResult>> {
    return captureWathbaOutcome(
      () => this.raw.execute('getPaymentIntent', { path: input }),
      classifyPaymentIntent,
    );
  }

  cancelIntent(
    input: CancelPaymentIntentInput,
  ): Promise<WathbaOutcome<CancelPaymentIntentResult>> {
    const { projectId, paymentIntentId, idempotencyKey, ...body } = input;
    return captureWathbaOutcome(
      () =>
        this.raw.execute('cancelPaymentIntent', {
          path: { projectId, paymentIntentId },
          body,
          idempotencyKey,
        }),
      classifyPaymentIntent,
    );
  }

  createCheckoutSession(
    input: CreateCheckoutSessionInput,
  ): Promise<WathbaOutcome<CreateCheckoutSessionResult>> {
    const { projectId, paymentIntentId, idempotencyKey, ...body } = input;
    return captureWathbaOutcome(
      () =>
        this.raw.execute('createCheckoutSession', {
          path: { projectId, paymentIntentId },
          body,
          idempotencyKey,
        }),
      classifyPaymentIntent,
    );
  }

  /**
   * @deprecated Payment Links were deprecated on 2026-10-10 and sunset on
   * 2026-12-31: the API rejects new and reactivated links with
   * `410 payment_links_deprecated`, and existing links work until the sunset.
   * Use {@link WathbaPaymentsClient.createIntent} and open the returned
   * `checkout` with hosted Wathba Checkout; call
   * {@link WathbaPaymentsClient.createCheckoutSession} for a fresh checkout
   * session, and {@link WathbaPaymentsClient.getIntent} to read the outcome.
   */
  createLink(
    input: CreatePaymentLinkInput,
  ): Promise<WathbaOutcome<CreatePaymentLinkResult>> {
    const { projectId, idempotencyKey, ...body } = input;
    return captureWathbaOutcome(() =>
      this.raw.execute('createPaymentLink', {
        path: { projectId },
        body,
        idempotencyKey,
      }),
    );
  }

  /**
   * @deprecated Payment Links were deprecated on 2026-10-10 and sunset on
   * 2026-12-31: the API rejects new and reactivated links with
   * `410 payment_links_deprecated`, and existing links work until the sunset.
   * Use {@link WathbaPaymentsClient.createIntent} and open the returned
   * `checkout` with hosted Wathba Checkout; call
   * {@link WathbaPaymentsClient.createCheckoutSession} for a fresh checkout
   * session, and {@link WathbaPaymentsClient.getIntent} to read the outcome.
   */
  listLinks(
    input: ListPaymentLinksInput,
  ): Promise<WathbaOutcome<ListPaymentLinksResult>> {
    const { projectId } = input;
    return captureWathbaOutcome(() =>
      this.raw.execute('listPaymentLinks', {
        path: { projectId },
      }),
    );
  }

  /**
   * @deprecated Payment Links were deprecated on 2026-10-10 and sunset on
   * 2026-12-31: the API rejects new and reactivated links with
   * `410 payment_links_deprecated`, and existing links work until the sunset.
   * Use {@link WathbaPaymentsClient.createIntent} and open the returned
   * `checkout` with hosted Wathba Checkout; call
   * {@link WathbaPaymentsClient.createCheckoutSession} for a fresh checkout
   * session, and {@link WathbaPaymentsClient.getIntent} to read the outcome.
   */
  getLink(
    input: GetPaymentLinkInput,
  ): Promise<WathbaOutcome<GetPaymentLinkResult>> {
    return captureWathbaOutcome(() =>
      this.raw.execute('getPaymentLink', { path: input }),
    );
  }

  /**
   * @deprecated Payment Links were deprecated on 2026-10-10 and sunset on
   * 2026-12-31: the API rejects new and reactivated links with
   * `410 payment_links_deprecated`, and existing links work until the sunset.
   * Use {@link WathbaPaymentsClient.createIntent} and open the returned
   * `checkout` with hosted Wathba Checkout; call
   * {@link WathbaPaymentsClient.createCheckoutSession} for a fresh checkout
   * session, and {@link WathbaPaymentsClient.getIntent} to read the outcome.
   */
  updateLink(
    input: UpdatePaymentLinkInput,
  ): Promise<WathbaOutcome<UpdatePaymentLinkResult>> {
    const { projectId, linkId, idempotencyKey, ...body } = input;
    return captureWathbaOutcome(() =>
      this.raw.execute('updatePaymentLink', {
        path: { projectId, linkId },
        body,
        idempotencyKey,
      }),
    );
  }

  /**
   * @deprecated Payment Links were deprecated on 2026-10-10 and sunset on
   * 2026-12-31: the API rejects new and reactivated links with
   * `410 payment_links_deprecated`, and existing links work until the sunset.
   * Use {@link WathbaPaymentsClient.createIntent} and open the returned
   * `checkout` with hosted Wathba Checkout; call
   * {@link WathbaPaymentsClient.createCheckoutSession} for a fresh checkout
   * session, and {@link WathbaPaymentsClient.getIntent} to read the outcome.
   */
  deactivateLink(
    input: DeactivatePaymentLinkInput,
  ): Promise<WathbaOutcome<DeactivatePaymentLinkResult>> {
    const { projectId, linkId, idempotencyKey } = input;
    return captureWathbaOutcome(() =>
      this.raw.execute('deactivatePaymentLink', {
        path: { projectId, linkId },
        idempotencyKey,
      }),
    );
  }

  /**
   * @deprecated Payment Links were deprecated on 2026-10-10 and sunset on
   * 2026-12-31: the API rejects new and reactivated links with
   * `410 payment_links_deprecated`, and existing links work until the sunset.
   * Use {@link WathbaPaymentsClient.createIntent} and open the returned
   * `checkout` with hosted Wathba Checkout; call
   * {@link WathbaPaymentsClient.createCheckoutSession} for a fresh checkout
   * session, and {@link WathbaPaymentsClient.getIntent} to read the outcome.
   */
  reactivateLink(
    input: ReactivatePaymentLinkInput,
  ): Promise<WathbaOutcome<ReactivatePaymentLinkResult>> {
    const { projectId, linkId, idempotencyKey, ...body } = input;
    return captureWathbaOutcome(() =>
      this.raw.execute('reactivatePaymentLink', {
        path: { projectId, linkId },
        body,
        idempotencyKey,
      }),
    );
  }

  listPayments(
    input: ListPaymentsInput,
  ): Promise<WathbaOutcome<ListPaymentsResult>> {
    const { projectId } = input;
    return captureWathbaOutcome(() =>
      this.raw.execute('listPayments', {
        path: { projectId },
      }),
    );
  }

  getPayment(input: GetPaymentInput): Promise<WathbaOutcome<GetPaymentResult>> {
    return captureWathbaOutcome(
      () => this.raw.execute('getPayment', { path: input }),
      classifyPayment,
    );
  }

  requestRefund(
    input: RequestPaymentRefundInput,
  ): Promise<WathbaOutcome<RequestPaymentRefundResult>> {
    const { projectId, paymentId, idempotencyKey, ...body } = input;
    return captureWathbaOutcome(
      () =>
        this.raw.execute('requestPaymentRefund', {
          path: { projectId, paymentId },
          body,
          idempotencyKey,
        }),
      classifyRefund,
    );
  }

  getRefund(
    input: GetPaymentRefundInput,
  ): Promise<WathbaOutcome<GetPaymentRefundResult>> {
    return captureWathbaOutcome(
      () => this.raw.execute('getPaymentRefund', { path: input }),
      classifyRefund,
    );
  }

  listRefunds(
    input: ListPaymentRefundsInput,
  ): Promise<WathbaOutcome<ListPaymentRefundsResult>> {
    return captureWathbaOutcome(() =>
      this.raw.execute('listPaymentRefunds', { path: input }),
    );
  }
}

function classifyPaymentIntent(
  intent: CreatePaymentIntentResult | GetPaymentIntentResult,
): WathbaOutcomeClassification {
  return intent.status === 'succeeded' ||
    intent.status === 'failed' ||
    intent.status === 'cancelled'
    ? 'final'
    : 'pending';
}

function classifyPayment(
  payment: GetPaymentResult,
): WathbaOutcomeClassification {
  return payment.status === 'created' ||
    payment.status === 'provider_pending' ||
    payment.status === 'unknown'
    ? 'pending'
    : 'final';
}

function classifyRefund(
  refund: RequestPaymentRefundResult | GetPaymentRefundResult,
): WathbaOutcomeClassification {
  return refund.status === 'requested' ||
    refund.status === 'provider_pending' ||
    refund.status === 'unknown'
    ? 'pending'
    : 'final';
}
