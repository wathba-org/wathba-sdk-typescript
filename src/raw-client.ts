import {
  operationSpecs,
  type OperationId,
  type OperationInputMap,
  type OperationResponseMap,
} from './generated/operations.js';
import { WathbaSdkError } from './errors.js';
import { asIdempotencyKey } from './idempotency.js';
import { isWathbaProblem, WathbaApiError } from './problem.js';
import { matchesGeneratedSchema, matchesJsonSchema } from './schema-validation.js';

export type {
  OperationId,
  OperationInputMap,
  OperationResponseMap,
} from './generated/operations.js';

export interface WathbaCredential {
  readonly apiKey: string;
  readonly version?: number;
}

export interface WathbaCredentialRequest {
  readonly apiOrigin: string;
  readonly capability: string;
  readonly operationId: OperationId;
  readonly requiredScopes: readonly string[];
}

export interface WathbaCredentialProvider {
  resolve(request: WathbaCredentialRequest): Promise<WathbaCredential>;
}

export interface RawWathbaClientOptions {
  readonly baseUrl?: string;
  readonly credentialProvider: WathbaCredentialProvider;
  readonly fetch?: typeof fetch;
  readonly retry?: WathbaRetryPolicy;
}

export interface WathbaRetryPolicy {
  readonly maximumAttempts: number;
  readonly delayMs?: number;
}

export class RawWathbaClient {
  private readonly baseUrl: string;
  private readonly apiOrigin: string;
  private readonly fetch: typeof fetch;
  private readonly retry: Required<WathbaRetryPolicy>;

  constructor(private readonly options: RawWathbaClientOptions) {
    assertServerRuntime();
    const baseUrl = new URL(options.baseUrl ?? 'https://api.wathba.info');
    if (
      (baseUrl.protocol !== 'https:' && baseUrl.protocol !== 'http:') ||
      baseUrl.username !== '' ||
      baseUrl.password !== '' ||
      baseUrl.search !== '' ||
      baseUrl.hash !== ''
    ) {
      throw new Error('wathba_invalid_base_url');
    }
    if (baseUrl.protocol === 'http:' && !isLoopbackHost(baseUrl.hostname)) {
      throw new Error('wathba_insecure_base_url');
    }
    this.baseUrl = baseUrl.href.replace(/\/$/, '');
    this.apiOrigin = baseUrl.origin;
    this.fetch = options.fetch ?? globalThis.fetch;
    if (typeof this.fetch !== 'function') {
      throw new Error('wathba_fetch_unavailable');
    }
    const maximumAttempts = options.retry?.maximumAttempts ?? 1;
    const delayMs = options.retry?.delayMs ?? 100;
    if (
      !Number.isSafeInteger(maximumAttempts) ||
      maximumAttempts < 1 ||
      maximumAttempts > 3 ||
      !Number.isSafeInteger(delayMs) ||
      delayMs < 0 ||
      delayMs > 30_000
    ) {
      throw new Error('wathba_invalid_retry_policy');
    }
    this.retry = { maximumAttempts, delayMs };
  }

