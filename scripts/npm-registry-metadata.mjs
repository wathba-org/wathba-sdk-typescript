import { createHash } from 'node:crypto';

const SDK_PACKAGE = '@wathba/sdk';
const SCHEMA_VERSION = 'wathba.npm-registry-metadata.v1';
const VERSION_PATTERN =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?$/;
const SHA512_INTEGRITY_PATTERN = /^sha512-[A-Za-z0-9+/]{86}==$/;
const METADATA_KEYS = [
  'schemaVersion',
  'package',
  'version',
  'registryUri',
  'distIntegrity',
];

export function createNpmRegistryMetadata(input) {
  if (!isRecord(input) || hasUnexpectedKeys(input, [
    'package',
    'version',
    'registryUri',
    'distIntegrity',
  ])) {
    throw new Error('published_sdk_registry_metadata_invalid');
  }
  const {
    package: packageName,
    version,
    registryUri,
    distIntegrity,
  } = input;
  if (
    packageName !== SDK_PACKAGE ||
    typeof version !== 'string' ||
    !VERSION_PATTERN.test(version) ||
    registryUri !==
      `https://registry.npmjs.org/@wathba/sdk/-/sdk-${version}.tgz` ||
    typeof distIntegrity !== 'string' ||
    !SHA512_INTEGRITY_PATTERN.test(distIntegrity)
  ) {
    throw new Error('published_sdk_registry_metadata_invalid');
  }

  return {
    schemaVersion: SCHEMA_VERSION,
    package: packageName,
    version,
    registryUri,
    distIntegrity,
  };
}

export function canonicalJson(value) {
  if (
    value === null ||
    typeof value === 'boolean' ||
    typeof value === 'string'
  ) {
    return JSON.stringify(value);
  }
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new Error('canonical_json_non_finite_number');
    }
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(',')}]`;
  }
  if (typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
      .join(',')}}`;
  }
  throw new Error('canonical_json_unsupported_value');
}

export function npmRegistryMetadataDigest(metadata) {
  if (
    !isRecord(metadata) ||
    hasUnexpectedKeys(metadata, METADATA_KEYS) ||
    metadata.schemaVersion !== SCHEMA_VERSION
  ) {
    throw new Error('published_sdk_registry_metadata_invalid');
  }
  const strictMetadata = createNpmRegistryMetadata({
    package: metadata.package,
    version: metadata.version,
    registryUri: metadata.registryUri,
    distIntegrity: metadata.distIntegrity,
  });
  return `sha256:${createHash('sha256')
    .update(canonicalJson(strictMetadata))
    .digest('hex')}`;
}

function hasUnexpectedKeys(value, expected) {
  const actual = Object.keys(value).sort();
  const accepted = [...expected].sort();
  return (
    actual.length !== accepted.length ||
    actual.some((key, index) => key !== accepted[index])
  );
}

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
