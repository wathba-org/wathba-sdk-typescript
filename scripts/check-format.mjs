import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, resolve } from 'node:path';

const checkedExtensions = new Set(['.cjs', '.json', '.md', '.mjs', '.ts']);
const violations = [];
for (const root of ['README.md', 'package.json', 'release.json', 'protocols', 'recipes', 'scripts', 'src', 'test', 'tsconfig.base.json', 'tsconfig.cjs.json', 'tsconfig.esm.json']) {
  for (const path of files(resolve(root))) {
    if (!checkedExtensions.has(extname(path))) continue;
    const source = readFileSync(path, 'utf8');
    if (!source.endsWith('\n')) violations.push(`${path}:missing-final-newline`);
    if (source.includes('\r')) violations.push(`${path}:carriage-return`);
    if (source.split('\n').some((line) => /[ \t]+$/.test(line))) {
      violations.push(`${path}:trailing-whitespace`);
    }
  }
}
if (violations.length > 0) throw new Error(`format_check_failed:${violations.join(',')}`);

function files(path) {
  const stat = statSync(path);
  if (stat.isFile()) return [path];
  return readdirSync(path).flatMap((entry) => files(resolve(path, entry)));
}
