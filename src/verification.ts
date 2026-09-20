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

type SendInput = OperationInputMap['sendAuthenticaOtp'];
type VerifyInput = OperationInputMap['verifyAuthenticaOtp'];

export type SendVerificationCodeInput = Readonly<SendInput['body']['input'] & {
  readonly projectId: SendInput['path']['projectId'];
  readonly environmentId: SendInput['body']['environmentId'];
  readonly idempotencyKey: SendInput['idempotencyKey'];
}>;
export type CheckVerificationCodeInput = Readonly<VerifyInput['body']['input'] & {
  readonly projectId: VerifyInput['path']['projectId'];
  readonly environmentId: VerifyInput['body']['environmentId'];
  readonly idempotencyKey: VerifyInput['idempotencyKey'];
}>;
export type GetVerificationExecutionStatusInput = Readonly<
  OperationInputMap['getAuthenticaExecutionStatus']['path']
>;
export type SendVerificationCodeResult = OperationResponseMap['sendAuthenticaOtp'];
export type CheckVerificationCodeResult = OperationResponseMap['verifyAuthenticaOtp'];
export type GetVerificationExecutionStatusResult = OperationResponseMap['getAuthenticaExecutionStatus'];

/** Project-linked verification candidate; uses Wathba credentials and exact SAR only. */
export class WathbaVerificationClient {
  constructor(private readonly raw: RawWathbaClient) {}

  sendOtp(input: SendVerificationCodeInput): Promise<WathbaOutcome<SendVerificationCodeResult>> {
    const { projectId, environmentId, idempotencyKey, ...send } = input;
    return captureWathbaOutcome(
      () => this.raw.execute('sendAuthenticaOtp', {
        path: { projectId },
        body: { environmentId, input: send },
        idempotencyKey,
      }),
      classifyOperationExecution,
    );
  }

  verifyOtp(input: CheckVerificationCodeInput): Promise<WathbaOutcome<CheckVerificationCodeResult>> {
    const { projectId, environmentId, idempotencyKey, ...verification } = input;
    return captureWathbaOutcome(
      () => this.raw.execute('verifyAuthenticaOtp', {
        path: { projectId },
        body: { environmentId, input: verification },
        idempotencyKey,
      }),
      classifyOperationExecution,
    );
  }

  /** Reads the existing execution without another send, check or wallet operation. */
  getExecutionStatus(input: GetVerificationExecutionStatusInput): Promise<WathbaOutcome<GetVerificationExecutionStatusResult>> {
    return captureWathbaOutcome(
      () => this.raw.execute('getAuthenticaExecutionStatus', { path: input }),
      classifyOperationExecution,
    );
  }
}
