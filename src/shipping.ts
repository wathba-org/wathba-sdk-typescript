import type {
  OperationInputMap,
  OperationResponseMap,
} from './generated/operations.js';
import {
  captureWathbaOutcome,
  classifyOperationExecution,
  type WathbaOutcome,
} from './outcome.js';
import { RawWathbaClient } from './raw-client.js';

type CreateShipmentOperationInput = OperationInputMap['createShipment'];
type GetShipmentExecutionStatusOperationInput =
  OperationInputMap['getShipmentExecutionStatus'];

export type CreateShipmentInput = Readonly<
  CreateShipmentOperationInput['body'] & {
    readonly projectId: CreateShipmentOperationInput['path']['projectId'];
    readonly idempotencyKey: CreateShipmentOperationInput['idempotencyKey'];
  }
>;

export type CreateShipmentResult = OperationResponseMap['createShipment'];

export type GetShipmentExecutionStatusInput = Readonly<
  GetShipmentExecutionStatusOperationInput['path']
>;

export type GetShipmentExecutionStatusResult =
  OperationResponseMap['getShipmentExecutionStatus'];

export class WathbaShippingClient {
  constructor(private readonly raw: RawWathbaClient) {}

  create(input: CreateShipmentInput): Promise<WathbaOutcome<CreateShipmentResult>> {
    const { projectId, idempotencyKey, ...body } = input;
    return captureWathbaOutcome(
      () =>
        this.raw.execute('createShipment', {
          path: { projectId },
          body,
          idempotencyKey,
        }),
      classifyOperationExecution,
    );
  }

  getStatus(
    input: GetShipmentExecutionStatusInput,
  ): Promise<WathbaOutcome<GetShipmentExecutionStatusResult>> {
    return captureWathbaOutcome(
      () =>
        this.raw.execute('getShipmentExecutionStatus', {
          path: input,
        }),
      classifyOperationExecution,
    );
  }
}
