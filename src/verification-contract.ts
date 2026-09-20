import { WathbaSdkError } from './errors.js';

type VerificationContext =
  | { readonly operationCode: 'sendOtp'; readonly channel?: string }
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
  if (!isRecord(input.recipient) ||
      (input.channel === 'email' && !('email' in input.recipient)) ||
      ((input.channel === 'sms' || input.channel === 'whatsapp') && !('phone' in input.recipient)) ||
      (input.channel === 'whatsapp' && input.templateHandle !== undefined)) {
    throw new WathbaSdkError('wathba_invalid_request');
  }
  return { operationCode: 'sendOtp', ...(typeof input.channel === 'string' ? { channel: input.channel } : {}) };
}

/** Called after shape validation, against primitive values captured before dispatch. */
export function matchesVerificationContext(context: VerificationContext | undefined, response: unknown): boolean {
  if (context === undefined) return true;
  if (!isRecord(response)) return false;
  if ('executionId' in context) return response.executionId === context.executionId;
  if (response.operationCode !== context.operationCode) return false;
  if (response.state !== 'succeeded') return true;
  if (!isRecord(response.result)) return false;
  if (context.operationCode === 'verifyOtp') return response.result.sendExecutionId === context.sendExecutionId;
  return context.channel === undefined || response.result.deliveryMethod === context.channel;
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
