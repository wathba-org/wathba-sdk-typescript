import assert from 'node:assert/strict';
import test from 'node:test';
import { RawWathbaClient } from '@wathba/sdk/raw';

test('raw client rejects query values outside the generated operation contract before credentials', async () => {
  let credentialResolutions = 0;
  let fetchCalls = 0;
  const raw = new RawWathbaClient({
    credentialProvider: {
      async resolve() {
        credentialResolutions += 1;
        return { apiKey: 'wth_test_key' };
      },
    },
    fetch: async () => {
      fetchCalls += 1;
      throw new Error('fetch_must_not_run');
    },
  });

  await assert.rejects(
    raw.execute('listPaymentLinks', {
      path: { projectId: 'prj_raw_test' },
      query: { status: 'unknown_value' },
    }),
    (error) => error.code === 'wathba_invalid_request',
  );
  assert.equal(credentialResolutions, 0);
  assert.equal(fetchCalls, 0);
});

test('credential-bearing requests reject cleartext non-loopback API origins', () => {
  assert.throws(
    () => new RawWathbaClient({
      baseUrl: 'http://api.example.test',
      credentialProvider: { async resolve() { return { apiKey: 'wth_test_key' }; } },
    }),
    /wathba_insecure_base_url/,
  );
});
