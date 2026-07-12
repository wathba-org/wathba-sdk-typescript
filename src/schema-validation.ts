import { runtimeSchemas } from './generated/runtime-schemas.js';

type JsonSchema = Readonly<Record<string, unknown>>;

export function matchesGeneratedSchema(name: string, value: unknown): boolean {
  const schema = (runtimeSchemas as Readonly<Record<string, JsonSchema>>)[name];
  return schema !== undefined && matchesJsonSchema(schema, value);
}

export function matchesJsonSchema(schema: JsonSchema, value: unknown): boolean {
  if (Array.isArray(schema.anyOf)) {
    if (!schema.anyOf.some((candidate) => isSchema(candidate) && matchesJsonSchema(candidate, value))) {
      return false;
    }
  }
  if (Array.isArray(schema.enum) && !schema.enum.some((candidate) => Object.is(candidate, value))) {
    return false;
  }
  if ('const' in schema && !Object.is(schema.const, value)) return false;

  switch (schema.type) {
    case undefined:
      break;
    case 'null':
      if (value !== null) return false;
      break;
    case 'boolean':
      if (typeof value !== 'boolean') return false;
      break;
    case 'integer':
      if (typeof value !== 'number' || !Number.isSafeInteger(value)) return false;
      if (!matchesNumber(schema, value)) return false;
      break;
    case 'number':
      if (typeof value !== 'number' || !Number.isFinite(value)) return false;
      if (!matchesNumber(schema, value)) return false;
      break;
    case 'string':
      if (typeof value !== 'string' || !matchesString(schema, value)) return false;
      break;
    case 'array':
      if (!Array.isArray(value)) return false;
      if (typeof schema.minItems === 'number' && value.length < schema.minItems) return false;
      if (typeof schema.maxItems === 'number' && value.length > schema.maxItems) return false;
      if (isSchema(schema.items)) {
        const itemSchema = schema.items;
        if (!value.every((item) => matchesJsonSchema(itemSchema, item))) return false;
      }
      break;
    case 'object':
      if (!isRecord(value) || !matchesObject(schema, value)) return false;
      break;
    default:
      return false;
  }
  return true;
}

function matchesNumber(schema: JsonSchema, value: number): boolean {
  if (typeof schema.minimum === 'number' && value < schema.minimum) return false;
  if (typeof schema.exclusiveMinimum === 'number' && value <= schema.exclusiveMinimum) return false;
  if (typeof schema.maximum === 'number' && value > schema.maximum) return false;
  return true;
}

function matchesString(schema: JsonSchema, value: string): boolean {
  if (typeof schema.minLength === 'number' && [...value].length < schema.minLength) return false;
  if (typeof schema.maxLength === 'number' && [...value].length > schema.maxLength) return false;
  if (typeof schema.pattern === 'string' && !new RegExp(schema.pattern, 'u').test(value)) return false;
  if (schema.format === 'uri') {
    try {
      new URL(value);
    } catch {
      return false;
    }
  }
  if (schema.format === 'email' && !matchesEmail(value)) return false;
  if (schema.format === 'date-time' && !matchesDateTime(value)) return false;
  return true;
}

function matchesEmail(value: string): boolean {
  if (/\s/u.test(value)) return false;
  const separator = value.lastIndexOf('@');
  if (separator < 1 || separator === value.length - 1) return false;
  const domain = value.slice(separator + 1);
  return domain.includes('.') && !domain.startsWith('.') && !domain.endsWith('.');
}

function matchesDateTime(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/u.test(value)) {
    return false;
  }
  return !Number.isNaN(Date.parse(value));
}

function matchesObject(schema: JsonSchema, value: Readonly<Record<string, unknown>>): boolean {
  const properties = isRecord(schema.properties) ? schema.properties : {};
  if (Array.isArray(schema.required)) {
    for (const name of schema.required) {
      if (typeof name !== 'string' || !Object.hasOwn(value, name)) return false;
    }
  }
  for (const [name, item] of Object.entries(value)) {
    const propertySchema = properties[name];
    if (isSchema(propertySchema)) {
      if (!matchesJsonSchema(propertySchema, item)) return false;
      continue;
    }
    if (schema.additionalProperties === false) return false;
    if (isSchema(schema.additionalProperties) && !matchesJsonSchema(schema.additionalProperties, item)) {
      return false;
    }
  }
  if (isSchema(schema.propertyNames)) {
    for (const name of Object.keys(value)) {
      if (!matchesJsonSchema(schema.propertyNames, name)) return false;
    }
  }
  return true;
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSchema(value: unknown): value is JsonSchema {
  return isRecord(value);
}
