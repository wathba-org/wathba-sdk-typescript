import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';

export function sha256(source) {
  return `sha256:${createHash('sha256').update(source).digest('hex')}`;
}

export async function readVerifiedOpenApi(directory = resolve('openapi')) {
  const releasePath = resolve(directory, 'release.json');
  const releaseSource = await readFile(releasePath, 'utf8');
  const release = parseObject(releaseSource, 'invalid_openapi_release');
  if (
    release.schemaVersion !== '1.0' ||
    release.mediaType !== 'application/vnd.oai.openapi+json;version=3.1' ||
    release.digestAlgorithm !== 'sha256' ||
    typeof release.contractVersion !== 'string' ||
    typeof release.artifact !== 'string' ||
    basename(release.artifact) !== release.artifact ||
    typeof release.digest !== 'string'
  ) {
    throw new Error('invalid_openapi_release');
  }

  const artifactPath = resolve(dirname(releasePath), release.artifact);
  const artifactSource = await readFile(artifactPath, 'utf8');
  if (sha256(artifactSource) !== release.digest) {
    throw new Error('openapi_release_digest_mismatch');
  }
  const document = parseObject(artifactSource, 'invalid_openapi_artifact');
  if (
    document.openapi !== '3.1.2' ||
    !isObject(document.info) ||
    document.info.version !== release.contractVersion
  ) {
    throw new Error('unsupported_openapi_contract');
  }

  return { release, releaseSource, document, artifactSource };
}

export async function readVerifiedFixtureSet(directory) {
  const fixtureSetPath = resolve(directory, 'fixture-set.json');
  const setSource = await readFile(fixtureSetPath, 'utf8');
  const fixtureSet = parseObject(setSource, 'invalid_fixture_set');
  if (
    fixtureSet.schemaVersion !== '1.0' ||
    typeof fixtureSet.contractVersion !== 'string' ||
    !isObject(fixtureSet.fixtures) ||
    typeof fixtureSet.aggregateDigest !== 'string'
  ) {
    throw new Error('invalid_fixture_set');
  }

  const fixtures = [];
  for (const name of Object.keys(fixtureSet.fixtures).sort()) {
    if (basename(name) !== name || !name.endsWith('.json')) {
      throw new Error('unsafe_fixture_name');
    }
    const expectedDigest = fixtureSet.fixtures[name];
    if (typeof expectedDigest !== 'string') throw new Error('invalid_fixture_digest');
    const source = await readFile(resolve(directory, name), 'utf8');
    if (sha256(source) !== expectedDigest) {
      throw new Error(`fixture_digest_mismatch:${name}`);
    }
    const document = parseObject(source, `invalid_fixture:${name}`);
    if (document.schemaVersion !== '1.0' || document.contractVersion !== fixtureSet.contractVersion) {
      throw new Error(`fixture_contract_version_mismatch:${name}`);
    }
    fixtures.push({ name, source, document });
  }

  const aggregateSource = fixtures.map(({ name, source }) => `${name}\0${source}`).join('');
  if (sha256(aggregateSource) !== fixtureSet.aggregateDigest) {
    throw new Error('fixture_set_aggregate_digest_mismatch');
  }

  return { fixtureSet, setSource, fixtures };
}

export async function readVerifiedProtocolSet(directory = resolve('protocols/v1')) {
  const setPath = resolve(directory, 'contract-set.json');
  const setSource = await readFile(setPath, 'utf8');
  const contractSet = parseObject(setSource, 'invalid_protocol_contract_set');
  if (
    contractSet.protocolVersion !== '1.0' ||
    contractSet.mediaType !== 'application/vnd.wathba.ai-integration-contracts.v1+json' ||
    !isObject(contractSet.files) ||
    Object.keys(contractSet.files).length === 0 ||
    typeof contractSet.aggregateDigest !== 'string'
  ) {
    throw new Error('invalid_protocol_contract_set');
  }

  const contracts = [];
  for (const name of Object.keys(contractSet.files).sort()) {
    const kind = name.endsWith('.schema.json')
      ? 'schema'
      : name.endsWith('.operations.json')
        ? 'operations'
        : null;
    if (basename(name) !== name || kind === null) {
      throw new Error('unsafe_protocol_contract_name');
    }
    const expectedDigest = contractSet.files[name];
    if (typeof expectedDigest !== 'string') {
      throw new Error(`invalid_protocol_contract_digest:${name}`);
    }
    const source = await readFile(resolve(directory, name), 'utf8');
    if (sha256(source) !== expectedDigest) {
      throw new Error(`protocol_contract_digest_mismatch:${name}`);
    }
    const document = parseJson(source, `invalid_protocol_contract:${name}`);
    if (kind === 'schema') {
      if (
        !isObject(document) ||
        document.$schema !== 'https://json-schema.org/draft/2020-12/schema'
      ) {
        throw new Error(`unsupported_protocol_contract_schema:${name}`);
      }
    } else {
      assertOperationMetadata(document, name);
    }
    contracts.push({ name, source, document, kind });
  }

  const aggregateSource = contracts.map(({ name, source }) => `${name}\0${source}`).join('');
  if (sha256(aggregateSource) !== contractSet.aggregateDigest) {
    throw new Error('protocol_contract_set_aggregate_digest_mismatch');
  }

  return {
    contractSet,
    setSource,
    setDigest: sha256(setSource),
    contracts,
  };
}

function assertOperationMetadata(document, name) {
  if (!Array.isArray(document) || document.length === 0) {
    throw new Error(`invalid_protocol_operations:${name}`);
  }
  const operationIds = new Set();
  for (const operation of document) {
    if (
      !isObject(operation) ||
      typeof operation.operationId !== 'string' ||
      !/^[A-Za-z][A-Za-z0-9]{2,159}$/.test(operation.operationId) ||
      operationIds.has(operation.operationId) ||
      !['DELETE', 'GET', 'PATCH', 'POST', 'PUT'].includes(operation.method) ||
      typeof operation.path !== 'string' ||
      !operation.path.startsWith('/v1/')
    ) {
      throw new Error(`invalid_protocol_operations:${name}`);
    }
    operationIds.add(operation.operationId);
  }
}

function parseObject(source, code) {
  const value = parseJson(source, code);
  if (!isObject(value)) throw new Error(code);
  return value;
}

function parseJson(source, code) {
  try {
    return JSON.parse(source);
  } catch {
    throw new Error(code);
  }
}

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
