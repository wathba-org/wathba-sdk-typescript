import type {
  WathbaCredential,
  WathbaCredentialProvider,
  WathbaCredentialRequest,
} from './raw-client.js';

const DEFAULT_API_ORIGIN = 'https://api.wathba.info';
const METADATA_TOKEN_URL =
  'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token';
const EXACT_SECRET_VERSION =
  /^projects\/([1-9][0-9]*)\/secrets\/([A-Za-z0-9_-]+)\/versions\/([1-9][0-9]*)$/;
const BASE64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

export interface GcpWorkloadAccessTokenProvider {
  getAccessToken(): Promise<string>;
}

export interface GcpSecretManagerCredentialProviderOptions {
  /** Canonical numeric-version resource returned by the Wathba binding. */
  readonly secretVersionResource: string;
  /** Capability codes approved for this exact credential binding. */
  readonly allowedCapabilities: readonly string[];
  /** Wathba scopes approved for this exact credential binding. */
  readonly allowedScopes: readonly string[];
  /** Defaults to https://api.wathba.info and must be an HTTPS origin. */
  readonly allowedApiOrigin?: string;
  /** Optional workload-identity token source. Defaults to the GCP metadata server. */
  readonly accessTokenProvider?: GcpWorkloadAccessTokenProvider;
  /** Test/runtime fetch override. */
  readonly fetch?: typeof fetch;
}

/**
 * Creates a server-only credential provider that reads one exact, numeric GCP
 * Secret Manager version. It never resolves `latest`, another version, or a
 * different Wathba API origin/capability/scope set.
 */
export function createGcpSecretManagerCredentialProvider(
  options: GcpSecretManagerCredentialProviderOptions,
): WathbaCredentialProvider {
  assertServerRuntime();
  const version = parseExactSecretVersion(options.secretVersionResource);
  const allowedApiOrigin = parseHttpsOrigin(
    options.allowedApiOrigin ?? DEFAULT_API_ORIGIN,
  );
  const allowedCapabilities = validatedSet(
    options.allowedCapabilities,
    'wathba_invalid_gcp_credential_binding',
  );
  const allowedScopes = validatedSet(
    options.allowedScopes,
    'wathba_invalid_gcp_credential_binding',
  );
  const request = options.fetch ?? globalThis.fetch;
  if (typeof request !== 'function') {
    throw new Error('wathba_fetch_unavailable');
  }
  const tokens =
    options.accessTokenProvider ?? new MetadataWorkloadAccessTokenProvider(request);

  return Object.freeze({
    async resolve(input: WathbaCredentialRequest): Promise<WathbaCredential> {
      authorizeCredentialUse(
        input,
        allowedApiOrigin,
        allowedCapabilities,
        allowedScopes,
      );
      try {
        const accessToken = await tokens.getAccessToken();
        if (!validAccessToken(accessToken)) {
          throw new Error('invalid_access_token');
        }
        const response = await request(
          `https://secretmanager.googleapis.com/v1/${options.secretVersionResource}:access`,
          {
            method: 'GET',
            headers: {
              authorization: `Bearer ${accessToken}`,
              'x-goog-request-params': `name=${options.secretVersionResource}`,
            },
            cache: 'no-store',
            credentials: 'omit',
            redirect: 'error',
            referrerPolicy: 'no-referrer',
            signal: AbortSignal.timeout(5_000),
          },
        );
        if (!response.ok || !isJson(response.headers.get('content-type'))) {
          throw new Error('secret_access_failed');
        }
        const credential = parseAccessResponse(
          await response.json(),
          options.secretVersionResource,
        );
        return Object.freeze({ apiKey: credential, version });
      } catch {
        throw new Error('wathba_gcp_credential_unavailable');
      }
    },
  });
}

