import assert from 'node:assert/strict';
import test from 'node:test';

import {
  readGitHubReleaseContext,
  readNpmAuditVerifiedProvenance,
  readRegistryProvenanceAttestation,
  readRegistryProvenanceDescriptor,
} from '../scripts/registry-provenance.mjs';

const spec = '@wathba/sdk@0.1.0';
const candidateSha512 = 'a'.repeat(128);
const githubSha = 'b'.repeat(40);
const repository = 'https://github.com/wathba-org/wathba-sdk-typescript';
const workflowPath = '.github/workflows/bootstrap-first-publish.yml';
const registryUri =
  'https://registry.npmjs.org/-/npm/v1/attestations/@wathba%2fsdk@0.1.0';

test('accepts only the two exact GitHub workflow and ref contexts', () => {
  const expected = {
    repositorySlug: 'wathba-org/wathba-sdk-typescript',
    version: '0.1.0',
  };
  for (const [path, ref] of [
    ['.github/workflows/bootstrap-first-publish.yml', 'refs/heads/main'],
    ['.github/workflows/release.yml', 'refs/tags/v0.1.0'],
  ]) {
    assert.deepEqual(
      readGitHubReleaseContext(
        {
          GITHUB_REPOSITORY: expected.repositorySlug,
          GITHUB_SHA: githubSha,
          GITHUB_REF: ref,
          GITHUB_WORKFLOW_REF:
            `${expected.repositorySlug}/${path}@${ref}`,
        },
        expected,
      ),
      {
        repository,
        githubSha,
        sourceCommit: githubSha,
        workflowRefs: [
          {
            path: '.github/workflows/bootstrap-first-publish.yml',
            ref: 'refs/heads/main',
          },
          {
            path: '.github/workflows/release.yml',
            ref: 'refs/tags/v0.1.0',
          },
        ],
      },
    );
  }

  for (const environment of [
    {
      GITHUB_REPOSITORY: expected.repositorySlug,
      GITHUB_SHA: githubSha,
      GITHUB_REF: 'refs/heads/feature',
      GITHUB_WORKFLOW_REF:
        `${expected.repositorySlug}/.github/workflows/release.yml@refs/heads/feature`,
    },
    {
      GITHUB_REPOSITORY: expected.repositorySlug,
      GITHUB_SHA: githubSha,
      GITHUB_REF: 'refs/heads/main',
      GITHUB_WORKFLOW_REF:
        `${expected.repositorySlug}/.github/workflows/release.yml@refs/heads/main`,
    },
    {
      GITHUB_REPOSITORY: 'example/other',
      GITHUB_SHA: githubSha,
      GITHUB_REF: 'refs/heads/main',
      GITHUB_WORKFLOW_REF:
        'example/other/.github/workflows/bootstrap-first-publish.yml@refs/heads/main',
    },
    {
      GITHUB_REPOSITORY: expected.repositorySlug,
      GITHUB_SHA: 'not-a-commit',
      GITHUB_REF: 'refs/heads/main',
      GITHUB_WORKFLOW_REF:
        `${expected.repositorySlug}/.github/workflows/bootstrap-first-publish.yml@refs/heads/main`,
    },
  ]) {
    assert.throws(
      () => readGitHubReleaseContext(environment, expected),
      /local_sdk_release_github_context_invalid/,
    );
  }
  assert.throws(
    () =>
      readGitHubReleaseContext(
        {
          GITHUB_REPOSITORY: expected.repositorySlug,
          GITHUB_SHA: githubSha,
          GITHUB_REF: 'refs/heads/main',
          GITHUB_WORKFLOW_REF:
            `${expected.repositorySlug}/${workflowPath}@refs/heads/main`,
        },
        { ...expected, sourceCommit: 'not-a-commit' },
      ),
    /local_sdk_release_github_context_invalid/,
  );
});

test('recovery binds verification to the signed source after main advances', () => {
  const currentMainCommit = 'c'.repeat(40);
  const expected = {
    repositorySlug: 'wathba-org/wathba-sdk-typescript',
    version: '0.1.0',
    sourceCommit: githubSha,
  };
  const context = readGitHubReleaseContext(
    {
      GITHUB_REPOSITORY: expected.repositorySlug,
      GITHUB_SHA: currentMainCommit,
      GITHUB_REF: 'refs/heads/main',
      GITHUB_WORKFLOW_REF:
        `${expected.repositorySlug}/${workflowPath}@refs/heads/main`,
    },
    expected,
  );
  assert.equal(context.githubSha, currentMainCommit);
  assert.equal(context.sourceCommit, githubSha);

  const derivationExpected = expectedProvenance();
  delete derivationExpected.sourceCommit;
  assert.equal(
    readRegistryProvenanceAttestation(
      provenanceDocument(),
      derivationExpected,
    ).sourceCommit,
    githubSha,
  );
});

