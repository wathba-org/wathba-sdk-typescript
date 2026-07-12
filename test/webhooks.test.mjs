import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  verifyWathbaWebhook,
  WathbaWebhookVerificationError,
} from '../dist/esm/index.js';

const FIXTURE = JSON.parse(
  await readFile(
    new URL('../fixtures/v1/otp-webhook-round-trip.json', import.meta.url),
    'utf8',
  ),
);
const NOW = new Date(Number(FIXTURE.timestamp) * 1_000);
const TIMESTAMP = FIXTURE.timestamp;
const SECRET = FIXTURE.testSecret;
const EVENT = FIXTURE.event;
const RAW_BODY = FIXTURE.rawBody;

test('verifies the exact raw body, timestamp, version, and first durable claim', async () => {
  assert.deepEqual(signedHeaders(), FIXTURE.headers);
  const claims = [];
  const result = await verifyWathbaWebhook({
    rawBody: RAW_BODY,
    headers: signedHeaders(),
    secretResolver: resolver(),
    replayStore: {
      async claim(input) {
        claims.push(input);
        return 'claimed';
      },
    },
    now: () => NOW,
  });

  assert.equal(result.kind, 'verified');
  assert.equal(result.duplicate, false);
  assert.deepEqual(result.event, EVENT);
  assert.deepEqual(claims, [
    {
      eventId: EVENT.eventId,
      attemptTimestamp: Number(TIMESTAMP),
      secretVersion: FIXTURE.secretVersion,
    },
  ]);
});

test('returns duplicate after valid authentication so callers acknowledge without applying an effect', async () => {
  const result = await verifyWathbaWebhook({
    rawBody: RAW_BODY,
    headers: signedHeaders(),
    secretResolver: resolver(),
    replayStore: { claim: async () => 'duplicate' },
    now: () => NOW,
  });

  assert.equal(result.kind, 'duplicate');
  assert.equal(result.duplicate, true);
  assert.equal(result.event.eventId, EVENT.eventId);
});

test('rotation resolves only the exact declared secret version', async () => {
  const requested = [];
  await verifyWathbaWebhook({
    rawBody: RAW_BODY,
    headers: signedHeaders(),
    secretResolver: {
      async resolve(input) {
        requested.push(input.secretVersion);
        return input.secretVersion === FIXTURE.secretVersion ? SECRET : null;
      },
    },
    replayStore: { claim: async () => 'claimed' },
    now: () => NOW,
  });
  assert.deepEqual(requested, [FIXTURE.secretVersion]);
});

for (const [name, mutate, code] of [
  [
    'tampered body',
    ({ headers }) => ({ rawBody: `${RAW_BODY} `, headers }),
    'wathba_webhook_invalid_signature',
  ],
  [
    'old timestamp',
    () => ({
      rawBody: RAW_BODY,
      headers: signedHeaders({ timestamp: String(Number(TIMESTAMP) - 301) }),
    }),
    'wathba_webhook_timestamp_outside_tolerance',
  ],
  [
    'future timestamp',
    () => ({
      rawBody: RAW_BODY,
      headers: signedHeaders({ timestamp: String(Number(TIMESTAMP) + 301) }),
    }),
    'wathba_webhook_timestamp_outside_tolerance',
  ],
  [
    'unknown signature version',
    ({ headers }) => ({
      rawBody: RAW_BODY,
      headers: { ...headers, 'x-wathba-signature': `v2=${'0'.repeat(64)}` },
    }),
    'wathba_webhook_unsupported_signature_version',
  ],
  [
    'event id mismatch',
    ({ headers }) => ({
      rawBody: RAW_BODY,
      headers: { ...headers, 'x-wathba-event-id': 'evt_other_1' },
    }),
    'wathba_webhook_event_id_mismatch',
  ],
  [
    'duplicate header',
    ({ headers }) => ({
      rawBody: RAW_BODY,
      headers: { ...headers, 'x-wathba-event-id': [EVENT.eventId, EVENT.eventId] },
    }),
    'wathba_webhook_duplicate_header',
  ],
]) {
  test(`fails closed for ${name}`, async () => {
    const base = { rawBody: RAW_BODY, headers: signedHeaders() };
    const changed = mutate(base);
    await assert.rejects(
      verifyWathbaWebhook({
        ...changed,
        secretResolver: resolver(),
        replayStore: { claim: async () => 'claimed' },
        now: () => NOW,
      }),
      (error) =>
        error instanceof WathbaWebhookVerificationError && error.code === code,
    );
  });
}

test('rejects unavailable exact secret and never falls back', async () => {
  await assert.rejects(
    verifyWathbaWebhook({
      rawBody: RAW_BODY,
      headers: signedHeaders(),
      secretResolver: { resolve: async () => null },
      replayStore: { claim: async () => 'claimed' },
      now: () => NOW,
    }),
    (error) =>
      error instanceof WathbaWebhookVerificationError &&
      error.code === 'wathba_webhook_unknown_secret_version',
  );
});

test('fails closed when the durable replay store is unavailable', async () => {
  await assert.rejects(
    verifyWathbaWebhook({
      rawBody: RAW_BODY,
      headers: signedHeaders(),
      secretResolver: resolver(),
      replayStore: { claim: async () => Promise.reject(new Error('db down')) },
      now: () => NOW,
    }),
    (error) =>
      error instanceof WathbaWebhookVerificationError &&
      error.code === 'wathba_webhook_replay_store_unavailable',
  );
});

function resolver() {
  return {
    async resolve({ secretVersion }) {
      return secretVersion === FIXTURE.secretVersion ? SECRET : null;
    },
  };
}

function signedHeaders({ timestamp = TIMESTAMP, secret = SECRET } = {}) {
  const signature = createHmac('sha256', secret)
    .update(`${timestamp}.${RAW_BODY}`)
    .digest('hex');
  return {
    'content-type': 'application/json',
    'user-agent': 'Wathba-Webhooks/1.0',
    'x-wathba-event-id': EVENT.eventId,
    'x-wathba-timestamp': timestamp,
    'x-wathba-signature': `v1=${signature}`,
    'x-wathba-signature-version': String(FIXTURE.secretVersion),
  };
}
