import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  WathbaApiError,
  WathbaClient,
  asIdempotencyKey,
} from '@wathba/sdk';

const fixture = JSON.parse(
  await readFile(new URL('../fixtures/v1/otp-round-trip.json', import.meta.url), 'utf8'),
);

test('OTP sends the canonical shared-fixture request with one resolved credential', async () => {
  const requests = [];
  const credentialRequests = [];
  let resolutions = 0;
  const client = new WathbaClient({
    baseUrl: 'https://api.test.wathba.info',
    credentialProvider: {
      async resolve(request) {
        resolutions += 1;
        credentialRequests.push(request);
        return { apiKey: 'wth_test_key' };
      },
    },
    fetch: async (url, init) => {
      requests.push({ url: String(url), init });
      return Response.json(fixture.success.body, { status: fixture.success.status });
    },
  });

  const outcome = await client.otp.send({
    projectId: fixture.request.path.projectId,
    ...fixture.request.body,
    email: ' User@Example.COM ',
    idempotencyKey: asIdempotencyKey(fixture.request.idempotencyKey),
  });

  assert.equal(outcome.kind, 'final');
  assert.deepEqual(outcome.value, fixture.success.body);
  assert.equal(resolutions, 1);
  assert.deepEqual(credentialRequests, [{
    apiOrigin: 'https://api.test.wathba.info',
    capability: 'messaging.otp',
    operationId: 'sendOtp',
    requiredScopes: ['otp:send'],
  }]);
  assert.equal(
    requests[0].url,
    `https://api.test.wathba.info/v1/platform/projects/${fixture.request.path.projectId}/otp/send`,
  );
  assert.equal(requests[0].init.headers.get('x-api-key'), 'wth_test_key');
  assert.equal(requests[0].init.headers.get('idempotency-key'), fixture.request.idempotencyKey);
  assert.equal(requests[0].init.redirect, 'error');
  assert.equal(requests[0].init.credentials, 'omit');
  assert.deepEqual(JSON.parse(requests[0].init.body), fixture.request.body);
});

test('OTP verify sends the canonical verify request with one resolved credential', async () => {
  const requests = [];
  const credentialRequests = [];
  let resolutions = 0;
  const client = new WathbaClient({
    baseUrl: 'https://api.test.wathba.info',
    credentialProvider: {
      async resolve(request) {
        resolutions += 1;
        credentialRequests.push(request);
        return { apiKey: 'wth_test_key' };
      },
    },
    fetch: async (url, init) => {
      requests.push({ url: String(url), init });
      return Response.json(fixture.success.body, { status: fixture.success.status });
    },
  });

  const outcome = await client.otp.verify({
    projectId: fixture.request.path.projectId,
    environmentId: fixture.request.body.environmentId,
    email: ' User@Example.COM ',
    otp: ' 012345 ',
    idempotencyKey: asIdempotencyKey('idem_otp_verify_123'),
  });

  assert.equal(outcome.kind, 'final');
  assert.deepEqual(outcome.value, fixture.success.body);
  assert.equal(resolutions, 1);
  assert.deepEqual(credentialRequests, [{
    apiOrigin: 'https://api.test.wathba.info',
    capability: 'messaging.otp',
    operationId: 'verifyOtp',
    requiredScopes: ['otp:verify'],
  }]);
  assert.equal(
    requests[0].url,
    `https://api.test.wathba.info/v1/platform/projects/${fixture.request.path.projectId}/otp/verify`,
  );
  assert.equal(requests[0].init.headers.get('x-api-key'), 'wth_test_key');
  assert.equal(requests[0].init.headers.get('idempotency-key'), 'idem_otp_verify_123');
  assert.equal(requests[0].init.redirect, 'error');
  assert.equal(requests[0].init.credentials, 'omit');
  assert.deepEqual(JSON.parse(requests[0].init.body), {
    environmentId: fixture.request.body.environmentId,
    email: 'user@example.com',
    otp: '012345',
  });
});