test('requires the exact npm SLSA provenance descriptor for the package version', () => {
  assert.deepEqual(
    readRegistryProvenanceDescriptor(
      {
        'dist.attestations': {
          url: registryUri,
          provenance: { predicateType: 'https://slsa.dev/provenance/v1' },
        },
      },
      spec,
    ),
    {
      registryUri,
      predicateType: 'https://slsa.dev/provenance/v1',
    },
  );

  for (const descriptor of [
    undefined,
    {
      url: 'https://example.invalid/-/npm/v1/attestations/@wathba%2fsdk@0.1.0',
      provenance: { predicateType: 'https://slsa.dev/provenance/v1' },
    },
    {
      url: 'https://registry.npmjs.org/-/npm/v1/attestations/@wathba%2fsdk@0.1.1',
      provenance: { predicateType: 'https://slsa.dev/provenance/v1' },
    },
    {
      url: 'https://registry.npmjs.org/-/npm/v1/attestations/@wathba%2fsdk@0.1.0',
      provenance: { predicateType: 'https://example.invalid/provenance' },
    },
  ]) {
    assert.throws(
      () =>
        readRegistryProvenanceDescriptor(
          { 'dist.attestations': descriptor },
          spec,
        ),
      /published_sdk_registry_provenance_invalid/,
    );
  }
});

test('selects only the exact package entry from successful npm cryptographic audit output', () => {
  const audit = npmAuditDocument();
  assert.deepEqual(
    readNpmAuditVerifiedProvenance(audit, expectedAudit()),
    provenanceDocument(),
  );

  for (const invalid of [
    { ...audit, invalid: [{ name: '@wathba/sdk', version: '0.1.0' }] },
    { ...audit, missing: [{ name: '@wathba/sdk', version: '0.1.0' }] },
    { ...audit, verified: [] },
    {
      ...audit,
      verified: [
        audit.verified[0],
        structuredClone(audit.verified[0]),
      ],
    },
    {
      ...audit,
      verified: [{ ...audit.verified[0], version: '0.1.1' }],
    },
    {
      ...audit,
      verified: [
        {
          ...audit.verified[0],
          registry: 'https://example.invalid/',
        },
      ],
    },
    {
      ...audit,
      verified: [
        { ...audit.verified[0], attestationBundles: [] },
      ],
    },
  ]) {
    assert.throws(
      () => readNpmAuditVerifiedProvenance(invalid, expectedAudit()),
      /published_sdk_registry_provenance_invalid/,
    );
  }
});

test('parses identity only after npm audit has cryptographically verified the bundle', () => {
  // This synthetic signature exercises the identity/content parser only. The
  // release script never calls it until `npm audit signatures` exits cleanly.
  const document = provenanceDocument();
  assert.deepEqual(
    readRegistryProvenanceAttestation(document, expectedProvenance()),
    {
      predicateType: 'https://slsa.dev/provenance/v1',
      subjectName: 'pkg:npm/%40wathba/sdk@0.1.0',
      subjectSha512: candidateSha512,
      sourceRepository: repository,
      sourceWorkflow: workflowPath,
      sourceRef: 'refs/heads/main',
      sourceCommit: githubSha,
    },
  );
});

test('binds the normalized workflow path to its one exact allowed ref', () => {
  const leadingSlash = provenanceDocument();
  const value = statement();
  value.predicate.buildDefinition.externalParameters.workflow.path =
    `/${workflowPath}`;
  leadingSlash.attestations[0].bundle.dsseEnvelope.payload =
    encodeStatement(value);
  assert.equal(
    readRegistryProvenanceAttestation(
      leadingSlash,
      expectedProvenance(),
    ).sourceWorkflow,
    workflowPath,
  );

  const release = provenanceDocument();
  const releaseStatement = statement();
  releaseStatement.predicate.buildDefinition.externalParameters.workflow = {
    ...releaseStatement.predicate.buildDefinition.externalParameters.workflow,
    path: '.github/workflows/release.yml',
    ref: 'refs/tags/v0.1.0',
  };
  releaseStatement.predicate.buildDefinition.resolvedDependencies[0].uri =
    `git+${repository}@refs/tags/v0.1.0`;
  release.attestations[0].bundle.dsseEnvelope.payload =
    encodeStatement(releaseStatement);
  assert.deepEqual(
    readRegistryProvenanceAttestation(release, expectedProvenance()),
    {
      predicateType: 'https://slsa.dev/provenance/v1',
      subjectName: 'pkg:npm/%40wathba/sdk@0.1.0',
      subjectSha512: candidateSha512,
      sourceRepository: repository,
      sourceWorkflow: '.github/workflows/release.yml',
      sourceRef: 'refs/tags/v0.1.0',
      sourceCommit: githubSha,
    },
  );

  for (const wrongIdentity of [
    { path: workflowPath, ref: 'refs/heads/feature' },
    {
      path: '.github/workflows/release.yml',
      ref: 'refs/heads/main',
    },
  ]) {
    const document = provenanceDocument();
    const wrong = statement();
    wrong.predicate.buildDefinition.externalParameters.workflow = {
      ...wrong.predicate.buildDefinition.externalParameters.workflow,
      ...wrongIdentity,
    };
    wrong.predicate.buildDefinition.resolvedDependencies[0].uri =
      `git+${repository}@${wrongIdentity.ref}`;
    document.attestations[0].bundle.dsseEnvelope.payload =
      encodeStatement(wrong);
    assert.throws(
      () =>
        readRegistryProvenanceAttestation(
          document,
          expectedProvenance(),
        ),
      /published_sdk_registry_provenance_invalid/,
    );
  }
});

