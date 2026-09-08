import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { WathbaClient, WathbaApiError, asIdempotencyKey } from '@wathba-cli/sdk';

const fixture = JSON.parse(await readFile(new URL('../fixtures/v1/ejar-round-trip.json', import.meta.url), 'utf8'));
const input = {
  projectId: fixture.request.path.projectId,
  environmentId: fixture.request.body.environmentId,
  contractNumber: fixture.request.body.input.contractNumber,
  idempotencyKey: asIdempotencyKey(fixture.request.idempotencyKey),
};
const credentialProvider = { async resolve() { return { apiKey: 'wth_sdk_fixture_key' }; } };
function response(outcome) {
  return Response.json(outcome.body, {
    status: outcome.status,
    headers: { 'content-type': outcome.contentType, 'wathba-version': fixture.apiVersion },
  });
}
function client(fetch, options = {}) {
  return new WathbaClient({
    baseUrl: 'https://api.test.wathba.info', apiVersion: fixture.apiVersion,
    credentialProvider, fetch, ...options,
  });
}

for (const outcomeName of ['success', 'empty', 'pending', 'settlementPending']) {
  test(`Ejar typed and raw ${outcomeName} use the same operation and retain its outcome`, async () => {
    const requests = [];
    const credentials = [];
    const sdk = client(async (url, init) => {
      requests.push({ url: String(url), init });
      return response(fixture[outcomeName]);
    }, {
      credentialProvider: { async resolve(request) { credentials.push(request); return { apiKey: 'wth_sdk_fixture_key' }; } },
    });
    const typed = await sdk.ejar.getContract(input);
    const raw = await sdk.raw.execute('getEjarContract', {
      ...fixture.request, idempotencyKey: input.idempotencyKey,
    });
    assert.equal(typed.kind, outcomeName.includes('ending') ? 'pending' : 'final');
    assert.deepEqual(typed.value, raw);
    assert.deepEqual(raw, fixture[outcomeName].body);
    assert.equal(requests.length, 2);
    for (const request of requests) {
      assert.equal(request.url, `https://api.test.wathba.info/v1/platform/projects/${input.projectId}/services/realestate.ejar/operations/getContract`);
      assert.equal(request.init.method, 'POST');
      assert.equal(request.init.body, JSON.stringify(fixture.request.body));
      assert.equal(request.init.headers.get('idempotency-key'), input.idempotencyKey);
      assert.equal(request.init.headers.get('wathba-version'), fixture.apiVersion);
    }
    assert.deepEqual(credentials[0], {
      apiOrigin: 'https://api.test.wathba.info', capability: 'realestate.contracts',
      operationId: 'getEjarContract', requiredScopes: ['tools:execute', 'ejar:contracts:read'],
    });
  });
}

test('successful empty requests preserve the active integer price without hard-coding one halalah', async () => {
  for (const amountMinor of [0, 1, 2]) {
    const outcome = { ...fixture.empty, body: { ...fixture.empty.body, amountMinor } };
    const result = await client(async () => response(outcome)).ejar.getContract(input);
    assert.equal(result.kind, 'final');
    assert.equal(result.value.result.found, false);
    assert.equal(result.value.result.contract, null);
    assert.equal(result.value.amountMinor, amountMinor);
  }
});

test('transport retries preserve the exact intent and do not retry a pending success', async () => {
  const requests = [];
  const sdk = client(async (url, init) => {
    requests.push({ url: String(url), body: init.body, key: init.headers.get('idempotency-key'), version: init.headers.get('wathba-version') });
    if (requests.length === 1) throw new Error('synthetic_transport_failure');
    return response(fixture.settlementPending);
  }, { retry: { maximumAttempts: 3, delayMs: 0 } });
  const result = await sdk.ejar.getContract(input);
  assert.equal(result.kind, 'pending');
  assert.equal(requests.length, 2);
  assert.deepEqual(requests[0], requests[1]);
});

test('invalid identifiers, missing idempotency and missing API pin fail before credentials or HTTP', async () => {
  let effects = 0;
  const options = {
    credentialProvider: { async resolve() { effects += 1; return { apiKey: 'wth_sdk_fixture_key' }; } },
  };
  const sdk = client(async () => { effects += 1; return response(fixture.success); }, options);
  for (const contractNumber of [10000000000, 'b7e94d3d-7ff1-462a-b231-fcc81fd85b62', '', ' 10000000000', '1e10']) {
    await assert.rejects(sdk.ejar.getContract({ ...input, contractNumber }), { code: 'wathba_invalid_request' });
  }
  await assert.rejects(sdk.ejar.getContract({ ...input, idempotencyKey: undefined }), { code: 'wathba_invalid_request' });
  await assert.rejects(client(async () => { effects += 1; }, { ...options, apiVersion: undefined }).ejar.getContract(input), { code: 'wathba_invalid_request' });
  assert.equal(effects, 0);
});

test('required API response pins cannot be absent or contradictory', async () => {
  for (const version of [undefined, '2026-10-01']) {
    const sdk = client(async () => Response.json(fixture.success.body, {
      status: 200, headers: version ? { 'wathba-version': version } : {},
    }));
    await assert.rejects(sdk.ejar.getContract(input), { code: 'wathba_api_version_mismatch', billingEffect: 'unknown' });
  }
});

test('a problem remains a problem even when no contract or version header is present', async () => {
  let calls = 0;
  const sdk = client(async () => {
    calls += 1;
    return Response.json(fixture.problem.body, { status: fixture.problem.status, headers: { 'content-type': fixture.problem.contentType } });
  }, { retry: { maximumAttempts: 3, delayMs: 0 } });
  await assert.rejects(sdk.ejar.getContract(input), (error) => {
    assert.ok(error instanceof WathbaApiError);
    assert.equal(error.problem.code, 'idempotency_conflict');
    return true;
  });
  assert.equal(calls, 1);
});

test('malformed success and a contract exposed while pending fail response validation', async () => {
  for (const outcome of [
    { ...fixture.success, body: { ...fixture.success.body, result: undefined } },
    { ...fixture.pending, body: { ...fixture.pending.body, result: fixture.success.body.result } },
    { ...fixture.success, body: { ...fixture.success.body, state: 'pending' } },
    { ...fixture.empty, body: { ...fixture.empty.body, result: { ...fixture.empty.body.result, contract: {} } } },
  ]) {
    await assert.rejects(client(async () => response(outcome)).ejar.getContract(input), { code: 'wathba_invalid_success_response' });
  }
});
