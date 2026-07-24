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

type VerifyOtpOperationInput = OperationInputMap['verifyOtp'];

export type VerifyOtpInput = Readonly<
  VerifyOtpOperationInput['body'] & {
    readonly projectId: VerifyOtpOperationInput['path']['projectId'];
    readonly idempotencyKey: VerifyOtpOperationInput['idempotencyKey'];
  }
>;

export type VerifyOtpResult = OperationResponseMap['verifyOtp'];

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

  verify(input: VerifyOtpInput): Promise<WathbaOutcome<VerifyOtpResult>> {
    return captureWathbaOutcome(
      () =>
        this.raw.execute('verifyOtp', {
          path: { projectId: input.projectId },
          body: {
            environmentId: input.environmentId,
            email: input.email.trim().toLowerCase(),
            otp: input.otp.trim(),
          },
          idempotencyKey: input.idempotencyKey,
        }),
      classifyOperationExecution,
    );
  }
}
