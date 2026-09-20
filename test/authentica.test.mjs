import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { WathbaClient, WathbaApiError, asIdempotencyKey } from '@wathba-cli/sdk';

async function fixture(name) {
  return JSON.parse(await readFile(new URL(`../fixtures/v1/authentica-${name}-round-trip.json`, import.meta.url), 'utf8'));
}
const send = await fixture('send');
const verify = await fixture('verify');
const status = await fixture('status');
const credentialProvider = { async resolve() { return { apiKey: 'wth_sdk_fixture_key' }; } };
function input(value) {
  return {
    ...value.request.path,
    environmentId: value.request.body.environmentId,
    ...value.request.body.input,
    idempotencyKey: asIdempotencyKey(value.request.idempotencyKey),
  };
}
function response(value, apiVersion = send.apiVersion) {
  return Response.json(value.body, {
    status: value.status,
    headers: { 'content-type': value.contentType, 'wathba-version': apiVersion },
  });
}
function client(fetch, options = {}) {
  return new WathbaClient({
    baseUrl: 'https://api.test.wathba.info', apiVersion: send.apiVersion,
    credentialProvider, fetch, ...options,
  });
}

for (const [value, method, outcomes] of [
  [send, 'sendOtp', ['success', 'pending', 'settlementPending']],
  [verify, 'verifyOtp', ['success', 'pending', 'invalid']],
]) {
  for (const outcome of outcomes) {
    test(`Authentica ${method} ${outcome} preserves the generated contract through typed and raw calls`, async () => {
      const requests = [];
      const credentials = [];
      const sdk = client(async (url, init) => {
        requests.push({ url: String(url), init });
        return response(value[outcome]);
      }, { credentialProvider: { async resolve(request) {
        credentials.push(request);
        return { apiKey: 'wth_sdk_fixture_key' };
      } } });
      const typed = await sdk.verification[method](input(value));
      const raw = await sdk.raw.execute(value.operationId, {
        ...value.request, idempotencyKey: input(value).idempotencyKey,
      });
      assert.equal(typed.kind, value[outcome].body.state === 'pending' ? 'pending' : 'final');
      assert.deepEqual(typed.value, raw);
      assert.deepEqual(raw, value[outcome].body);
      for (const request of requests) {
        assert.equal(request.url, `https://api.test.wathba.info/v1/platform/projects/${value.request.path.projectId}/services/messaging.otp.authentica/operations/${method}`);
        assert.equal(request.init.method, 'POST');
        assert.deepEqual(JSON.parse(request.init.body), value.request.body);
        assert.equal(request.init.headers.get('idempotency-key'), value.request.idempotencyKey);
        assert.equal(request.init.headers.get('wathba-version'), value.apiVersion);
      }
      assert.deepEqual(credentials[0].requiredScopes, ['tools:execute', method === 'sendOtp' ? 'otp:send' : 'otp:verify']);
      assert.equal(credentials[0].capability, 'messaging.otp');
      assert.equal(JSON.stringify(credentials).includes('otp":"1234'), false);
    });
  }
}

test('channel charges remain exact SAR including sub-halala Email and repeating SMS rates', async () => {
  for (const [channel, numerator, denominator] of [['email', '1', '10000'], ['sms', '1', '9'], ['whatsapp', '2', '9']]) {
    const value = { ...send.success, body: { ...send.success.body, result: {
      ...send.success.body.result, deliveryMethod: channel, charge: { currency: 'SAR', numerator, denominator },
    } } };
    const result = await client(async () => response(value)).verification.sendOtp(input(send));
    assert.deepEqual(result.value.result.charge, value.body.result.charge);
    assert.equal('amountMinor' in result.value, false);
    assert.equal('points' in result.value.result, false);
  }
});

for (const outcome of ['success', 'pending', 'failed']) {
  test(`status ${outcome} reads the original execution without another message or verification`, async () => {
    let request;
    let credentialRequest;
    const sdk = client(async (url, init) => {
      request = { url: String(url), init };
      return response(status[outcome]);
    }, { credentialProvider: { async resolve(value) {
      credentialRequest = value;
      return { apiKey: 'wth_sdk_fixture_key' };
    } } });
    const result = await sdk.verification.getExecutionStatus(status.request.path);
    assert.equal(result.kind, outcome === 'pending' ? 'pending' : 'final');
    assert.deepEqual(result.value, status[outcome].body);
    assert.equal(request.init.method, 'GET');
    assert.equal(request.init.body, undefined);
    assert.equal(request.init.headers.has('idempotency-key'), false);
    assert.equal(request.url, `https://api.test.wathba.info/v1/platform/projects/${status.request.path.projectId}/services/messaging.otp.authentica/executions/${status.request.path.executionId}`);
    assert.deepEqual(credentialRequest.requiredScopes, ['tools:execute']);
    assert.deepEqual(credentialRequest.scopeAlternatives, [['tools:execute', 'otp:send'], ['tools:execute', 'otp:verify']]);
  });
}

