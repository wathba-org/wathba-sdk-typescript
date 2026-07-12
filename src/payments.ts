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

type CreateProductOperation = OperationInputMap['createPaymentProduct'];
type CreateLinkOperation = OperationInputMap['createPaymentLink'];
type ListProductsOperation = OperationInputMap['listPaymentProducts'];
type GetProductOperation = OperationInputMap['getPaymentProduct'];
type UpdateProductOperation = OperationInputMap['updatePaymentProduct'];
type ArchiveProductOperation = OperationInputMap['archivePaymentProduct'];
type PromoteProductOperation = OperationInputMap['promotePaymentProduct'];
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

export type CreatePaymentProductInput = Readonly<
  CreateProductOperation['body'] & {
    readonly projectId: CreateProductOperation['path']['projectId'];
    readonly idempotencyKey: CreateProductOperation['idempotencyKey'];
  }
>;
export type CreatePaymentProductResult =
  OperationResponseMap['createPaymentProduct'];

export type CreatePaymentLinkInput = Readonly<
  CreateLinkOperation['body'] & {
    readonly projectId: CreateLinkOperation['path']['projectId'];
    readonly idempotencyKey: CreateLinkOperation['idempotencyKey'];
  }
>;
export type CreatePaymentLinkResult = OperationResponseMap['createPaymentLink'];

export type ListPaymentProductsInput = Readonly<
  ListProductsOperation['path'] & { readonly query?: ListProductsOperation['query'] }
>;
export type ListPaymentProductsResult = OperationResponseMap['listPaymentProducts'];

export type GetPaymentProductInput = Readonly<GetProductOperation['path']>;
export type GetPaymentProductResult = OperationResponseMap['getPaymentProduct'];

export type UpdatePaymentProductInput = Readonly<
  UpdateProductOperation['body'] &
    UpdateProductOperation['path'] & {
      readonly idempotencyKey: UpdateProductOperation['idempotencyKey'];
    }
>;
export type UpdatePaymentProductResult = OperationResponseMap['updatePaymentProduct'];

export type ArchivePaymentProductInput = Readonly<
  ArchiveProductOperation['path'] & {
    readonly idempotencyKey: ArchiveProductOperation['idempotencyKey'];
  }
>;
export type ArchivePaymentProductResult = OperationResponseMap['archivePaymentProduct'];

export type PromotePaymentProductInput = Readonly<
  PromoteProductOperation['path'] & {
    readonly idempotencyKey: PromoteProductOperation['idempotencyKey'];
  }
>;
export type PromotePaymentProductResult = OperationResponseMap['promotePaymentProduct'];

export type ListPaymentLinksInput = Readonly<
  ListLinksOperation['path'] & { readonly query?: ListLinksOperation['query'] }
>;
export type ListPaymentLinksResult = OperationResponseMap['listPaymentLinks'];

export type GetPaymentLinkInput = Readonly<GetLinkOperation['path']>;
export type GetPaymentLinkResult = OperationResponseMap['getPaymentLink'];

export type UpdatePaymentLinkInput = Readonly<
  UpdateLinkOperation['body'] &
    UpdateLinkOperation['path'] & {
      readonly idempotencyKey: UpdateLinkOperation['idempotencyKey'];
    }
>;
export type UpdatePaymentLinkResult = OperationResponseMap['updatePaymentLink'];

export type DeactivatePaymentLinkInput = Readonly<
  DeactivateLinkOperation['path'] & {
    readonly idempotencyKey: DeactivateLinkOperation['idempotencyKey'];
  }
>;
export type DeactivatePaymentLinkResult = OperationResponseMap['deactivatePaymentLink'];

export type ReactivatePaymentLinkInput = Readonly<
  ReactivateLinkOperation['path'] & {
    readonly idempotencyKey: ReactivateLinkOperation['idempotencyKey'];
  }
>;
export type ReactivatePaymentLinkResult = OperationResponseMap['reactivatePaymentLink'];

export type ListPaymentsInput = Readonly<
  ListPaymentsOperation['path'] & { readonly query?: ListPaymentsOperation['query'] }
>;
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

  createProduct(
    input: CreatePaymentProductInput,
  ): Promise<WathbaOutcome<CreatePaymentProductResult>> {
    const { projectId, idempotencyKey, ...body } = input;
    return captureWathbaOutcome(() =>
      this.raw.execute('createPaymentProduct', {
        path: { projectId },
        body,
        idempotencyKey,
      }),
    );
  }

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

  listProducts(
    input: ListPaymentProductsInput,
  ): Promise<WathbaOutcome<ListPaymentProductsResult>> {
    const { projectId, query } = input;
    return captureWathbaOutcome(() =>
      this.raw.execute('listPaymentProducts', {
        path: { projectId },
        ...(query === undefined ? {} : { query }),
      }),
    );
  }

  getProduct(
    input: GetPaymentProductInput,
  ): Promise<WathbaOutcome<GetPaymentProductResult>> {
    return captureWathbaOutcome(() =>
      this.raw.execute('getPaymentProduct', { path: input }),
    );
  }

  updateProduct(
    input: UpdatePaymentProductInput,
  ): Promise<WathbaOutcome<UpdatePaymentProductResult>> {
    const { projectId, productId, idempotencyKey, ...body } = input;
    return captureWathbaOutcome(() =>
      this.raw.execute('updatePaymentProduct', {
        path: { projectId, productId },
        body,
        idempotencyKey,
      }),
    );
  }

  archiveProduct(
    input: ArchivePaymentProductInput,
  ): Promise<WathbaOutcome<ArchivePaymentProductResult>> {
    const { projectId, productId, idempotencyKey } = input;
    return captureWathbaOutcome(() =>
      this.raw.execute('archivePaymentProduct', {
        path: { projectId, productId },
        idempotencyKey,
      }),
    );
  }

  promoteProduct(
    input: PromotePaymentProductInput,
  ): Promise<WathbaOutcome<PromotePaymentProductResult>> {
    const { projectId, productId, idempotencyKey } = input;
    return captureWathbaOutcome(() =>
      this.raw.execute('promotePaymentProduct', {
        path: { projectId, productId },
        idempotencyKey,
      }),
    );
  }

  listLinks(
    input: ListPaymentLinksInput,
  ): Promise<WathbaOutcome<ListPaymentLinksResult>> {
    const { projectId, query } = input;
    return captureWathbaOutcome(() =>
      this.raw.execute('listPaymentLinks', {
        path: { projectId },
        ...(query === undefined ? {} : { query }),
      }),
    );
  }

  getLink(
    input: GetPaymentLinkInput,
  ): Promise<WathbaOutcome<GetPaymentLinkResult>> {
    return captureWathbaOutcome(() =>
      this.raw.execute('getPaymentLink', { path: input }),
    );
  }

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

  reactivateLink(
    input: ReactivatePaymentLinkInput,
  ): Promise<WathbaOutcome<ReactivatePaymentLinkResult>> {
    const { projectId, linkId, idempotencyKey } = input;
    return captureWathbaOutcome(() =>
      this.raw.execute('reactivatePaymentLink', {
        path: { projectId, linkId },
        idempotencyKey,
      }),
    );
  }

  listPayments(
    input: ListPaymentsInput,
  ): Promise<WathbaOutcome<ListPaymentsResult>> {
    const { projectId, query } = input;
    return captureWathbaOutcome(() =>
      this.raw.execute('listPayments', {
        path: { projectId },
        ...(query === undefined ? {} : { query }),
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
