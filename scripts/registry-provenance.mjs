const SLSA_PROVENANCE_PREDICATE = 'https://slsa.dev/provenance/v1';
const IN_TOTO_STATEMENT_TYPE = 'https://in-toto.io/Statement/v1';
const GITHUB_WORKFLOW_BUILD_TYPE =
  'https://slsa-framework.github.io/github-actions-buildtypes/workflow/v1';
const SIGSTORE_BUNDLE_MEDIA_TYPES = new Set([
  'application/vnd.dev.sigstore.bundle+json;version=0.2',
  'application/vnd.dev.sigstore.bundle.v0.3+json',
]);
const IN_TOTO_PAYLOAD_TYPE = 'application/vnd.in-toto+json';

export function readGitHubReleaseContext(environment, expected) {
  const workflowRefs = [
    {
      path: '.github/workflows/bootstrap-first-publish.yml',
      ref: 'refs/heads/main',
    },
    {
      path: '.github/workflows/release.yml',
      ref: `refs/tags/v${expected.version}`,
    },
  ];
  const currentWorkflow = workflowRefs.find(
    (candidate) =>
      candidate.ref === environment.GITHUB_REF &&
      `${expected.repositorySlug}/${candidate.path}@${candidate.ref}` ===
        environment.GITHUB_WORKFLOW_REF,
  );
  if (
    environment.GITHUB_REPOSITORY !== expected.repositorySlug ||
    typeof environment.GITHUB_SHA !== 'string' ||
    !/^[0-9a-f]{40}$/.test(environment.GITHUB_SHA) ||
    (expected.sourceCommit !== undefined &&
      !/^[0-9a-f]{40}$/.test(expected.sourceCommit)) ||
    currentWorkflow === undefined
  ) {
    throw new Error('local_sdk_release_github_context_invalid');
  }
  return {
    repository: `https://github.com/${environment.GITHUB_REPOSITORY}`,
    githubSha: environment.GITHUB_SHA,
    sourceCommit: expected.sourceCommit ?? environment.GITHUB_SHA,
    workflowRefs,
  };
}

export function readRegistryProvenanceDescriptor(view, spec) {
  const descriptor = view?.['dist.attestations'];
  const registryUri = descriptor?.url;
  const predicateType = descriptor?.provenance?.predicateType;
  let url;
  try {
    url = new URL(registryUri);
  } catch {
    throw new Error('published_sdk_registry_provenance_invalid');
  }
  const prefix = '/-/npm/v1/attestations/';
  let attestedSpec;
  try {
    attestedSpec = decodeURIComponent(url.pathname.slice(prefix.length));
  } catch {
    throw new Error('published_sdk_registry_provenance_invalid');
  }
  if (
    url.protocol !== 'https:' ||
    url.hostname !== 'registry.npmjs.org' ||
    url.port !== '' ||
    url.username !== '' ||
    url.password !== '' ||
    url.search !== '' ||
    url.hash !== '' ||
    !url.pathname.startsWith(prefix) ||
    attestedSpec !== spec ||
    predicateType !== SLSA_PROVENANCE_PREDICATE
  ) {
    throw new Error('published_sdk_registry_provenance_invalid');
  }
  return {
    registryUri: url.href,
    predicateType,
  };
}

export function readNpmAuditVerifiedProvenance(audit, expected) {
  if (
    !isRecord(audit) ||
    !Array.isArray(audit.invalid) ||
    audit.invalid.length !== 0 ||
    !Array.isArray(audit.missing) ||
    audit.missing.length !== 0 ||
    !Array.isArray(audit.verified)
  ) {
    throw new Error('published_sdk_registry_provenance_invalid');
  }

  const matches = audit.verified.filter(
    (entry) =>
      entry?.name === expected.name &&
      entry?.version === expected.version,
  );
  if (matches.length !== 1) {
    throw new Error('published_sdk_registry_provenance_invalid');
  }

  const verified = matches[0];
  const descriptor = readRegistryProvenanceDescriptor(
    { 'dist.attestations': verified.attestations },
    expected.spec,
  );
  if (
    verified.location !== expected.location ||
    verified.registry !== 'https://registry.npmjs.org/' ||
    descriptor.registryUri !== expected.registryUri ||
    !Array.isArray(verified.attestationBundles) ||
    verified.attestationBundles.length === 0
  ) {
    throw new Error('published_sdk_registry_provenance_invalid');
  }

  return {
    attestations: verified.attestationBundles,
  };
}

