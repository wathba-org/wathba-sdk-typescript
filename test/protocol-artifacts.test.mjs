import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import test from 'node:test';
import { readVerifiedProtocolSet } from '../scripts/lib/contract-artifacts.mjs';

test('verified protocol sets include strict operation metadata artifacts', async (t) => {
  const directory = await mkdtemp(resolve(tmpdir(), 'wathba-protocols-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const files = {
    'action-ref.schema.json': `${JSON.stringify({
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      type: 'object',
    })}\n`,
    'provider-readiness-action.operations.json': `${JSON.stringify([
      {
        operationId: 'requestProviderReadinessAction',
        method: 'POST',
        path: '/v1/platform/projects/{projectId}/provider-readiness-actions',
      },
    ])}\n`,
  };
  await writeProtocolSet(directory, files);

  const verified = await readVerifiedProtocolSet(directory);
  assert.deepEqual(
    verified.contracts.map(({ name, kind }) => [name, kind]),
    [
      ['action-ref.schema.json', 'schema'],
      ['provider-readiness-action.operations.json', 'operations'],
    ],
  );
});

test('operation metadata rejects duplicate operation identities', async (t) => {
  const directory = await mkdtemp(resolve(tmpdir(), 'wathba-protocols-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const operation = {
    operationId: 'requestProviderReadinessAction',
    method: 'POST',
    path: '/v1/platform/provider-readiness-actions',
  };
  await writeProtocolSet(directory, {
    'provider-readiness-action.operations.json': `${JSON.stringify([
      operation,
      operation,
    ])}\n`,
  });

  await assert.rejects(
    readVerifiedProtocolSet(directory),
    /invalid_protocol_operations/,
  );
});

async function writeProtocolSet(directory, files) {
  for (const [name, source] of Object.entries(files)) {
    await writeFile(resolve(directory, name), source, 'utf8');
  }
  const entries = Object.entries(files).sort(([left], [right]) =>
    left.localeCompare(right),
  );
  const set = {
    protocolVersion: '1.0',
    mediaType: 'application/vnd.wathba.ai-integration-contracts.v1+json',
    files: Object.fromEntries(
      entries.map(([name, source]) => [name, sha256(source)]),
    ),
    aggregateDigest: sha256(
      entries.map(([name, source]) => `${name}\0${source}`).join(''),
    ),
  };
  await writeFile(
    resolve(directory, 'contract-set.json'),
    `${JSON.stringify(set, null, 2)}\n`,
    'utf8',
  );
}

function sha256(source) {
  return `sha256:${createHash('sha256').update(source).digest('hex')}`;
}