test('OTP verify surfaces stable problem responses as typed errors without request material', async () => {
  const client = new WathbaClient({
    credentialProvider: { async resolve() { return { apiKey: 'wth_test_key' }; } },
    fetch: async () => Response.json(fixture.problem.body, {
      status: fixture.problem.status,
      headers: { 'content-type': fixture.problem.contentType },
    }),
  });

  await assert.rejects(
    client.otp.verify({
      projectId: fixture.request.path.projectId,
      environmentId: fixture.request.body.environmentId,
      email: fixture.request.body.email,
      otp: '012345',
      idempotencyKey: asIdempotencyKey('idem_otp_verify_invalid_123'),
    }),
    (error) => {
      assert.ok(error instanceof WathbaApiError);
      assert.equal(error.problem.code, 'validation_failed');
      assert.doesNotMatch(error.message, /012345|wth_test_key/);
      return true;
    },
  );
});

test('OTP verify rejects a malformed email before resolving a credential', async () => {
  let resolutions = 0;
  const client = new WathbaClient({
    credentialProvider: { async resolve() { resolutions += 1; return { apiKey: 'wth_test_key' }; } },
    fetch: async () => Response.json(fixture.success.body, { status: fixture.success.status }),
  });

  await assert.rejects(
    client.otp.verify({
      projectId: fixture.request.path.projectId,
      environmentId: fixture.request.body.environmentId,
      email: 'not-an-email',
      otp: '012345',
      idempotencyKey: asIdempotencyKey('idem_otp_verify_bad_email_123'),
    }),
    (error) => error.code === 'wathba_invalid_request',
  );
  assert.equal(resolutions, 0);
});

test('OTP preserves a declared pending execution in the ergonomic outcome', async () => {
  const client = new WathbaClient({
    credentialProvider: { async resolve() { return { apiKey: 'wth_test_key' }; } },
    fetch: async () => Response.json(
      { ...fixture.success.body, state: 'pending', statusCode: 202, message: 'accepted_pending' },
      { status: 202 },
    ),
  });

  const outcome = await client.otp.send({
    projectId: fixture.request.path.projectId,
    ...fixture.request.body,
    idempotencyKey: asIdempotencyKey('idem_otp_pending_123'),
  });

  assert.equal(outcome.kind, 'pending');
  assert.equal(outcome.value.state, 'pending');
});

test('OTP rejects malformed email before resolving a credential', async () => {
  let resolutions = 0;
  const client = new WathbaClient({
    credentialProvider: { async resolve() { resolutions += 1; return { apiKey: 'wth_test_key' }; } },
    fetch: async () => Response.json(fixture.success.body, { status: fixture.success.status }),
  });

  await assert.rejects(
    client.otp.send({
      projectId: fixture.request.path.projectId,
      ...fixture.request.body,
      email: 'not-an-email',
      idempotencyKey: asIdempotencyKey('idem_otp_bad_email_123'),
    }),
    (error) => error.code === 'wathba_invalid_request',
  );
  assert.equal(resolutions, 0);
});

test('stable problem responses become typed errors without request material', async () => {
  const client = new WathbaClient({
    credentialProvider: { async resolve() { return { apiKey: 'wth_test_key' }; } },
    fetch: async () => Response.json(fixture.problem.body, {
      status: fixture.problem.status,
      headers: { 'content-type': fixture.problem.contentType },
    }),
  });

  await assert.rejects(
    client.otp.send({
      projectId: fixture.request.path.projectId,
      ...fixture.request.body,
      idempotencyKey: asIdempotencyKey('idem_otp_invalid_123'),
    }),
    (error) => {
      assert.ok(error instanceof WathbaApiError);
      assert.equal(error.problem.code, 'validation_failed');
      assert.doesNotMatch(error.message, /invalid|wth_test_key/);
      return true;
    },
  );
});