test('transport retry retains the same intent and key; a pending response never causes another send', async () => {
  const requests = [];
  const result = await client(async (url, init) => {
    requests.push({ url: String(url), body: init.body, key: init.headers.get('idempotency-key') });
    if (requests.length === 1) throw new Error('synthetic_timeout');
    return response(send.pending);
  }, { retry: { maximumAttempts: 3, delayMs: 0 } }).verification.sendOtp(input(send));
  assert.equal(result.kind, 'pending');
  assert.equal(requests.length, 2);
  assert.deepEqual(requests[0], requests[1]);
  assert.equal('result' in result.value, false);
});

test('invalid input fails before credentials or HTTP', async () => {
  let effects = 0;
  const sdk = client(async () => { effects += 1; }, {
    credentialProvider: { async resolve() { effects += 1; return { apiKey: 'wth_sdk_fixture_key' }; } },
  });
  for (const maxCostSar of [0.0001, '-1', '0.00001', '1e-4', undefined]) {
    await assert.rejects(sdk.verification.sendOtp({ ...input(send), maxCostSar }), { code: 'wathba_invalid_request' });
  }
  for (const otp of [1234, '123456', '12', 'abcd']) {
    await assert.rejects(sdk.verification.verifyOtp({ ...input(verify), otp }), { code: 'wathba_invalid_request' });
  }
  await assert.rejects(sdk.verification.verifyOtp({ ...input(verify), recipient: { email: 'different@example.com' } }), { code: 'wathba_invalid_request' });
  await assert.rejects(sdk.verification.sendOtp({ ...input(send), idempotencyKey: undefined }), { code: 'wathba_invalid_request' });
  assert.equal(effects, 0);
});

test('verification keeps leading zeroes and never submits another recipient or send ceiling', async () => {
  let body;
  const result = await client(async (_url, init) => {
    body = JSON.parse(init.body);
    return response(verify.success);
  }).verification.verifyOtp({ ...input(verify), otp: '0123' });
  assert.equal(body.input.otp, '0123');
  assert.deepEqual(Object.keys(body.input).sort(), ['otp', 'sendExecutionId']);
  assert.equal(result.value.result.sendExecutionId, send.success.body.executionId);
  assert.equal('charge' in result.value.result, false);
});

test('strict pending and failure responses cannot expose a successful verification or charge', async () => {
  for (const value of [
    { ...send.pending, body: { ...send.pending.body, result: send.success.body.result } },
    { ...verify.invalid, body: { ...verify.invalid.body, result: verify.success.body.result } },
    { ...verify.invalid, body: { ...verify.invalid.body, statusCode: 400 } },
  ]) {
    const sdk = client(async () => response(value));
    await assert.rejects(value.status === 202 ? sdk.verification.sendOtp(input(send)) : sdk.verification.verifyOtp(input(verify)), (error) => {
      assert.ok(['wathba_invalid_success_response', 'wathba_invalid_execution_response'].includes(error.code));
      assert.equal(error.billingEffect, 'unknown');
      return true;
    });
  }
});

test('runtime version pins apply to both successful and failed execution envelopes', async () => {
  for (const value of [send.success, verify.invalid]) {
    for (const version of [undefined, '2099-01-01']) {
      const sdk = client(async () => Response.json(value.body, {
        status: value.status,
        headers: version ? { 'wathba-version': version } : {},
      }));
      await assert.rejects(value.status === 200 ? sdk.verification.sendOtp(input(send)) : sdk.verification.verifyOtp(input(verify)), {
        code: 'wathba_api_version_mismatch', billingEffect: 'unknown',
      });
    }
  }
});

test('a Wathba problem retains its error contract and is not a failed execution envelope', async () => {
  await assert.rejects(client(async () => response(send.problem)).verification.sendOtp(input(send)), (error) => {
    assert.ok(error instanceof WathbaApiError);
    assert.equal(error.problem.code, 'idempotency_conflict');
    return true;
  });
});
