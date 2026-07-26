const assert = require('node:assert/strict');
const test = require('node:test');
const sdk = require('@wathba-cli/sdk');

test('CommonJS export is usable', () => {
  assert.equal(typeof sdk.WathbaClient, 'function');
  assert.equal(typeof sdk.createIdempotencyKey, 'function');
});
