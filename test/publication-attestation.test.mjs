import assert from 'node:assert/strict';
import test from 'node:test';

import {
  parseDeterministicJson,
  verifyExistingPublicationAttestation,
} from '../scripts/verify-publication-attestation-asset.mjs';

const attestation = {
  schemaVersion: 'wathba.sdk-publication-attestation.v1',
  package: '@wathba/sdk',
  version: '0.1.0',
  registryMetadata: {
    schemaVersion: 'wathba.npm-registry-metadata.v1',
    package: '@wathba/sdk',
    version: '0.1.0',
  },
  retrievedAt: '2026-07-15T08:00:00.000Z',
  githubSha: 'a'.repeat(40),
};

const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;

test('accepts byte-deterministic evidence that differs only by retrievedAt', () => {
  const expected = { ...attestation, retrievedAt: '2026-07-15T09:00:00.000Z' };

  assert.doesNotThrow(() =>
    verifyExistingPublicationAttestation(serialize(expected), serialize(attestation), {
      now: Date.parse('2026-07-15T10:00:00.000Z'),
    }),
  );
});

test('rejects a changed stable publication fact', () => {
  const existing = { ...attestation, githubSha: 'b'.repeat(40) };

  assert.throws(
    () =>
      verifyExistingPublicationAttestation(
        serialize(attestation),
        serialize(existing),
        { now: Date.parse('2026-07-15T10:00:00.000Z') },
      ),
    /existing_publication_attestation_mismatch/,
  );
});

test('rejects duplicate keys even when JSON.parse would keep the expected value', () => {
  const source = serialize(attestation);
  const duplicates = [
    source.replace(
      '  "package": "@wathba/sdk",\n',
      '  "package": "@wathba/sdk",\n  "package": "@wathba/sdk",\n',
    ),
    source.replace(
      '    "version": "0.1.0"\n',
      '    "version": "0.1.0",\n    "version": "0.1.0"\n',
    ),
  ];

  for (const duplicate of duplicates) {
    assert.equal(JSON.parse(duplicate).package, '@wathba/sdk');
    assert.throws(
      () =>
        verifyExistingPublicationAttestation(source, duplicate, {
          now: Date.parse('2026-07-15T10:00:00.000Z'),
        }),
      /publication_attestation_json_not_deterministic/,
    );
  }
});

test('rejects non-deterministic JSON and a future retrievedAt', () => {
  assert.throws(
    () => parseDeterministicJson(JSON.stringify(attestation)),
    /publication_attestation_json_not_deterministic/,
  );
  assert.throws(
    () =>
      verifyExistingPublicationAttestation(
        serialize(attestation),
        serialize(attestation),
        { now: Date.parse('2026-07-15T07:59:59.999Z') },
      ),
    /existing_publication_attestation_retrieved_at_invalid/,
  );
});
