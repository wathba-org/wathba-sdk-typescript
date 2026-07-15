import assert from 'node:assert/strict';
import test from 'node:test';
import * as sdk from '../dist/esm/index.js';

test('does not export the removed member-cloud credential provider', () => {
  assert.equal('createGcpSecretManagerCredentialProvider' in sdk, false);
  assert.equal('GcpSecretManagerCredentialProviderOptions' in sdk, false);
  assert.equal('GcpWorkloadAccessTokenProvider' in sdk, false);
});
