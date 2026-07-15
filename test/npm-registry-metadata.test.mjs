import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';

import {
  canonicalJson,
  createNpmRegistryMetadata,
  npmRegistryMetadataDigest,
} from '../scripts/npm-registry-metadata.mjs';

const input = {
  package: '@wathba/sdk',
  version: '0.1.0',
  registryUri: 'https://registry.npmjs.org/@wathba/sdk/-/sdk-0.1.0.tgz',
  distIntegrity: `sha512-${'A'.repeat(86)}==`,
};

test('builds the exact strict Catalog-007 npm registry metadata subset', () => {
  const metadata = createNpmRegistryMetadata(input);

  assert.deepEqual(metadata, {
    schemaVersion: 'wathba.npm-registry-metadata.v1',
    package: '@wathba/sdk',
    version: '0.1.0',
    registryUri:
      'https://registry.npmjs.org/@wathba/sdk/-/sdk-0.1.0.tgz',
    distIntegrity: `sha512-${'A'.repeat(86)}==`,
  });
  assert.deepEqual(Object.keys(metadata), [
    'schemaVersion',
    'package',
    'version',
    'registryUri',
    'distIntegrity',
  ]);
});

test('digests RFC 8785 canonical bytes without provenance', () => {
  const metadata = createNpmRegistryMetadata(input);
  const canonical =
    `{"distIntegrity":"sha512-${'A'.repeat(86)}==",` +
    '"package":"@wathba/sdk",' +
    '"registryUri":"https://registry.npmjs.org/@wathba/sdk/-/sdk-0.1.0.tgz",' +
    '"schemaVersion":"wathba.npm-registry-metadata.v1",' +
    '"version":"0.1.0"}';

  assert.equal(canonicalJson(metadata), canonical);
  assert.equal(
    npmRegistryMetadataDigest(metadata),
    `sha256:${createHash('sha256').update(canonical).digest('hex')}`,
  );
  assert.equal(canonical.includes('npmProvenance'), false);
});

test('rejects a different package, registry location, version, or integrity', () => {
  for (const invalid of [
    { ...input, package: '@wathba/other' },
    { ...input, version: 'v0.1.0' },
    { ...input, registryUri: 'https://example.invalid/sdk-0.1.0.tgz' },
    { ...input, distIntegrity: 'sha512-short' },
    { ...input, npmProvenance: { cryptographicallyVerified: true } },
  ]) {
    assert.throws(
      () => createNpmRegistryMetadata(invalid),
      /published_sdk_registry_metadata_invalid/,
    );
  }
});

test('refuses to digest provenance or any other field into registry metadata', () => {
  const metadata = createNpmRegistryMetadata(input);

  assert.throws(
    () =>
      npmRegistryMetadataDigest({
        ...metadata,
        npmProvenance: { cryptographicallyVerified: true },
      }),
    /published_sdk_registry_metadata_invalid/,
  );
  assert.throws(
    () => npmRegistryMetadataDigest({ ...metadata, schemaVersion: 'v2' }),
    /published_sdk_registry_metadata_invalid/,
  );
});
