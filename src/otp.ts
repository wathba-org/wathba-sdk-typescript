import type { OperationInputMap, OperationResponseMap } from './generated/operations.js';
import {
  captureWathbaOutcome,
  classifyOperationExecution,
  type WathbaOutcome,
} from './outcome.js';
import { RawWathbaClient } from './raw-client.js';

type SendOtpOperationInput = OperationInputMap['sendOtp'];

export type SendOtpInput = Readonly<
  SendOtpOperationInput['body'] & {
    readonly projectId: SendOtpOperationInput['path']['projectId'];
    readonly idempotencyKey: SendOtpOperationInput['idempotencyKey'];
  }
>;

export type SendOtpResult = OperationResponseMap['sendOtp'];

export class WathbaOtpClient {
  constructor(private readonly raw: RawWathbaClient) {}

  send(input: SendOtpInput): Promise<WathbaOutcome<SendOtpResult>> {
    return captureWathbaOutcome(
      () =>
        this.raw.execute('sendOtp', {
          path: { projectId: input.projectId },
          body: {
            environmentId: input.environmentId,
            email: input.email.trim().toLowerCase(),
            ...(input.purpose === undefined ? {} : { purpose: input.purpose }),
          },
          idempotencyKey: input.idempotencyKey,
        }),
      classifyOperationExecution,
    );
  }
}
