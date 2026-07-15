import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function verifyExistingPublicationAttestation(
  expectedSource,
  existingSource,
  { now = Date.now() } = {},
) {
  const expected = parseDeterministicJson(expectedSource);
  const existing = parseDeterministicJson(existingSource);
  const retrievedAt =
    typeof existing.retrievedAt === 'string'
      ? Date.parse(existing.retrievedAt)
      : Number.NaN;
  if (
    !Number.isFinite(retrievedAt) ||
    new Date(retrievedAt).toISOString() !== existing.retrievedAt ||
    retrievedAt > now
  ) {
    throw new Error('existing_publication_attestation_retrieved_at_invalid');
  }

  expected.retrievedAt = existing.retrievedAt;
  if (serializeDeterministicJson(expected) !== existingSource) {
    throw new Error('existing_publication_attestation_mismatch');
  }
}

export function parseDeterministicJson(source) {
  if (typeof source !== 'string') {
    throw new Error('publication_attestation_json_invalid');
  }
  let value;
  try {
    value = JSON.parse(source);
  } catch {
    throw new Error('publication_attestation_json_invalid');
  }
  if (!isRecord(value)) {
    throw new Error('publication_attestation_json_invalid');
  }
  if (serializeDeterministicJson(value) !== source) {
    throw new Error('publication_attestation_json_not_deterministic');
  }
  return value;
}

function serializeDeterministicJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

if (
  typeof process.argv[1] === 'string' &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const [expectedPath, existingPath] = process.argv.slice(2);
  if (
    typeof expectedPath !== 'string' ||
    expectedPath.length === 0 ||
    typeof existingPath !== 'string' ||
    existingPath.length === 0
  ) {
    throw new Error('publication_attestation_paths_required');
  }
  verifyExistingPublicationAttestation(
    await readFile(expectedPath, 'utf8'),
    await readFile(existingPath, 'utf8'),
  );
}