  async execute<Id extends OperationId>(
    operationId: Id,
    input: OperationInputMap[Id],
  ): Promise<OperationResponseMap[Id]> {
    const spec = operationSpecs[operationId];
    let path: string = spec.path;
    if (!isRecord(input.path)) throw new WathbaSdkError('wathba_invalid_request');
    const pathInput: Readonly<Record<string, unknown>> = input.path;
    for (const [name, parameter] of Object.entries(spec.pathParameters)) {
      const value = pathInput[name];
      if (
        (parameter.required && value === undefined) ||
        (value !== undefined && !matchesJsonSchema(parameter.schema, value))
      ) {
        throw new WathbaSdkError('wathba_invalid_request');
      }
      if (value !== undefined) path = path.replace(`{${name}}`, encodeURIComponent(String(value)));
    }
    if (Object.keys(pathInput).some((name) => !(name in spec.pathParameters))) {
      throw new WathbaSdkError('wathba_invalid_request');
    }
    const url = new URL(`${this.baseUrl}${path}`);
    if ('query' in input && input.query !== undefined) {
      if (!isRecord(input.query)) throw new WathbaSdkError('wathba_invalid_request');
      for (const [name, value] of Object.entries(input.query)) {
        const parameter = (spec.queryParameters as Readonly<Record<string, {
          readonly required: boolean;
          readonly schema: Readonly<Record<string, unknown>>;
        }>>)[name];
        if (parameter === undefined || !matchesJsonSchema(parameter.schema, value)) {
          throw new WathbaSdkError('wathba_invalid_request');
        }
        if (value !== undefined) url.searchParams.set(name, String(value));
      }
    }
    for (const [name, parameter] of Object.entries(spec.queryParameters)) {
      if (parameter.required && (!('query' in input) || !isRecord(input.query) || !(name in input.query))) {
        throw new WathbaSdkError('wathba_invalid_request');
      }
    }

    let body: string | undefined;
    if ('body' in input) {
      if (spec.requestSchema === null || !matchesGeneratedSchema(spec.requestSchema, input.body)) {
        throw new WathbaSdkError('wathba_invalid_request');
      }
      body = JSON.stringify(input.body);
    } else if (spec.requestSchema !== null) {
      throw new WathbaSdkError('wathba_invalid_request');
    }
    if (spec.idempotency === 'required') {
      if (!('idempotencyKey' in input)) throw new WathbaSdkError('wathba_invalid_request');
      try {
        asIdempotencyKey(String(input.idempotencyKey));
      } catch {
        throw new WathbaSdkError('wathba_invalid_request');
      }
    } else if ('idempotencyKey' in input) {
      throw new WathbaSdkError('wathba_invalid_request');
    }

    const retryAllowed = spec.method === 'GET' || spec.idempotency === 'required';
    for (let attempt = 1; attempt <= this.retry.maximumAttempts; attempt += 1) {
      const credential = await this.resolveCredential(operationId, spec);
      const headers = new Headers({
        accept: 'application/json, application/problem+json',
        'x-api-key': credential.apiKey,
      });
      if (body !== undefined) headers.set('content-type', 'application/json');
      if ('idempotencyKey' in input) {
        headers.set('idempotency-key', String(input.idempotencyKey));
      }

      let response: Response;
      try {
        response = await this.fetch(url, {
          method: spec.method,
          headers,
          cache: 'no-store',
          credentials: 'omit',
          redirect: 'error',
          referrerPolicy: 'no-referrer',
          ...(body === undefined ? {} : { body }),
        });
      } catch {
        if (retryAllowed && attempt < this.retry.maximumAttempts) {
          await wait(this.retry.delayMs);
          continue;
        }
        throw new WathbaSdkError('wathba_transport_unavailable');
      }

      if (!response.ok) {
        const payload = await parseJson(response, 'application/problem+json');
        if (!isWathbaProblem(payload) || payload.status !== response.status) {
          throw new WathbaSdkError('wathba_invalid_problem_response');
        }
        if (payload.retryable && retryAllowed && attempt < this.retry.maximumAttempts) {
          await wait(this.retry.delayMs);
          continue;
        }
        throw new WathbaApiError(payload);
      }
      const success = (spec.successResponses as Readonly<Record<string, {
        readonly contentType: string;
        readonly schema: string;
      }>>)[String(response.status)];
      if (success === undefined) {
        throw new WathbaSdkError('wathba_undeclared_success_status');
      }
      const payload = await parseJson(response, success.contentType);
      if (!matchesGeneratedSchema(success.schema, payload)) {
        throw new WathbaSdkError('wathba_invalid_success_response');
      }
      return payload as OperationResponseMap[Id];
    }
    throw new WathbaSdkError('wathba_transport_unavailable');
  }

  private async resolveCredential(
    operationId: OperationId,
    spec: (typeof operationSpecs)[OperationId],
  ): Promise<WathbaCredential> {
    let credential: WathbaCredential;
    try {
      credential = await this.options.credentialProvider.resolve(Object.freeze({
        apiOrigin: this.apiOrigin,
        capability: spec.capability,
        operationId,
        requiredScopes: Object.freeze([...spec.requiredScopes]),
      }));
    } catch {
      throw new WathbaSdkError('wathba_credential_unavailable');
    }
    if (
      typeof credential?.apiKey !== 'string' ||
      credential.apiKey.length < 8 ||
      credential.apiKey.length > 4096 ||
      /[\r\n]/.test(credential.apiKey) ||
      (credential.version !== undefined &&
        (!Number.isSafeInteger(credential.version) || credential.version < 1))
    ) {
      throw new WathbaSdkError('wathba_credential_unavailable');
    }
    return credential;
  }
}

function assertServerRuntime(): void {
  if (Object.hasOwn(globalThis, 'window')) {
    throw new Error('@wathba/sdk cannot run in a browser');
  }
  const nodeMajor = Number.parseInt(process.versions.node.split('.')[0] ?? '', 10);
  if (!Number.isSafeInteger(nodeMajor) || nodeMajor < 24) {
    throw new Error('@wathba/sdk requires Node.js 24 or newer');
  }
}

async function parseJson(response: Response, expectedContentType: string): Promise<unknown> {
  const contentType = (response.headers.get('content-type') ?? '').split(';', 1)[0]?.trim().toLowerCase();
  if (contentType !== expectedContentType) {
    throw new WathbaSdkError('wathba_unexpected_content_type');
  }
  try {
    return await response.json();
  } catch {
    throw new WathbaSdkError('wathba_invalid_json_response');
  }
}

async function wait(delayMs: number): Promise<void> {
  if (delayMs === 0) return;
  await new Promise((resolvePromise) => setTimeout(resolvePromise, delayMs));
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isLoopbackHost(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname === '[::1]' ||
    /^127(?:\.\d{1,3}){3}$/.test(hostname)
  );
}
