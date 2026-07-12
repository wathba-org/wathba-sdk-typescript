import { randomUUID } from 'node:crypto';

declare const idempotencyKeyBrand: unique symbol;
export type IdempotencyKey = string & { readonly [idempotencyKeyBrand]: true };

export function createIdempotencyKey(): IdempotencyKey {
  return asIdempotencyKey(`idem_${randomUUID()}`);
}

export function asIdempotencyKey(value: string): IdempotencyKey {
  if (value.length < 8 || value.length > 240 || /[\r\n]/.test(value)) {
    throw new Error('invalid_wathba_idempotency_key');
  }
  return value as IdempotencyKey;
}