export function readRegistryProvenanceAttestation(document, expected) {
  const attestations = document?.attestations;
  if (!Array.isArray(attestations)) {
    throw new Error('published_sdk_registry_provenance_invalid');
  }
  const matches = attestations.filter(
    (attestation) => attestation?.predicateType === SLSA_PROVENANCE_PREDICATE,
  );
  if (matches.length !== 1) {
    throw new Error('published_sdk_registry_provenance_invalid');
  }

  const bundle = matches[0]?.bundle;
  const envelope = bundle?.dsseEnvelope;
  if (
    !SIGSTORE_BUNDLE_MEDIA_TYPES.has(bundle?.mediaType) ||
    envelope?.payloadType !== IN_TOTO_PAYLOAD_TYPE ||
    typeof envelope.payload !== 'string' ||
    !Array.isArray(envelope.signatures) ||
    envelope.signatures.length === 0 ||
    !Array.isArray(bundle?.verificationMaterial?.tlogEntries) ||
    bundle.verificationMaterial.tlogEntries.length === 0
  ) {
    throw new Error('published_sdk_registry_provenance_invalid');
  }

  let statement;
  try {
    const payload = Buffer.from(envelope.payload, 'base64');
    if (payload.toString('base64') !== envelope.payload) {
      throw new Error('non_canonical_base64');
    }
    statement = JSON.parse(payload.toString('utf8'));
  } catch {
    throw new Error('published_sdk_registry_provenance_invalid');
  }

  const subjects = (Array.isArray(statement?.subject) ? statement.subject : []).filter(
    (candidate) => {
      if (typeof candidate?.name !== 'string') return false;
      try {
        return (
          candidate.name.startsWith('pkg:npm/') &&
          decodeURIComponent(candidate.name.slice('pkg:npm/'.length)) === expected.spec &&
          candidate.digest?.sha512 === expected.candidateSha512
        );
      } catch {
        return false;
      }
    },
  );
  const subject = subjects.length === 1 ? subjects[0] : undefined;
  const workflow = statement?.predicate?.buildDefinition?.externalParameters?.workflow;
  const workflowPath = normalizeWorkflowPath(workflow?.path);
  const workflowIdentity = Array.isArray(expected.workflowRefs)
    ? expected.workflowRefs.find(
        (candidate) =>
          candidate?.path === workflowPath && candidate?.ref === workflow?.ref,
      )
    : undefined;
  const dependencies =
    statement?.predicate?.buildDefinition?.resolvedDependencies;
  const sourceDependencies = Array.isArray(dependencies) && workflowIdentity !== undefined
    ? dependencies.filter(
        (dependency) => {
          const sourceCommit = dependency?.digest?.gitCommit;
          return (
            typeof sourceCommit === 'string' &&
            /^[0-9a-f]{40}$/.test(sourceCommit) &&
            (expected.sourceCommit === undefined ||
              sourceCommit === expected.sourceCommit) &&
            dependency?.uri ===
              `git+${expected.repository}@${workflowIdentity.ref}`
          );
        },
      )
    : [];
  const sourceCommit =
    sourceDependencies.length === 1
      ? sourceDependencies[0].digest.gitCommit
      : undefined;
  if (
    statement?._type !== IN_TOTO_STATEMENT_TYPE ||
    statement?.predicateType !== SLSA_PROVENANCE_PREDICATE ||
    subject === undefined ||
    statement?.predicate?.buildDefinition?.buildType !== GITHUB_WORKFLOW_BUILD_TYPE ||
    workflow?.repository !== expected.repository ||
    workflowIdentity === undefined ||
    sourceCommit === undefined
  ) {
    throw new Error('published_sdk_registry_provenance_invalid');
  }

  return {
    predicateType: SLSA_PROVENANCE_PREDICATE,
    subjectName: subject.name,
    subjectSha512: subject.digest.sha512,
    sourceRepository: workflow.repository,
    sourceWorkflow: workflowIdentity.path,
    sourceRef: workflowIdentity.ref,
    sourceCommit,
  };
}

function normalizeWorkflowPath(value) {
  if (typeof value !== 'string') return undefined;
  return value.startsWith('/') ? value.slice(1) : value;
}

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