test('successful HTTP responses that violate the pinned response schema fail closed', async () => {
  const client = new WathbaClient({
    credentialProvider: { async resolve() { return { apiKey: 'wth_test_key' }; } },
    fetch: async () => Response.json({ state: 'succeeded' }, { status: fixture.success.status }),
  });

  await assert.rejects(
    client.otp.send({
      projectId: fixture.request.path.projectId,
      ...fixture.request.body,
      idempotencyKey: asIdempotencyKey(fixture.request.idempotencyKey),
    }),
    (error) => {
      assert.equal(error.code, 'wathba_invalid_success_response');
      assert.doesNotMatch(error.message, /wth_test_key|user@example.com/);
      return true;
    },
  );
});

test('problem responses with undeclared fields are rejected without retaining the payload', async () => {
  const canary = 'wth_secret_problem_canary';
  const client = new WathbaClient({
    credentialProvider: { async resolve() { return { apiKey: 'wth_test_key' }; } },
    fetch: async () => Response.json(
      { ...fixture.problem.body, apiKey: canary },
      {
        status: fixture.problem.status,
        headers: { 'content-type': fixture.problem.contentType },
      },
    ),
  });

  await assert.rejects(
    client.otp.send({
      projectId: fixture.request.path.projectId,
      ...fixture.request.body,
      idempotencyKey: asIdempotencyKey(fixture.request.idempotencyKey),
    }),
    (error) => {
      assert.equal(error.code, 'wathba_invalid_problem_response');
      assert.doesNotMatch(error.message, new RegExp(canary));
      assert.equal('problem' in error, false);
      return true;
    },
  );
});

test('problem status must match the actual HTTP response status', async () => {
  const client = new WathbaClient({
    credentialProvider: { async resolve() { return { apiKey: 'wth_test_key' }; } },
    fetch: async () => Response.json(
      { ...fixture.problem.body, status: 409 },
      {
        status: fixture.problem.status,
        headers: { 'content-type': fixture.problem.contentType },
      },
    ),
  });

  await assert.rejects(
    client.otp.send({
      projectId: fixture.request.path.projectId,
      ...fixture.request.body,
      idempotencyKey: asIdempotencyKey(fixture.request.idempotencyKey),
    }),
    (error) => error.code === 'wathba_invalid_problem_response',
  );
});

test('credential provider failures are sanitized and never fall back to another source', async () => {
  const canary = 'wth_credential_provider_canary';
  let fetchCalls = 0;
  const client = new WathbaClient({
    credentialProvider: {
      async resolve() {
        throw new Error(canary);
      },
    },
    fetch: async () => {
      fetchCalls += 1;
      return Response.json(fixture.success.body, { status: fixture.success.status });
    },
  });

  await assert.rejects(
    client.otp.send({
      projectId: fixture.request.path.projectId,
      ...fixture.request.body,
      idempotencyKey: asIdempotencyKey(fixture.request.idempotencyKey),
    }),
    (error) => {
      assert.equal(error.code, 'wathba_credential_unavailable');
      assert.doesNotMatch(error.message, new RegExp(canary));
      return true;
    },
  );
  assert.equal(fetchCalls, 0);
});

test('an opted-in transport retry replays the exact idempotency key and request', async () => {
  const requests = [];
  const client = new WathbaClient({
    credentialProvider: { async resolve() { return { apiKey: 'wth_test_key' }; } },
    retry: { maximumAttempts: 2, delayMs: 0 },
    fetch: async (url, init) => {
      requests.push({ url: String(url), init });
      if (requests.length === 1) throw new Error('transport_canary');
      return Response.json(fixture.success.body, { status: fixture.success.status });
    },
  });

  const result = await client.otp.send({
    projectId: fixture.request.path.projectId,
    ...fixture.request.body,
    idempotencyKey: asIdempotencyKey(fixture.request.idempotencyKey),
  });

  assert.equal(result.kind, 'final');
  assert.deepEqual(result.value, fixture.success.body);
  assert.equal(requests.length, 2);
  assert.equal(requests[0].url, requests[1].url);
  assert.equal(
    requests[0].init.headers.get('idempotency-key'),
    requests[1].init.headers.get('idempotency-key'),
  );
  assert.equal(requests[0].init.body, requests[1].init.body);
});

