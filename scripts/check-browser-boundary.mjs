import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const tsc = spawnSync(
  process.execPath,
  [resolve('node_modules/typescript/bin/tsc'), '-p', 'test/tsconfig.browser.json'],
  { encoding: 'utf8' },
);
const diagnostics = `${tsc.stdout}${tsc.stderr}`;
if (tsc.status === 0 || !/has no exported member ['"]WathbaClient['"]/.test(diagnostics)) {
  throw new Error('browser_type_boundary_not_rejected');
}

const runtime = spawnSync(
  process.execPath,
  ['--conditions=browser', '--input-type=module', '--eval', "await import('@wathba-cli/sdk')"],
  { encoding: 'utf8' },
);
if (runtime.status === 0 || !runtime.stderr.includes('@wathba-cli/sdk is server-only')) {
  throw new Error('browser_runtime_boundary_not_rejected');
}