test('rejects missing, wrong-digest, or wrong-source provenance', () => {
  assert.throws(
    () => readRegistryProvenanceAttestation({}, expectedProvenance()),
    /published_sdk_registry_provenance_invalid/,
  );

  const wrongDigest = provenanceDocument();
  wrongDigest.attestations[0].bundle.dsseEnvelope.payload = encodeStatement({
    ...statement(),
    subject: [
      {
        name: 'pkg:npm/%40wathba/sdk@0.1.0',
        digest: { sha512: 'c'.repeat(128) },
      },
    ],
  });
  assert.throws(
    () =>
      readRegistryProvenanceAttestation(wrongDigest, expectedProvenance()),
    /published_sdk_registry_provenance_invalid/,
  );

  const wrongSource = provenanceDocument();
  const value = statement();
  value.predicate.buildDefinition.externalParameters.workflow.repository =
    'https://github.com/example/other';
  wrongSource.attestations[0].bundle.dsseEnvelope.payload = encodeStatement(value);
  assert.throws(
    () =>
      readRegistryProvenanceAttestation(wrongSource, expectedProvenance()),
    /published_sdk_registry_provenance_invalid/,
  );

  const wrongCommit = provenanceDocument();
  const wrongCommitStatement = statement();
  wrongCommitStatement.predicate.buildDefinition.resolvedDependencies[0]
    .digest.gitCommit = 'd'.repeat(40);
  wrongCommit.attestations[0].bundle.dsseEnvelope.payload =
    encodeStatement(wrongCommitStatement);
  assert.throws(
    () =>
      readRegistryProvenanceAttestation(
        wrongCommit,
        expectedProvenance(),
      ),
    /published_sdk_registry_provenance_invalid/,
  );
});

function expectedProvenance() {
  return {
    spec,
    candidateSha512,
    repository,
    workflowRefs: [
      { path: workflowPath, ref: 'refs/heads/main' },
      {
        path: '.github/workflows/release.yml',
        ref: 'refs/tags/v0.1.0',
      },
    ],
    sourceCommit: githubSha,
  };
}

function expectedAudit() {
  return {
    name: '@wathba/sdk',
    version: '0.1.0',
    spec,
    location: 'node_modules/@wathba/sdk',
    registryUri,
  };
}

function npmAuditDocument() {
  return {
    invalid: [],
    missing: [],
    verified: [
      {
        name: '@wathba/sdk',
        version: '0.1.0',
        location: 'node_modules/@wathba/sdk',
        registry: 'https://registry.npmjs.org/',
        attestations: {
          url: registryUri,
          provenance: {
            predicateType: 'https://slsa.dev/provenance/v1',
          },
        },
        attestationBundles: provenanceDocument().attestations,
      },
    ],
  };
}

function provenanceDocument() {
  return {
    attestations: [
      {
        predicateType: 'https://slsa.dev/provenance/v1',
        bundle: {
          mediaType: 'application/vnd.dev.sigstore.bundle.v0.3+json',
          verificationMaterial: { tlogEntries: [{}] },
          dsseEnvelope: {
            payloadType: 'application/vnd.in-toto+json',
            payload: encodeStatement(statement()),
            signatures: [{ sig: 'test-signature' }],
          },
        },
      },
    ],
  };
}

function statement() {
  return {
    _type: 'https://in-toto.io/Statement/v1',
    subject: [
      {
        name: 'pkg:npm/%40wathba/sdk@0.1.0',
        digest: { sha512: candidateSha512 },
      },
    ],
    predicateType: 'https://slsa.dev/provenance/v1',
    predicate: {
      buildDefinition: {
        buildType:
          'https://slsa-framework.github.io/github-actions-buildtypes/workflow/v1',
        externalParameters: {
          workflow: {
            ref: 'refs/heads/main',
            repository,
            path: workflowPath,
          },
        },
        resolvedDependencies: [
          {
            uri: `git+${repository}@refs/heads/main`,
            digest: { gitCommit: githubSha },
          },
        ],
      },
    },
  };
}

function encodeStatement(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64');
}
