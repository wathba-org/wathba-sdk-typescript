import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  parseWebhookEvent,
  verifyWathbaWebhook,
  verifyWebhookSignature,
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

test('verifyWebhookSignature accepts a valid static-secret signature', () => {
  for (const payload of [RAW_BODY, Buffer.from(RAW_BODY, 'utf8')]) {
    const result = verifyWebhookSignature({
      payload,
      headers: signedHeaders(),
      secret: SECRET,
      now: () => NOW,
    });
    assert.deepEqual(result, {
      eventId: EVENT.eventId,
      timestamp: Number(TIMESTAMP),
      secretVersion: FIXTURE.secretVersion,
    });
  }
});

test('parseWebhookEvent verifies then returns the typed envelope', () => {
  const result = parseWebhookEvent({
    payload: RAW_BODY,
    headers: signedHeaders(),
    secret: SECRET,
    now: () => NOW,
  });
  assert.deepEqual(result.event, EVENT);
  assert.equal(result.eventId, EVENT.eventId);
  assert.equal(result.timestamp, Number(TIMESTAMP));
  assert.equal(result.secretVersion, FIXTURE.secretVersion);
});

for (const [name, build, code] of [
  [
    'tampered payload',
    () => ({ payload: `${RAW_BODY} `, headers: signedHeaders(), secret: SECRET }),
    'wathba_webhook_invalid_signature',
  ],
  [
    'wrong secret',
    () => ({ payload: RAW_BODY, headers: signedHeaders(), secret: 'not-the-secret' }),
    'wathba_webhook_invalid_signature',
  ],
  [
    'empty secret',
    () => ({ payload: RAW_BODY, headers: signedHeaders(), secret: '' }),
    'wathba_webhook_secret_unavailable',
  ],
  [
    'expired timestamp',
    () => ({
      payload: RAW_BODY,
      headers: signedHeaders({ timestamp: String(Number(TIMESTAMP) - 301) }),
      secret: SECRET,
    }),
    'wathba_webhook_timestamp_outside_tolerance',
  ],
  [
    'malformed signature header',
    () => ({
      payload: RAW_BODY,
      headers: { ...signedHeaders(), 'x-wathba-signature': 'v1=zz' },
      secret: SECRET,
    }),
    'wathba_webhook_invalid_signature',
  ],
  [
    'truncated hex signature',
    () => ({
      payload: RAW_BODY,
      headers: {
        ...signedHeaders(),
        'x-wathba-signature': `v1=${'a'.repeat(63)}`,
      },
      secret: SECRET,
    }),
    'wathba_webhook_invalid_signature',
  ],
  [
    'unsupported signature version',
    () => ({
      payload: RAW_BODY,
      headers: {
        ...signedHeaders(),
        'x-wathba-signature': `v2=${'0'.repeat(64)}`,
      },
      secret: SECRET,
    }),
    'wathba_webhook_unsupported_signature_version',
  ],
  [
    'missing signature header',
    () => {
      const { 'x-wathba-signature': _dropped, ...headers } = signedHeaders();
      return { payload: RAW_BODY, headers, secret: SECRET };
    },
    'wathba_webhook_missing_header',
  ],
]) {
  test(`verifyWebhookSignature fails closed for ${name}`, () => {
    assert.throws(
      () => verifyWebhookSignature({ ...build(), now: () => NOW }),
      (error) =>
        error instanceof WathbaWebhookVerificationError && error.code === code,
    );
  });
}

test('verifyWebhookSignature honours a tighter tolerance window', () => {
  const skewed = String(Number(TIMESTAMP) - 11);
  assert.throws(
    () =>
      verifyWebhookSignature({
        payload: RAW_BODY,
        headers: signedHeaders({ timestamp: skewed }),
        secret: SECRET,
        toleranceSeconds: 10,
        now: () => NOW,
      }),
    (error) =>
      error instanceof WathbaWebhookVerificationError &&
      error.code === 'wathba_webhook_timestamp_outside_tolerance',
  );
  const inside = String(Number(TIMESTAMP) - 10);
  const result = verifyWebhookSignature({
    payload: RAW_BODY,
    headers: signedHeaders({ timestamp: inside }),
    secret: SECRET,
    toleranceSeconds: 10,
    now: () => NOW,
  });
  assert.equal(result.timestamp, Number(inside));
});

test('parseWebhookEvent rejects an envelope whose eventId contradicts the header', () => {
  assert.throws(
    () =>
      parseWebhookEvent({
        payload: RAW_BODY,
        headers: { ...signedHeaders(), 'x-wathba-event-id': 'evt_other_1' },
        secret: SECRET,
        now: () => NOW,
      }),
    (error) =>
      error instanceof WathbaWebhookVerificationError &&
      error.code === 'wathba_webhook_event_id_mismatch',
  );
});

test('secret map selects the exact declared version and never falls back', () => {
  const result = verifyWebhookSignature({
    payload: RAW_BODY,
    headers: signedHeaders(),
    secret: { [String(FIXTURE.secretVersion)]: SECRET },
    now: () => NOW,
  });
  assert.equal(result.secretVersion, FIXTURE.secretVersion);

  assert.throws(
    () =>
      verifyWebhookSignature({
        payload: RAW_BODY,
        headers: signedHeaders(),
        secret: { [String(FIXTURE.secretVersion + 1)]: SECRET },
        now: () => NOW,
      }),
    (error) =>
      error instanceof WathbaWebhookVerificationError &&
      error.code === 'wathba_webhook_unknown_secret_version',
  );
});

test('expectedWebhookVersion accepts the matching header and surfaces the contract version', async () => {
  const claims = [];
  const result = await verifyWathbaWebhook({
    rawBody: RAW_BODY,
    headers: { ...signedHeaders(), 'x-wathba-webhook-version': '2026-09-02' },
    secretResolver: resolver(),
    replayStore: {
      async claim(input) {
        claims.push(input);
        return 'claimed';
      },
    },
    now: () => NOW,
    expectedWebhookVersion: '2026-09-02',
  });
  assert.equal(result.kind, 'verified');
  assert.equal(result.webhookContractVersion, '2026-09-02');
  assert.equal(claims[0].webhookContractVersion, '2026-09-02');
});

test('a delivery without a webhook version verifies and reports none', async () => {
  const result = await verifyWathbaWebhook({
    rawBody: RAW_BODY,
    headers: signedHeaders(),
    secretResolver: resolver(),
    replayStore: { claim: async () => 'claimed' },
    now: () => NOW,
  });
  assert.equal(result.kind, 'verified');
  assert.equal('webhookContractVersion' in result, false);
});

for (const [name, header] of [
  ['missing', {}],
  ['different', { 'x-wathba-webhook-version': '2026-10-01' }],
]) {
  test(`expectedWebhookVersion rejects a ${name} webhook version header`, async () => {
    await assert.rejects(
      verifyWathbaWebhook({
        rawBody: RAW_BODY,
        headers: { ...signedHeaders(), ...header },
        secretResolver: resolver(),
        replayStore: { claim: async () => 'claimed' },
        now: () => NOW,
        expectedWebhookVersion: '2026-09-02',
      }),
      (error) =>
        error instanceof WathbaWebhookVerificationError &&
        error.code === 'wathba_webhook_version_mismatch',
    );
  });
}
