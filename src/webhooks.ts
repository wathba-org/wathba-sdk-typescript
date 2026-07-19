import { createHmac, timingSafeEqual } from 'node:crypto';

const REQUIRED_HEADERS = [
  'x-wathba-event-id',
  'x-wathba-signature',
  'x-wathba-signature-version',
  'x-wathba-timestamp',
] as const;

const WEBHOOK_FIELDS = [
  'alertKey',
  'eventId',
  'eventType',
  'payload',
  'payloadVersion',
] as const;

export type WathbaWebhookHeaderValue = string | readonly string[] | undefined;

export type WathbaWebhookHeaders = Readonly<
  Record<string, WathbaWebhookHeaderValue>
>;

export interface WathbaWebhookHeaderReader {
  get(name: string): string | null;
}

export interface WathbaWebhookEvent {
  readonly eventId: string;
  readonly eventType: string;
  readonly alertKey: string;
  readonly payloadVersion: number;
  readonly payload: Readonly<Record<string, unknown>>;
}

export interface WathbaWebhookSecretResolver {
  resolve(input: {
    readonly secretVersion: number;
  }): Promise<string | Uint8Array | null>;
}

export interface WathbaWebhookReplayStore {
  claim(input: {
    readonly eventId: string;
    readonly attemptTimestamp: number;
    readonly secretVersion: number;
  }): Promise<'claimed' | 'duplicate'>;
}

export interface VerifyWathbaWebhookInput {
  readonly rawBody: string | Uint8Array;
  readonly headers: WathbaWebhookHeaders | WathbaWebhookHeaderReader;
  readonly secretResolver: WathbaWebhookSecretResolver;
  readonly replayStore: WathbaWebhookReplayStore;
  readonly now?: () => Date;
  readonly toleranceSeconds?: number;
}

export interface VerifiedWathbaWebhook {
  readonly kind: 'verified' | 'duplicate';
  readonly duplicate: boolean;
  readonly event: WathbaWebhookEvent;
  readonly attemptTimestamp: number;
  readonly secretVersion: number;
}

export type WathbaWebhookVerificationErrorCode =
  | 'wathba_webhook_duplicate_header'
  | 'wathba_webhook_event_id_mismatch'
  | 'wathba_webhook_invalid_envelope'
  | 'wathba_webhook_invalid_json'
  | 'wathba_webhook_invalid_signature'
  | 'wathba_webhook_invalid_timestamp'
  | 'wathba_webhook_invalid_utf8'
  | 'wathba_webhook_missing_header'
  | 'wathba_webhook_replay_store_unavailable'
  | 'wathba_webhook_secret_unavailable'
  | 'wathba_webhook_timestamp_outside_tolerance'
  | 'wathba_webhook_unknown_secret_version'
  | 'wathba_webhook_unsupported_signature_version';

export class WathbaWebhookVerificationError extends Error {
  readonly name = 'WathbaWebhookVerificationError';

  constructor(readonly code: WathbaWebhookVerificationErrorCode) {
    super(code);
  }
}

export async function verifyWathbaWebhook(
  input: VerifyWathbaWebhookInput,
): Promise<VerifiedWathbaWebhook> {
  const headers = requiredHeaders(input.headers);
  const attemptTimestamp = parseTimestamp(headers['x-wathba-timestamp']);
  assertFresh(
    attemptTimestamp,
    (input.now ?? (() => new Date()))(),
    input.toleranceSeconds ?? 300,
  );
  const secretVersion = parseSecretVersion(
    headers['x-wathba-signature-version'],
  );
  const signature = parseSignature(headers['x-wathba-signature']);
  const rawBody = rawBodyBytes(input.rawBody);
  const secret = await resolveSecret(input.secretResolver, secretVersion);
  assertSignature(headers['x-wathba-timestamp'], rawBody, secret, signature);

  const event = parseEvent(rawBody);
  if (event.eventId !== headers['x-wathba-event-id']) {
    throw new WathbaWebhookVerificationError(
      'wathba_webhook_event_id_mismatch',
    );
  }
  const claim = await claimReplay(input.replayStore, {
    eventId: event.eventId,
    attemptTimestamp,
    secretVersion,
  });
  return {
    kind: claim === 'claimed' ? 'verified' : 'duplicate',
    duplicate: claim === 'duplicate',
    event,
    attemptTimestamp,
    secretVersion,
  };
}

export type WathbaWebhookSecret =
  | string
  | Uint8Array
  | Readonly<Record<string, string | Uint8Array>>;

export interface VerifyWebhookSignatureInput {
  readonly payload: string | Uint8Array;
  readonly headers: WathbaWebhookHeaders | WathbaWebhookHeaderReader;
  readonly secret: WathbaWebhookSecret;
  readonly toleranceSeconds?: number;
  readonly now?: () => Date;
}

export interface VerifiedWebhookSignature {
  readonly eventId: string;
  readonly timestamp: number;
  readonly secretVersion: number;
}

