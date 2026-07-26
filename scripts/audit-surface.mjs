import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  readVerifiedFixtureSet,
  readVerifiedOpenApi,
  readVerifiedProtocolSet,
} from './lib/contract-artifacts.mjs';

const packageJson = JSON.parse(readFileSync(resolve('package.json'), 'utf8'));
assertPackageMetadata(packageJson);

const [{ release }, { fixtureSet }] = await Promise.all([
  readVerifiedOpenApi(),
  readVerifiedFixtureSet(resolve('fixtures/v1')),
  readVerifiedProtocolSet(),
]);
if (release.contractVersion !== fixtureSet.contractVersion) {
  throw new Error('package_contract_version_mismatch');
}

const providerSurface = /(^|[^a-z0-9])(authenta|authentica|torod|moyasar)([^a-z0-9]|$)/i;
const browserCredentialSurface = /\b(localStorage|sessionStorage|document\.cookie|navigator\.credentials)\b/;
const violations = [];
for (const root of ['dist', 'release.json', 'openapi', 'protocols', 'fixtures', 'README.md', 'recipes', 'package.json']) {
  for (const path of files(resolve(root))) {
    const source = readFileSync(path, 'utf8');
    if (providerSurface.test(source)) violations.push(`provider:${path}`);
    if (browserCredentialSurface.test(source)) violations.push(`browser-credential:${path}`);
    if (path.endsWith('.map')) {
      const sourceMap = JSON.parse(source);
      if ('sourcesContent' in sourceMap) violations.push(`embedded-source:${path}`);
      if (sourceMap.sources?.some((item) => item.startsWith('/'))) {
        violations.push(`absolute-source-path:${path}`);
      }
    }
  }
}
if (violations.length > 0) {
  throw new Error(`forbidden_package_surface:${violations.join(',')}`);
}

function assertPackageMetadata(manifest) {
  if (manifest.name !== '@wathba-cli/sdk' || manifest.license !== 'MIT') {
    throw new Error('invalid_package_identity');
  }
  if (
    manifest.repository?.type !== 'git' ||
    manifest.repository?.url !==
      'git+https://github.com/wathba-org/wathba-sdk-typescript.git' ||
    manifest.homepage !==
      'https://github.com/wathba-org/wathba-sdk-typescript#readme' ||
    manifest.bugs?.url !==
      'https://github.com/wathba-org/wathba-sdk-typescript/issues'
  ) {
    throw new Error('invalid_package_repository_identity');
  }
  if (manifest.engines?.node !== '>=24') throw new Error('invalid_node_engine');
  if (manifest.browser !== './dist/esm/browser-unsupported.js') {
    throw new Error('legacy_browser_entry_not_rejected');
  }
  if (
    JSON.stringify(manifest.sideEffects) !==
    JSON.stringify(['./dist/esm/browser-unsupported.js', './dist/cjs/browser-unsupported.js'])
  ) {
    throw new Error('browser_rejection_marked_side_effect_free');
  }
  for (const field of ['dependencies', 'optionalDependencies', 'peerDependencies']) {
    if (manifest[field] !== undefined && Object.keys(manifest[field]).length > 0) {
      throw new Error(`production_dependencies_forbidden:${field}`);
    }
  }
  const expectedDevelopmentDependencies = {
    '@types/node': '24.3.0',
    'openapi-typescript': '7.13.0',
    typescript: '5.9.3',
  };
  if (JSON.stringify(manifest.devDependencies) !== JSON.stringify(expectedDevelopmentDependencies)) {
    throw new Error('generator_dependency_pin_drift');
  }
  if (
    manifest.publishConfig?.access !== 'public' ||
    manifest.publishConfig?.provenance !== true
  ) {
    throw new Error('npm_provenance_not_required');
  }
  if (manifest.exports?.['./webhooks'] !== undefined) {
    throw new Error('replay_unsafe_webhook_surface_forbidden');
  }
  for (const name of ['.', './raw']) {
    const exported = manifest.exports?.[name];
    if (
      exported?.browser?.types !== './dist/esm/browser-unsupported.d.ts' ||
      exported?.browser?.default !== './dist/esm/browser-unsupported.js'
    ) {
      throw new Error(`browser_export_not_rejected:${name}`);
    }
  }
  for (const requiredFile of [
    'dist',
    'release.json',
    'fixtures',
    'openapi/release.json',
    'openapi/wathba-public.openapi.json',
    'protocols',
    'recipes',
    'README.md',
    'LICENSE',
  ]) {
    if (!manifest.files?.includes(requiredFile)) {
      throw new Error(`package_file_missing:${requiredFile}`);
    }
  }
}

function files(path) {
  const stat = statSync(path);
  if (stat.isFile()) return [path];
  return readdirSync(path).flatMap((entry) => files(resolve(path, entry)));
}
