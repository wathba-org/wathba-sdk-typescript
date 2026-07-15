import { execFile } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

import { readRegistryDistribution } from './registry-distribution.mjs';
import {
  readNpmAuditVerifiedProvenance,
  readRegistryProvenanceAttestation,
  readRegistryProvenanceDescriptor,
} from './registry-provenance.mjs';

const execute = promisify(execFile);

export async function readPublishedPackageProvenance(expected) {
  const spec = `${expected.name}@${expected.version}`;
  const view = await retry(async () => {
    const { stdout } = await execute(
      'npm',
      [
        'view',
        spec,
        'name',
        'version',
        'dist.integrity',
        'dist.tarball',
        'dist.attestations',
        '--json',
      ],
      { maxBuffer: 1 << 20 },
    );
    const candidate = JSON.parse(stdout);
    readRegistryProvenanceDescriptor(candidate, spec);
    return candidate;
  });
  if (view.name !== expected.name || view.version !== expected.version) {
    throw new Error('published_sdk_registry_metadata_invalid');
  }

  const distribution = readRegistryDistribution(view);
  const candidateSha512 = integritySha512Hex(distribution.integrity);
  const provenanceDescriptor = readRegistryProvenanceDescriptor(view, spec);
  const provenanceDocument = await retry(() =>
    auditPublishedPackageSignatures({
      name: expected.name,
      version: expected.version,
      spec,
      location: `node_modules/${expected.name}`,
      registryUri: provenanceDescriptor.registryUri,
    }),
  );
  const npmProvenance = {
    cryptographicallyVerified: true,
    verificationMethod:
      'npm audit signatures --json --include-attestations',
    registryUri: provenanceDescriptor.registryUri,
    ...readRegistryProvenanceAttestation(provenanceDocument, {
      spec,
      candidateSha512,
      repository: expected.repository,
      workflowRefs: expected.workflowRefs,
      sourceCommit: expected.sourceCommit,
    }),
  };

  return { distribution, npmProvenance };
}

export function integritySha512Hex(integrity) {
  if (typeof integrity !== 'string' || !integrity.startsWith('sha512-')) {
    throw new Error('published_sdk_registry_distribution_invalid');
  }
  const digest = Buffer.from(integrity.slice('sha512-'.length), 'base64');
  if (
    digest.length !== 64 ||
    `sha512-${digest.toString('base64')}` !== integrity
  ) {
    throw new Error('published_sdk_registry_distribution_invalid');
  }
  return digest.toString('hex');
}

async function auditPublishedPackageSignatures(expected) {
  const directory = await mkdtemp(join(tmpdir(), 'wathba-sdk-signature-audit-'));
  try {
    await writeFile(
      join(directory, 'package.json'),
      `${JSON.stringify({ private: true })}\n`,
      { mode: 0o644 },
    );
    await execute(
      'npm',
      [
        'install',
        '--ignore-scripts',
        '--save-exact',
        '--no-audit',
        '--no-fund',
        '--registry=https://registry.npmjs.org/',
        expected.spec,
      ],
      { cwd: directory, maxBuffer: 8 << 20 },
    );
    const { stdout } = await execute(
      'npm',
      ['audit', 'signatures', '--json', '--include-attestations'],
      { cwd: directory, maxBuffer: 64 << 20 },
    );
    return readNpmAuditVerifiedProvenance(JSON.parse(stdout), expected);
  } catch {
    throw new Error('published_sdk_registry_provenance_verification_failed');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

async function retry(operation) {
  let lastError;
  for (let attempt = 0; attempt < 12; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < 11) {
        await new Promise((resolve) => setTimeout(resolve, 5_000));
      }
    }
  }
  throw lastError;
}
