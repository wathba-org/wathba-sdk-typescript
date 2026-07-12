import { readFile } from 'node:fs/promises';

const tag = process.argv[2] ?? '';
const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
if (tag !== `v${manifest.version}`) {
  throw new Error(`release_tag_version_mismatch:${tag || 'missing'}:${manifest.version}`);
}