export interface ParsedWebhookEvent extends VerifiedWebhookSignature {
  readonly event: WathbaWebhookEvent;
}

export function verifyWebhookSignature(
  input: VerifyWebhookSignatureInput,
): VerifiedWebhookSignature {
  const { headers, timestamp, secretVersion } = verifySignedPayload(input);
  return { eventId: headers['x-wathba-event-id'], timestamp, secretVersion };
}

export function parseWebhookEvent(
  input: VerifyWebhookSignatureInput,
): ParsedWebhookEvent {
  const { headers, rawBody, timestamp, secretVersion } =
    verifySignedPayload(input);
  const event = parseEvent(rawBody);
  if (event.eventId !== headers['x-wathba-event-id']) {
    throw new WathbaWebhookVerificationError(
      'wathba_webhook_event_id_mismatch',
    );
  }
  return { event, eventId: event.eventId, timestamp, secretVersion };
}

function verifySignedPayload(input: VerifyWebhookSignatureInput): {
  readonly headers: Record<(typeof REQUIRED_HEADERS)[number], string>;
  readonly rawBody: Buffer;
  readonly timestamp: number;
  readonly secretVersion: number;
} {
  const headers = requiredHeaders(input.headers);
  const timestamp = parseTimestamp(headers['x-wathba-timestamp']);
  assertFresh(
    timestamp,
    (input.now ?? (() => new Date()))(),
    input.toleranceSeconds ?? 300,
  );
  const secretVersion = parseSecretVersion(
    headers['x-wathba-signature-version'],
  );
  const signature = parseSignature(headers['x-wathba-signature']);
  const rawBody = rawBodyBytes(input.payload);
  assertSignature(
    headers['x-wathba-timestamp'],
    rawBody,
    staticSecret(input.secret, secretVersion),
    signature,
  );
  return { headers, rawBody, timestamp, secretVersion };
}

function staticSecret(
  secret: WathbaWebhookSecret,
  secretVersion: number,
): string | Uint8Array {
  const selected =
    typeof secret === 'string' || secret instanceof Uint8Array
      ? secret
      : secret[String(secretVersion)];
  if (selected === undefined) {
    throw new WathbaWebhookVerificationError(
      'wathba_webhook_unknown_secret_version',
    );
  }
  if (
    (typeof selected === 'string' && selected.length === 0) ||
    (selected instanceof Uint8Array && selected.byteLength === 0)
  ) {
    throw new WathbaWebhookVerificationError(
      'wathba_webhook_secret_unavailable',
    );
  }
  return selected;
}

function assertSignature(
  timestampHeader: string,
  rawBody: Buffer,
  secret: string | Uint8Array,
  signature: Buffer,
): void {
  const expected = createHmac('sha256', secret)
    .update(timestampHeader)
    .update('.')
    .update(rawBody)
    .digest();
  if (
    signature.length !== expected.length ||
    !timingSafeEqual(signature, expected)
  ) {
    throw new WathbaWebhookVerificationError(
      'wathba_webhook_invalid_signature',
    );
  }
}

function requiredHeaders(
  source: WathbaWebhookHeaders | WathbaWebhookHeaderReader,
): Record<(typeof REQUIRED_HEADERS)[number], string> {
  return Object.fromEntries(
    REQUIRED_HEADERS.map((name) => [name, oneHeader(source, name)]),
  ) as Record<(typeof REQUIRED_HEADERS)[number], string>;
}

function oneHeader(
  source: WathbaWebhookHeaders | WathbaWebhookHeaderReader,
  name: string,
): string {
  const value = isHeaderReader(source)
    ? source.get(name)
    : recordHeader(source, name);
  if (value === undefined || value === null || value.length === 0) {
    throw new WathbaWebhookVerificationError(
      'wathba_webhook_missing_header',
    );
  }
  if (typeof value !== 'string' || value.includes(',')) {
    throw new WathbaWebhookVerificationError(
      'wathba_webhook_duplicate_header',
    );
  }
  return value;
}

function isHeaderReader(
  source: WathbaWebhookHeaders | WathbaWebhookHeaderReader,
): source is WathbaWebhookHeaderReader {
  return typeof (source as { readonly get?: unknown }).get === 'function';
}

function recordHeader(
  headers: WathbaWebhookHeaders,
  name: string,
): WathbaWebhookHeaderValue {
  const matches = Object.entries(headers).filter(
    ([candidate]) => candidate.toLowerCase() === name,
  );
  if (matches.length > 1) {
    throw new WathbaWebhookVerificationError(
      'wathba_webhook_duplicate_header',
    );
  }
  return matches[0]?.[1];
}

