import { WathbaSdkError } from './errors.js';

type VerificationContext =
  | { readonly operationCode: 'sendOtp' }
  | { readonly operationCode: 'verifyOtp'; readonly sendExecutionId: string }
  | { readonly executionId: string };

/** Cross-field constraints and response identity are not expressible in generated field schemas. */
export function verificationRequestContext(operationId: string, request: unknown): VerificationContext | undefined {
  if (!['sendAuthenticaOtp', 'verifyAuthenticaOtp', 'getAuthenticaExecutionStatus'].includes(operationId)) return undefined;
  if (!isRecord(request)) throw new WathbaSdkError('wathba_invalid_request');
  if (operationId === 'getAuthenticaExecutionStatus') {
    if (!isRecord(request.path) || typeof request.path.executionId !== 'string') throw new WathbaSdkError('wathba_invalid_request');
    return { executionId: request.path.executionId };
  }
  if (!isRecord(request.body) || !isRecord(request.body.input)) throw new WathbaSdkError('wathba_invalid_request');
  const input = request.body.input;
  if (operationId === 'verifyAuthenticaOtp') {
    if (typeof input.sendExecutionId !== 'string') throw new WathbaSdkError('wathba_invalid_request');
    return { operationCode: 'verifyOtp', sendExecutionId: input.sendExecutionId };
  }
  // The application's configured channel applies, so a send result carries whichever one it used.
  if (!isRecord(input.recipient)) throw new WathbaSdkError('wathba_invalid_request');
  return { operationCode: 'sendOtp' };
}

/** Called after shape validation, against primitive values captured before dispatch. */
export function matchesVerificationContext(context: VerificationContext | undefined, response: unknown): boolean {
  if (context === undefined) return true;
  if (!isRecord(response)) return false;
  if ('executionId' in context) return response.executionId === context.executionId;
  if (response.operationCode !== context.operationCode) return false;
  if (response.state !== 'succeeded') return true;
  if (!isRecord(response.result)) return false;
  return context.operationCode === 'sendOtp' || response.result.sendExecutionId === context.sendExecutionId;
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
