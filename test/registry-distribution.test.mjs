import assert from 'node:assert/strict';
import test from 'node:test';

import { readRegistryDistribution } from '../scripts/registry-distribution.mjs';

test('reads the flat dist fields emitted by npm view --json', () => {
  assert.deepEqual(
    readRegistryDistribution({
      name: '@wathba/sdk',
      version: '0.1.0',
      'dist.integrity': `sha512-${'A'.repeat(86)}==`,
      'dist.tarball': 'https://registry.npmjs.org/@wathba/sdk/-/sdk-0.1.0.tgz',
    }),
    {
      integrity: `sha512-${'A'.repeat(86)}==`,
      tarball: 'https://registry.npmjs.org/@wathba/sdk/-/sdk-0.1.0.tgz',
    },
  );
});

test('rejects a nested shape or a non-registry tarball', () => {
  assert.throws(
    () =>
      readRegistryDistribution({
        dist: {
          integrity: `sha512-${'A'.repeat(86)}==`,
          tarball: 'https://registry.npmjs.org/@wathba/sdk/-/sdk-0.1.0.tgz',
        },
      }),
    /published_sdk_registry_distribution_invalid/,
  );
  assert.throws(
    () =>
      readRegistryDistribution({
        'dist.integrity': `sha512-${'A'.repeat(86)}==`,
        'dist.tarball': 'https://example.invalid/sdk.tgz',
      }),
    /published_sdk_registry_distribution_invalid/,
  );
});
