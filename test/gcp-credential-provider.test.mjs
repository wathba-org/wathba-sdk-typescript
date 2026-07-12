import assert from 'node:assert/strict';
import test from 'node:test';
import { createGcpSecretManagerCredentialProvider } from '../dist/esm/index.js';

const RESOURCE =
  'projects/123456789012/secrets/wathba-app/versions/7';
const CREDENTIAL = 'wth_test_exact_credential';

test('resolves only the approved exact numeric secret version', async () => {
  const requests = [];
  const provider = createGcpSecretManagerCredentialProvider({
    secretVersionResource: RESOURCE,
    allowedCapabilities: ['messaging.otp'],
    allowedScopes: ['otp:send'],
    accessTokenProvider: {
      async getAccessToken() {
        return 'workload-access-token-that-is-long-enough';
      },
    },
    async fetch(url, init) {
      requests.push({ url: String(url), init });
      return secretResponse(RESOURCE, CREDENTIAL);
    },
  });

  await assert.doesNotReject(async () => {
    const credential = await provider.resolve({
      apiOrigin: 'https://api.wathba.info',
      capability: 'messaging.otp',
      operationId: 'sendOtp',
      requiredScopes: ['otp:send'],
    });
    assert.deepEqual(credential, { apiKey: CREDENTIAL, version: 7 });
  });
  assert.equal(
    requests[0].url,
    `https://secretmanager.googleapis.com/v1/${RESOURCE}:access`,
  );
  assert.equal(requests[0].init.redirect, 'error');
  assert.equal(requests[0].init.credentials, 'omit');
});

test('verifies CRC32C against the standard Castagnoli check vector', async () => {
  const provider = providerForResponse(
    secretResponse(RESOURCE, '123456789', '3808858755'),
  );
  assert.deepEqual(await provider.resolve(validRequest()), {
    apiKey: '123456789',
    version: 7,
  });
});

test('rejects latest, project ids, zero versions, and non-secret resources at construction', () => {
  for (const resource of [
    'projects/123456789012/secrets/wathba-app/versions/latest',
    'projects/example-project/secrets/wathba-app/versions/7',
    'projects/123456789012/secrets/wathba-app/versions/0',
    'projects/123456789012/secrets/wathba-app',
  ]) {
    assert.throws(
      () =>
        createGcpSecretManagerCredentialProvider({
          secretVersionResource: resource,
          allowedCapabilities: ['messaging.otp'],
          allowedScopes: ['otp:send'],
        }),
      /wathba_invalid_gcp_secret_version/,
    );
  }
});

test('rejects unapproved origin, capability, and scope before fetching a token or secret', async () => {
  let tokenCalls = 0;
  let fetchCalls = 0;
  const provider = createGcpSecretManagerCredentialProvider({
    secretVersionResource: RESOURCE,
    allowedCapabilities: ['messaging.otp'],
    allowedScopes: ['otp:send'],
    accessTokenProvider: {
      async getAccessToken() {
        tokenCalls += 1;
        return 'workload-access-token-that-is-long-enough';
      },
    },
    async fetch() {
      fetchCalls += 1;
      return secretResponse(RESOURCE, CREDENTIAL);
    },
  });

  for (const request of [
    {
      apiOrigin: 'https://attacker.example',
      capability: 'messaging.otp',
      operationId: 'sendOtp',
      requiredScopes: ['otp:send'],
    },
    {
      apiOrigin: 'https://api.wathba.info',
      capability: 'payments.checkout',
      operationId: 'sendOtp',
      requiredScopes: ['otp:send'],
    },
    {
      apiOrigin: 'https://api.wathba.info',
      capability: 'messaging.otp',
      operationId: 'sendOtp',
      requiredScopes: ['keys:manage'],
    },
  ]) {
    await assert.rejects(
      provider.resolve(request),
      /wathba_gcp_credential_use_not_authorized/,
    );
  }
  assert.equal(tokenCalls, 0);
  assert.equal(fetchCalls, 0);
});

test('rejects wrong resource, invalid checksum, and malformed payload without exposing values', async () => {
  for (const response of [
    secretResponse(
      'projects/123456789012/secrets/wathba-app/versions/8',
      CREDENTIAL,
    ),
    secretResponse(RESOURCE, CREDENTIAL, '1'),
    jsonResponse({ name: RESOURCE, payload: { data: '***', dataCrc32c: '0' } }),
  ]) {
    const provider = providerForResponse(response);
    await assert.rejects(
      provider.resolve(validRequest()),
      (error) => {
        assert.equal(error.message, 'wathba_gcp_credential_unavailable');
        assert.doesNotMatch(error.stack ?? '', new RegExp(CREDENTIAL));
        return true;
      },
    );
  }
});

test('uses the metadata identity by default and never sends metadata tokens to another host', async () => {
  const requests = [];
  const provider = createGcpSecretManagerCredentialProvider({
    secretVersionResource: RESOURCE,
    allowedCapabilities: ['messaging.otp'],
    allowedScopes: ['otp:send'],
    async fetch(url, init) {
      requests.push({ url: String(url), init });
      if (String(url).startsWith('http://metadata.google.internal/')) {
        return jsonResponse({
          access_token: 'metadata-access-token-that-is-long-enough',
          expires_in: 3600,
          token_type: 'Bearer',
        });
      }
      return secretResponse(RESOURCE, CREDENTIAL);
    },
  });

  await provider.resolve(validRequest());
  assert.equal(requests.length, 2);
  assert.equal(requests[0].init.headers['Metadata-Flavor'], 'Google');
  assert.equal(requests[0].init.headers.authorization, undefined);
  assert.equal(
    requests[1].init.headers.authorization,
    'Bearer metadata-access-token-that-is-long-enough',
  );
});

function providerForResponse(response) {
  return createGcpSecretManagerCredentialProvider({
    secretVersionResource: RESOURCE,
    allowedCapabilities: ['messaging.otp'],
    allowedScopes: ['otp:send'],
    accessTokenProvider: {
      async getAccessToken() {
        return 'workload-access-token-that-is-long-enough';
      },
    },
    async fetch() {
      return response;
    },
  });
}

function validRequest() {
  return {
    apiOrigin: 'https://api.wathba.info',
    capability: 'messaging.otp',
    operationId: 'sendOtp',
    requiredScopes: ['otp:send'],
  };
}

function secretResponse(name, credential, checksum = String(crc32c(credential))) {
  return jsonResponse({
    name,
    payload: {
      data: Buffer.from(credential, 'utf8').toString('base64'),
      dataCrc32c: checksum,
    },
  });
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

function crc32c(value) {
  let crc = 0xffffffff;
  for (const byte of Buffer.from(value, 'utf8')) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0x82f63b78 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}
