import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { promisify } from 'node:util';
import {
  createNpmRegistryMetadata,
  npmRegistryMetadataDigest,
} from './npm-registry-metadata.mjs';
import { readPublishedPackageProvenance } from './published-package-provenance.mjs';
import { readGitHubReleaseContext } from './registry-provenance.mjs';

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
  sourceCommit,
  workflowRefs,
} = readGitHubReleaseContext(process.env, {
  repositorySlug: sourceRepositorySlug,
  version: manifest.version,
  sourceCommit: process.env.WATHBA_SDK_EXPECTED_SOURCE_COMMIT,
});

const spec = `${manifest.name}@${manifest.version}`;
const { distribution, npmProvenance } = await readPublishedPackageProvenance({
  name: manifest.name,
  version: manifest.version,
  repository: sourceRepository,
  workflowRefs,
  sourceCommit,
});
const candidateDigest = createHash('sha512')
  .update(await readFile(candidatePath))
  .digest();
const candidateIntegrity = `sha512-${candidateDigest.toString('base64')}`;
if (candidateIntegrity !== distribution.integrity) {
  throw new Error('published_sdk_candidate_integrity_mismatch');
}
if (npmProvenance.subjectSha512 !== candidateDigest.toString('hex')) {
  throw new Error('published_sdk_candidate_integrity_mismatch');
}

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
  const registryMetadata = createNpmRegistryMetadata({
    package: manifest.name,
    version: manifest.version,
    registryUri: distribution.tarball,
    distIntegrity: distribution.integrity,
  });
  const registryMetadataDigest = npmRegistryMetadataDigest(registryMetadata);
  const attestation = {
    schemaVersion: 'wathba.sdk-publication-attestation.v1',
    package: manifest.name,
    version: manifest.version,
    registryUri: distribution.tarball,
    distIntegrity: distribution.integrity,
    registryMetadata,
    registryMetadataDigest,
    npmProvenance,
    retrievedAt: new Date().toISOString(),
    releaseMetadataDigest,
    openApiDigest: release.openApiDigest,
    contractDigest: release.openApiDigest,
    protocolAggregateDigest: release.protocolAggregateDigest,
    fixtureSetDigest: release.fixtureSetDigest,
    githubRepository: sourceRepositorySlug,
    githubSha: sourceCommit,
  };
  await writeFile('publication-attestation.json', `${JSON.stringify(attestation, null, 2)}\n`, { mode: 0o644 });
} finally {
  await rm(directory, { recursive: true, force: true });
}