function parseTimestamp(value: string): number {
  if (!/^(?:0|[1-9]\d{0,15})$/u.test(value)) {
    throw new WathbaWebhookVerificationError(
      'wathba_webhook_invalid_timestamp',
    );
  }
  const timestamp = Number(value);
  if (!Number.isSafeInteger(timestamp)) {
    throw new WathbaWebhookVerificationError(
      'wathba_webhook_invalid_timestamp',
    );
  }
  return timestamp;
}

function assertFresh(timestamp: number, now: Date, tolerance: number): void {
  if (
    !Number.isInteger(tolerance) ||
    tolerance < 0 ||
    tolerance > 300 ||
    Number.isNaN(now.getTime())
  ) {
    throw new WathbaWebhookVerificationError(
      'wathba_webhook_invalid_timestamp',
    );
  }
  const nowSeconds = Math.floor(now.getTime() / 1_000);
  if (Math.abs(nowSeconds - timestamp) > tolerance) {
    throw new WathbaWebhookVerificationError(
      'wathba_webhook_timestamp_outside_tolerance',
    );
  }
}

function parseSecretVersion(value: string): number {
  if (!/^[1-9]\d{0,8}$/u.test(value)) {
    throw new WathbaWebhookVerificationError(
      'wathba_webhook_unknown_secret_version',
    );
  }
  return Number(value);
}

function parseSignature(value: string): Buffer {
  const match = /^v1=([a-f0-9]{64})$/u.exec(value);
  if (!match?.[1]) {
    if (/^[A-Za-z0-9_-]+=/u.test(value) && !value.startsWith('v1=')) {
      throw new WathbaWebhookVerificationError(
        'wathba_webhook_unsupported_signature_version',
      );
    }
    throw new WathbaWebhookVerificationError(
      'wathba_webhook_invalid_signature',
    );
  }
  return Buffer.from(match[1], 'hex');
}

function rawBodyBytes(rawBody: string | Uint8Array): Buffer {
  const bytes =
    typeof rawBody === 'string' ? Buffer.from(rawBody, 'utf8') : Buffer.from(rawBody);
  const decoded = bytes.toString('utf8');
  if (!Buffer.from(decoded, 'utf8').equals(bytes)) {
    throw new WathbaWebhookVerificationError('wathba_webhook_invalid_utf8');
  }
  return bytes;
}

async function resolveSecret(
  resolver: WathbaWebhookSecretResolver,
  secretVersion: number,
): Promise<string | Uint8Array> {
  let secret: string | Uint8Array | null;
  try {
    secret = await resolver.resolve({ secretVersion });
  } catch {
    throw new WathbaWebhookVerificationError(
      'wathba_webhook_secret_unavailable',
    );
  }
  if (secret === null || (typeof secret === 'string' && secret.length === 0)) {
    throw new WathbaWebhookVerificationError(
      'wathba_webhook_unknown_secret_version',
    );
  }
  if (secret instanceof Uint8Array && secret.byteLength === 0) {
    throw new WathbaWebhookVerificationError(
      'wathba_webhook_unknown_secret_version',
    );
  }
  return secret;
}

function parseEvent(rawBody: Buffer): WathbaWebhookEvent {
  let value: unknown;
  try {
    value = JSON.parse(rawBody.toString('utf8'));
  } catch {
    throw new WathbaWebhookVerificationError('wathba_webhook_invalid_json');
  }
  if (!isRecord(value) || !exactFields(value, WEBHOOK_FIELDS)) {
    throw new WathbaWebhookVerificationError(
      'wathba_webhook_invalid_envelope',
    );
  }
  if (
    !identifier(value.eventId) ||
    !identifier(value.eventType) ||
    !identifier(value.alertKey) ||
    !Number.isSafeInteger(value.payloadVersion) ||
    (value.payloadVersion as number) < 1 ||
    !isRecord(value.payload)
  ) {
    throw new WathbaWebhookVerificationError(
      'wathba_webhook_invalid_envelope',
    );
  }
  return {
    eventId: value.eventId,
    eventType: value.eventType,
    alertKey: value.alertKey,
    payloadVersion: value.payloadVersion as number,
    payload: value.payload,
  };
}

function identifier(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length >= 3 &&
    value.length <= 160 &&
    /^[A-Za-z][A-Za-z0-9._:-]*$/u.test(value)
  );
}

function exactFields(
  value: Readonly<Record<string, unknown>>,
  expected: readonly string[],
): boolean {
  const actual = Object.keys(value).sort();
  return (
    actual.length === expected.length &&
    actual.every((field, index) => field === [...expected].sort()[index])
  );
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function claimReplay(
  store: WathbaWebhookReplayStore,
  input: Parameters<WathbaWebhookReplayStore['claim']>[0],
): Promise<'claimed' | 'duplicate'> {
  try {
    const result = await store.claim(input);
    if (result === 'claimed' || result === 'duplicate') return result;
  } catch {
    // The caller cannot safely apply a business effect without a durable claim.
  }
  throw new WathbaWebhookVerificationError(
    'wathba_webhook_replay_store_unavailable',
  );
}
