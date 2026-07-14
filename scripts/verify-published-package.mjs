import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { promisify } from 'node:util';
import { readRegistryDistribution } from './registry-distribution.mjs';
import {
  readGitHubReleaseContext,
  readNpmAuditVerifiedProvenance,
  readRegistryProvenanceAttestation,
  readRegistryProvenanceDescriptor,
} from './registry-provenance.mjs';

const execute = promisify(execFile);
const candidatePath = process.argv[2];
if (typeof candidatePath !== 'string' || candidatePath.length === 0) {
  throw new Error('local_sdk_release_candidate_required');
}
const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const releaseSource = await readFile(new URL('../release.json', import.meta.url), 'utf8');
const release = JSON.parse(releaseSource);
if (
  release.schemaVersion !== 'wathba.sdk-release.v1' ||
  release.sdkPackage !== manifest.name ||
  release.sdkVersion !== manifest.version
) {
  throw new Error('local_sdk_release_metadata_invalid');
}

const sourceRepositorySlug = 'wathba-org/wathba-sdk-typescript';
const {
  repository: sourceRepository,
  githubSha,
  workflowRefs,
} = readGitHubReleaseContext(process.env, {
  repositorySlug: sourceRepositorySlug,
  version: manifest.version,
});

const spec = `${manifest.name}@${manifest.version}`;
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
if (view.name !== manifest.name || view.version !== manifest.version) {
  throw new Error('published_sdk_registry_metadata_invalid');
}
const distribution = readRegistryDistribution(view);
const candidateDigest = createHash('sha512')
  .update(await readFile(candidatePath))
  .digest();
const candidateIntegrity = `sha512-${candidateDigest.toString('base64')}`;
if (candidateIntegrity !== distribution.integrity) {
  throw new Error('published_sdk_candidate_integrity_mismatch');
}
const provenanceDescriptor = readRegistryProvenanceDescriptor(view, spec);
const provenanceDocument = await retry(() =>
  auditPublishedPackageSignatures({
    name: manifest.name,
    version: manifest.version,
    spec,
    location: `node_modules/${manifest.name}`,
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
    candidateSha512: candidateDigest.toString('hex'),
    repository: sourceRepository,
    workflowRefs,
    githubSha,
  }),
};

const directory = await mkdtemp(join(tmpdir(), 'wathba-sdk-publication-'));
try {
  const { stdout } = await execute(
    'npm',
    ['pack', spec, '--json', '--ignore-scripts', '--pack-destination', directory],
    { maxBuffer: 8 << 20 },
  );
  const packed = JSON.parse(stdout)[0];
  const requiredFiles = new Set([
    'package/dist/esm/generated/release.js',
    'package/release.json',
    'package/openapi/release.json',
    'package/protocols/v1/contract-set.json',
    'package/fixtures/v1/fixture-set.json',
  ]);
  if (
    packed?.integrity !== distribution.integrity ||
    packed?.name !== manifest.name ||
    packed?.version !== manifest.version ||
    !Array.isArray(packed.files) ||
    [...requiredFiles].some((name) => !packed.files.some((file) => file.path === name.replace(/^package\//, '')))
  ) {
    throw new Error('published_sdk_package_surface_invalid');
  }
  if (
    typeof packed.filename !== 'string' ||
    basename(packed.filename) !== packed.filename
  ) {
    throw new Error('published_sdk_package_filename_invalid');
  }
  await execute('tar', ['-xzf', join(directory, packed.filename), '-C', directory]);
  const publishedReleaseSource = await readFile(
    join(directory, 'package', 'release.json'),
    'utf8',
  );
  if (publishedReleaseSource !== releaseSource) {
    throw new Error('published_sdk_release_metadata_mismatch');
  }
  const releaseMetadataDigest = `sha256:${createHash('sha256')
    .update(releaseSource)
    .digest('hex')}`;
  const registryMetadata = {
    package: manifest.name,
    version: manifest.version,
    distIntegrity: distribution.integrity,
    registryUri: distribution.tarball,
    npmProvenance,
  };
  const registryMetadataDigest = `sha256:${createHash('sha256')
    .update(JSON.stringify(registryMetadata))
    .digest('hex')}`;
  const attestation = {
    schemaVersion: 'wathba.sdk-publication-attestation.v1',
    package: manifest.name,
    version: manifest.version,
    registryUri: distribution.tarball,
    distIntegrity: distribution.integrity,
    npmProvenance,
    registryMetadataDigest,
    retrievedAt: new Date().toISOString(),
    releaseMetadataDigest,
    openApiDigest: release.openApiDigest,
    contractDigest: release.openApiDigest,
    protocolAggregateDigest: release.protocolAggregateDigest,
    fixtureSetDigest: release.fixtureSetDigest,
    githubRepository: sourceRepositorySlug,
    githubSha,
  };
  await writeFile('publication-attestation.json', `${JSON.stringify(attestation, null, 2)}\n`, { mode: 0o644 });
} finally {
  await rm(directory, { recursive: true, force: true });
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
      [
        'audit',
        'signatures',
        '--json',
        '--include-attestations',
      ],
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
