import { mkdir, rename, writeFile } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';
import { readVerifiedOpenApi } from './lib/contract-artifacts.mjs';

const source = process.argv.slice(2).find((argument) => argument !== '--');
if (!source) {
  throw new Error('usage: pnpm openapi:import -- /absolute/path/to/wathba-public.openapi.json');
}

const sourcePath = resolve(source);
const { artifactSource, releaseSource, release } = await readVerifiedOpenApi(dirname(sourcePath));
if (release.artifact !== basename(sourcePath)) throw new Error('openapi_artifact_name_mismatch');

const output = resolve('openapi');
await mkdir(output, { recursive: true });
await replaceFile(resolve(output, release.artifact), artifactSource);
await replaceFile(resolve(output, 'release.json'), releaseSource);

async function replaceFile(target, source) {
  const temporary = `${target}.tmp-${process.pid}`;
  await writeFile(temporary, source, { encoding: 'utf8', mode: 0o644 });
  await rename(temporary, target);
}
