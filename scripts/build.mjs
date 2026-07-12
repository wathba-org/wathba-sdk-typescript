import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

rmSync(resolve('dist'), { recursive: true, force: true });
const tsc = resolve('node_modules/typescript/bin/tsc');
execFileSync(process.execPath, [tsc, '-p', 'tsconfig.esm.json'], { stdio: 'inherit' });
execFileSync(process.execPath, [tsc, '-p', 'tsconfig.cjs.json'], { stdio: 'inherit' });
mkdirSync(resolve('dist/cjs'), { recursive: true });
writeFileSync(resolve('dist/cjs/package.json'), '{"type":"commonjs"}\n', 'utf8');