class MetadataWorkloadAccessTokenProvider
  implements GcpWorkloadAccessTokenProvider
{
  constructor(private readonly request: typeof fetch) {}

  async getAccessToken(): Promise<string> {
    const response = await this.request(METADATA_TOKEN_URL, {
      method: 'GET',
      headers: { 'Metadata-Flavor': 'Google' },
      cache: 'no-store',
      credentials: 'omit',
      redirect: 'error',
      referrerPolicy: 'no-referrer',
      signal: AbortSignal.timeout(3_000),
    });
    if (!response.ok || !isJson(response.headers.get('content-type'))) {
      throw new Error('metadata_token_unavailable');
    }
    const body = (await response.json()) as Readonly<Record<string, unknown>>;
    if (!validAccessToken(body.access_token)) {
      throw new Error('metadata_token_unavailable');
    }
    return body.access_token;
  }
}

function authorizeCredentialUse(
  request: WathbaCredentialRequest,
  allowedApiOrigin: string,
  allowedCapabilities: ReadonlySet<string>,
  allowedScopes: ReadonlySet<string>,
): void {
  if (
    request.apiOrigin !== allowedApiOrigin ||
    !allowedCapabilities.has(request.capability) ||
    request.requiredScopes.length === 0 ||
    request.requiredScopes.some((scope) => !allowedScopes.has(scope))
  ) {
    throw new Error('wathba_gcp_credential_use_not_authorized');
  }
}

function parseAccessResponse(value: unknown, exactResource: string): string {
  if (!isRecord(value) || value.name !== exactResource || !isRecord(value.payload)) {
    throw new Error('invalid_secret_access_response');
  }
  const data = value.payload.data;
  const checksum = value.payload.dataCrc32c;
  if (
    typeof data !== 'string' ||
    data.length === 0 ||
    data.length > 8_192 ||
    !BASE64.test(data) ||
    (typeof checksum !== 'string' && typeof checksum !== 'number')
  ) {
    throw new Error('invalid_secret_access_response');
  }
  const decoded = Buffer.from(data, 'base64');
  if (
    decoded.length === 0 ||
    decoded.length > 4_096 ||
    decoded.toString('base64') !== data ||
    BigInt(String(checksum)) !== BigInt(crc32c(decoded))
  ) {
    throw new Error('invalid_secret_access_response');
  }
  const credential = decoded.toString('utf8');
  if (
    !Buffer.from(credential, 'utf8').equals(decoded) ||
    credential.length < 8 ||
    credential.length > 4_096 ||
    /[\r\n]/.test(credential)
  ) {
    throw new Error('invalid_secret_access_response');
  }
  return credential;
}

function crc32c(input: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of input) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0x82f63b78 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function parseExactSecretVersion(resource: string): number {
  const match = EXACT_SECRET_VERSION.exec(resource);
  const version = Number(match?.[3]);
  if (!Number.isSafeInteger(version) || version < 1) {
    throw new Error('wathba_invalid_gcp_secret_version');
  }
  return version;
}

function parseHttpsOrigin(value: string): string {
  const url = new URL(value);
  if (
    url.protocol !== 'https:' ||
    url.username !== '' ||
    url.password !== '' ||
    url.pathname !== '/' ||
    url.search !== '' ||
    url.hash !== ''
  ) {
    throw new Error('wathba_invalid_gcp_credential_origin');
  }
  return url.origin;
}

function validatedSet(values: readonly string[], errorCode: string): Set<string> {
  if (
    values.length === 0 ||
    values.some(
      (value) =>
        typeof value !== 'string' ||
        value.length === 0 ||
        value.length > 160 ||
        !/^[a-z0-9][a-z0-9:._-]*$/.test(value),
    ) ||
    new Set(values).size !== values.length
  ) {
    throw new Error(errorCode);
  }
  return new Set(values);
}

function validAccessToken(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length >= 20 &&
    value.length <= 8_192 &&
    !/[\r\n]/.test(value)
  );
}

function isJson(value: string | null): boolean {
  return value?.split(';', 1)[0]?.trim().toLowerCase() === 'application/json';
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function assertServerRuntime(): void {
  if (Object.hasOwn(globalThis, 'window')) {
    throw new Error('@wathba/sdk cannot run in a browser');
  }
}