test('an exhausted transport failure is typed and does not retain the transport error', async () => {
  const canary = 'transport_secret_canary';
  const client = new WathbaClient({
    credentialProvider: { async resolve() { return { apiKey: 'wth_test_key' }; } },
    fetch: async () => { throw new Error(canary); },
  });

  await assert.rejects(
    client.otp.send({
      projectId: fixture.request.path.projectId,
      ...fixture.request.body,
      idempotencyKey: asIdempotencyKey(fixture.request.idempotencyKey),
    }),
    (error) => {
      assert.equal(error.code, 'wathba_transport_unavailable');
      assert.equal(error.retryable, true);
      assert.equal(error.billingEffect, 'unknown');
      assert.doesNotMatch(error.message, new RegExp(canary));
      assert.equal(error.cause, undefined);
      return true;
    },
  );
});

test('same idempotency key with a different request is a typed conflict', async () => {
  let calls = 0;
  const conflict = {
    ...fixture.problem.body,
    status: 409,
    code: 'idempotency_conflict',
    title: 'Idempotency key conflicts with the original request',
  };
  const client = new WathbaClient({
    credentialProvider: { async resolve() { return { apiKey: 'wth_test_key' }; } },
    fetch: async () => {
      calls += 1;
      if (calls === 1) {
        return Response.json(fixture.success.body, { status: fixture.success.status });
      }
      return Response.json(conflict, {
        status: 409,
        headers: { 'content-type': 'application/problem+json' },
      });
    },
  });
  const idempotencyKey = asIdempotencyKey(fixture.request.idempotencyKey);
  await client.otp.send({
    projectId: fixture.request.path.projectId,
    ...fixture.request.body,
    idempotencyKey,
  });

  await assert.rejects(
    client.otp.send({
      projectId: fixture.request.path.projectId,
      ...fixture.request.body,
      purpose: 'different_intent',
      idempotencyKey,
    }),
    (error) => {
      assert.ok(error instanceof WathbaApiError);
      assert.equal(error.problem.code, 'idempotency_conflict');
      assert.equal(error.problem.retryable, false);
      return true;
    },
  );
});

test('a declared 202 response remains a pending execution instead of being coerced to success', async () => {
  const pending = {
    ...fixture.success.body,
    state: 'pending',
    statusCode: 202,
    message: 'pending',
  };
  const client = new WathbaClient({
    credentialProvider: { async resolve() { return { apiKey: 'wth_test_key' }; } },
    fetch: async () => Response.json(pending, { status: 202 }),
  });

  const result = await client.otp.send({
    projectId: fixture.request.path.projectId,
    ...fixture.request.body,
    idempotencyKey: asIdempotencyKey(fixture.request.idempotencyKey),
  });

  assert.equal(result.kind, 'pending');
  assert.equal(result.value.state, 'pending');
  assert.equal(result.value.statusCode, 202);
});

test('malformed JSON responses are sanitized without retaining response bytes', async () => {
  const canary = 'response_payload_canary';
  const client = new WathbaClient({
    credentialProvider: { async resolve() { return { apiKey: 'wth_test_key' }; } },
    fetch: async () => new Response(canary, {
      status: fixture.success.status,
      headers: { 'content-type': fixture.success.contentType },
    }),
  });

  await assert.rejects(
    client.otp.send({
      projectId: fixture.request.path.projectId,
      ...fixture.request.body,
      idempotencyKey: asIdempotencyKey(fixture.request.idempotencyKey),
    }),
    (error) => {
      assert.equal(error.code, 'wathba_invalid_json_response');
      assert.doesNotMatch(error.message, new RegExp(canary));
      return true;
    },
  );
});
