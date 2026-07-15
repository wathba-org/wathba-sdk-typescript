import assert from 'node:assert/strict';
import test from 'node:test';

import { integritySha512Hex } from '../scripts/published-package-provenance.mjs';

test('derives the signed subject digest from canonical npm SHA-512 integrity', () => {
  const digest = Buffer.alloc(64, 0xab);

  assert.equal(
    integritySha512Hex(`sha512-${digest.toString('base64')}`),
    digest.toString('hex'),
  );
});

test('rejects a wrong algorithm, length, or non-canonical integrity', () => {
  for (const invalid of [
    `sha256-${Buffer.alloc(32).toString('base64')}`,
    `sha512-${Buffer.alloc(63).toString('base64')}`,
    `sha512-${Buffer.alloc(64).toString('base64').replace(/==$/, '')}`,
    'sha512-not-base64',
  ]) {
    assert.throws(
      () => integritySha512Hex(invalid),
      /published_sdk_registry_distribution_invalid/,
    );
  }
});
