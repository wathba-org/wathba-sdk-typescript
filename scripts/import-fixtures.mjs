import { mkdir, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import {
  readVerifiedFixtureSet,
  readVerifiedOpenApi,
} from './lib/contract-artifacts.mjs';

const sourceArgument = process.argv.slice(2).find((argument) => argument !== '--');
if (!sourceArgument) {
  throw new Error('usage: pnpm fixtures:import -- /absolute/path/to/fixture-set.json');
}

const sourcePath = resolve(sourceArgument);
const sourceDirectory = sourcePath.endsWith('.json') ? dirname(sourcePath) : sourcePath;
const [{ release }, fixtureSet] = await Promise.all([
  readVerifiedOpenApi(),
  readVerifiedFixtureSet(sourceDirectory),
]);
if (fixtureSet.fixtureSet.contractVersion !== release.contractVersion) {
  throw new Error('fixture_openapi_contract_version_mismatch');
}

const outputDirectory = resolve('fixtures/v1');
await mkdir(outputDirectory, { recursive: true });
for (const { name, source } of fixtureSet.fixtures) {
  await replaceFile(resolve(outputDirectory, name), source);
}
await replaceFile(resolve(outputDirectory, 'fixture-set.json'), fixtureSet.setSource);

async function replaceFile(target, source) {
  const temporary = `${target}.tmp-${process.pid}`;
  await writeFile(temporary, source, { encoding: 'utf8', mode: 0o644 });
  await rename(temporary, target);
}
