import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { WathbaApiError, WathbaClient, asIdempotencyKey } from '@wathba-cli/sdk';

const fixture = JSON.parse(
  await readFile(new URL('../fixtures/v1/otp-round-trip.json', import.meta.url), 'utf8'),
);
const PINNED = '2026-09-02';
const OTHER = '2026-10-01';

function problem(status, code, { retryable = false, version } = {}) {
  return Response.json(
    { ...fixture.problem.body, status, code, title: code, retryable },
    {
      status,
      headers: {
        'content-type': 'application/problem+json',
        ...(version ? { 'wathba-version': version } : {}),
      },
    },
  );
}

function success(version) {
  return Response.json(fixture.success.body, {
    status: fixture.success.status,
    headers: version ? { 'wathba-version': version } : {},
  });
}

function send(responses, options = {}) {
  const requests = [];
  const client = new WathbaClient({
    credentialProvider: { async resolve() { return { apiKey: 'wth_test_key' }; } },
    retry: { maximumAttempts: 2, delayMs: 0 },
    ...options,
    fetch: async (url, init) => {
      requests.push(init.headers.get('wathba-version'));
      return responses[requests.length - 1]();
    },
  });
  const outcome = client.otp.send({
    projectId: fixture.request.path.projectId,
    ...fixture.request.body,
    idempotencyKey: asIdempotencyKey(fixture.request.idempotencyKey),
  });
  return { outcome, requests };
}

function isMismatch(expectedVersion, pinnedVersion) {
  return (error) => {
    assert.equal(error.code, 'wathba_api_version_mismatch');
    assert.equal(error.retryable, false);
    assert.equal(error.billingEffect, 'none');
    assert.equal(error.expectedVersion, expectedVersion);
    assert.equal(error.pinnedVersion, pinnedVersion);
    return true;
  };
}

test('a successful response pinned to another version fails closed', async () => {
  const { outcome, requests } = send([() => success(OTHER)], { apiVersion: PINNED });
  await assert.rejects(outcome, isMismatch(PINNED, OTHER));
  assert.deepEqual(requests, [PINNED]);
});

test('a non-2xx response is its real problem, never a version mismatch', async () => {
  const { outcome } = send([() => problem(401, 'authentication_required')], { apiVersion: PINNED });
  await assert.rejects(outcome, (error) => {
    assert.ok(error instanceof WathbaApiError);
    assert.equal(error.problem.code, 'authentication_required');
    return true;
  });
});

test('a retryable problem without the header keeps asserting the configured pin', async () => {
  const { outcome, requests } = send(
    [() => problem(503, 'upstream_unavailable', { retryable: true }), () => success(PINNED)],
    { apiVersion: PINNED },
  );
  assert.equal((await outcome).kind, 'final');
  assert.deepEqual(requests, [PINNED, PINNED]);
});

test('a successful response without the header is accepted', async () => {
  const { outcome, requests } = send([() => success()], { apiVersion: PINNED });
  assert.equal((await outcome).kind, 'final');
  assert.deepEqual(requests, [PINNED]);
});

test('the first reported pin is frozen and re-sent verbatim on retry', async () => {
  const { outcome, requests } = send([
    () => problem(503, 'upstream_unavailable', { retryable: true, version: PINNED }),
    () => success(PINNED),
  ]);
  assert.equal((await outcome).kind, 'final');
  assert.deepEqual(requests, [null, PINNED]);
});

test('a retry answered with a different pin fails closed', async () => {
  const { outcome } = send([
    () => problem(503, 'upstream_unavailable', { retryable: true, version: PINNED }),
    () => success(OTHER),
  ]);
  await assert.rejects(outcome, isMismatch(PINNED, OTHER));
});

for (const [name, init] of [
  ['body', { body: { pinnedVersion: OTHER, expectedVersion: PINNED } }],
  ['header', { headers: { 'wathba-version': OTHER } }],
]) {
  test(`a server 409 api_version_mismatch surfaces pinnedVersion from the ${name}`, async () => {
    const { outcome } = send(
      [
        () => Response.json(
          { ...fixture.problem.body, status: 409, code: 'api_version_mismatch', ...init.body },
          { status: 409, headers: { 'content-type': 'application/problem+json', ...init.headers } },
        ),
      ],
      { apiVersion: PINNED },
    );
    await assert.rejects(outcome, isMismatch(PINNED, OTHER));
  });
}

test('an invalid apiVersion is rejected before any request', () => {
  assert.throws(
    () => new WathbaClient({
      credentialProvider: { async resolve() { return { apiKey: 'wth_test_key' }; } },
      apiVersion: 'v1',
    }),
    /wathba_invalid_api_version/,
  );
});
