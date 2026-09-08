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

type OperationInput = OperationInputMap['getEjarContract'];

export type GetEjarContractInput = Readonly<
  OperationInput['body']['input'] & {
    readonly projectId: OperationInput['path']['projectId'];
    readonly environmentId: OperationInput['body']['environmentId'];
    readonly idempotencyKey: OperationInput['idempotencyKey'];
  }
>;
export type GetEjarContractResult = OperationResponseMap['getEjarContract'];

export class WathbaEjarClient {
  constructor(private readonly raw: RawWathbaClient) {}

  getContract(input: GetEjarContractInput): Promise<WathbaOutcome<GetEjarContractResult>> {
    const { projectId, environmentId, idempotencyKey, ...lookup } = input;
    return captureWathbaOutcome(
      () => this.raw.execute('getEjarContract', {
        path: { projectId },
        body: { environmentId, input: lookup },
        idempotencyKey,
      }),
      classifyOperationExecution,
    );
  }
}
