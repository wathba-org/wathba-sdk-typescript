import { execFileSync } from 'node:child_process';

const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const source = execFileSync(pnpm, ['licenses', 'list', '--json'], { encoding: 'utf8' });
const licenses = JSON.parse(source);
const allowed = new Set([
  '(MIT OR CC0-1.0)',
  'Apache-2.0',
  'ISC',
  'MIT',
  'Python-2.0',
]);
const forbidden = Object.keys(licenses).filter((license) => !allowed.has(license));
if (forbidden.length > 0) {
  throw new Error(`dependency_license_not_approved:${forbidden.sort().join(',')}`);
}
