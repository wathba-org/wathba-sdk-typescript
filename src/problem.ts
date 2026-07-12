import type { components } from './generated/schema.js';
import { matchesGeneratedSchema } from './schema-validation.js';

type DeepReadonly<Value> = Value extends (...arguments_: never[]) => unknown
  ? Value
  : Value extends readonly (infer Item)[]
    ? readonly DeepReadonly<Item>[]
    : Value extends object
      ? { readonly [Key in keyof Value]: DeepReadonly<Value[Key]> }
      : Value;

export type WathbaProblem = DeepReadonly<components['schemas']['WathbaProblem']>;

export class WathbaApiError extends Error {
  readonly name = 'WathbaApiError';

  constructor(readonly problem: WathbaProblem) {
    super(problem.code);
  }
}

export function isWathbaProblem(value: unknown): value is WathbaProblem {
  return matchesGeneratedSchema('WathbaProblem', value);
}
