import type { OperationResponseMap } from './generated/operations.js';
import { WathbaSdkError } from './errors.js';
import { WathbaApiError, type WathbaProblem } from './problem.js';

export type WathbaActionRef = NonNullable<WathbaProblem['actionRef']>;

export type WathbaOutcome<Value> =
  | { readonly kind: 'final'; readonly value: Value }
  | { readonly kind: 'pending'; readonly value: Value }
  | {
      readonly kind: 'action_required';
      readonly actionRef: WathbaActionRef;
      readonly correlationId: string;
      readonly billingEffect: WathbaProblem['billingEffect'];
    };

export type WathbaOutcomeClassification = 'final' | 'pending';

export async function captureWathbaOutcome<Value>(
  operation: () => Promise<Value>,
  classify: (value: Value) => WathbaOutcomeClassification = () => 'final',
): Promise<WathbaOutcome<Value>> {
  try {
    const value = await operation();
    return { kind: classify(value), value };
  } catch (error) {
    if (error instanceof WathbaApiError && error.problem.actionRef !== undefined) {
      return {
        kind: 'action_required',
        actionRef: error.problem.actionRef,
        correlationId: error.problem.correlationId,
        billingEffect: error.problem.billingEffect,
      };
    }
    throw error;
  }
}

export function classifyOperationExecution(
  execution: Pick<OperationResponseMap['createShipment'], 'state'>,
): WathbaOutcomeClassification {
  return execution.state === 'pending' ? 'pending' : 'final';
}

export interface WathbaPollOptions {
  readonly maximumAttempts: number;
  readonly delayMs?: number;
  readonly signal?: AbortSignal;
}

/**
 * Polls a caller-supplied read operation. Mutations are deliberately not
 * accepted as an operation id here; the caller must provide a safe read.
 */
export async function pollWathbaOutcome<Value>(
  read: () => Promise<WathbaOutcome<Value>>,
  options: WathbaPollOptions,
): Promise<WathbaOutcome<Value>> {
  const delayMs = options.delayMs ?? 1_000;
  if (
    !Number.isSafeInteger(options.maximumAttempts) ||
    options.maximumAttempts < 1 ||
    options.maximumAttempts > 120 ||
    !Number.isSafeInteger(delayMs) ||
    delayMs < 0 ||
    delayMs > 60_000
  ) {
    throw new WathbaSdkError('wathba_invalid_request');
  }

  let latest: WathbaOutcome<Value> | undefined;
  for (let attempt = 1; attempt <= options.maximumAttempts; attempt += 1) {
    assertNotAborted(options.signal);
    latest = await read();
    if (latest.kind !== 'pending' || attempt === options.maximumAttempts) {
      return latest;
    }
    await wait(delayMs, options.signal);
  }
  throw new WathbaSdkError('wathba_invalid_request');
}

function assertNotAborted(signal: AbortSignal | undefined): void {
  if (signal?.aborted) throw new WathbaSdkError('wathba_poll_aborted');
}

async function wait(delayMs: number, signal: AbortSignal | undefined): Promise<void> {
  if (delayMs === 0) return;
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, delayMs);
    const onAbort = () => {
      clearTimeout(timeout);
      reject(new WathbaSdkError('wathba_poll_aborted'));
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}
