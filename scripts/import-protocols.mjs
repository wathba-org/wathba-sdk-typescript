import { mkdir, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { readVerifiedProtocolSet } from './lib/contract-artifacts.mjs';

const sourceArgument = process.argv.slice(2).find((argument) => argument !== '--');
if (!sourceArgument) {
  throw new Error('usage: pnpm protocols:import -- /absolute/path/to/contract-set.json');
}

const sourcePath = resolve(sourceArgument);
const sourceDirectory = sourcePath.endsWith('.json') ? dirname(sourcePath) : sourcePath;
const protocolSet = await readVerifiedProtocolSet(sourceDirectory);
const outputDirectory = resolve('protocols/v1');
const temporaryDirectory = `${outputDirectory}.tmp-${process.pid}`;

await rm(temporaryDirectory, { recursive: true, force: true });
await mkdir(temporaryDirectory, { recursive: true });
for (const { name, source } of protocolSet.contracts) {
  await writeFile(resolve(temporaryDirectory, name), source, { encoding: 'utf8', mode: 0o644 });
}
await writeFile(resolve(temporaryDirectory, 'contract-set.json'), protocolSet.setSource, {
  encoding: 'utf8',
  mode: 0o644,
});
await rm(outputDirectory, { recursive: true, force: true });
await rename(temporaryDirectory, outputDirectory);
