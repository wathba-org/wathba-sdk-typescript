import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { wathbaSdkRelease } from '@wathba-cli/sdk';

test('canonical and runtime release metadata bind the exact SDK artifact set', async () => {
  const [packageJson, sdkRelease, openApiRelease, fixtureSet, protocolSet, protocolSetSource] = await Promise.all([
    readFile(new URL('../package.json', import.meta.url), 'utf8').then(JSON.parse),
    readFile(new URL('../release.json', import.meta.url), 'utf8').then(JSON.parse),
    readFile(new URL('../openapi/release.json', import.meta.url), 'utf8').then(JSON.parse),
    readFile(new URL('../fixtures/v1/fixture-set.json', import.meta.url), 'utf8').then(JSON.parse),
    readFile(new URL('../protocols/v1/contract-set.json', import.meta.url), 'utf8').then(JSON.parse),
    readFile(new URL('../protocols/v1/contract-set.json', import.meta.url), 'utf8'),
  ]);

  const { createHash } = await import('node:crypto');
  const protocolSetDigest = `sha256:${createHash('sha256').update(protocolSetSource).digest('hex')}`;

  const expected = {
    schemaVersion: 'wathba.sdk-release.v1',
    sdkPackage: packageJson.name,
    sdkVersion: packageJson.version,
    contractVersion: openApiRelease.contractVersion,
    openApiDigest: openApiRelease.digest,
    fixtureSetDigest: fixtureSet.aggregateDigest,
    protocolVersion: protocolSet.protocolVersion,
    protocolSetDigest,
    protocolAggregateDigest: protocolSet.aggregateDigest,
    generator: {
      name: 'openapi-typescript',
      version: packageJson.devDependencies['openapi-typescript'],
    },
  };
  assert.deepEqual(sdkRelease, expected);
  assert.deepEqual(wathbaSdkRelease, expected);
});
