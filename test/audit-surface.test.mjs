import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cp, mkdtemp, rm, writeFile, appendFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';

test('package audit permits only verified contract fixtures and still rejects provider clients and fixture drift', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'wathba-sdk-surface-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  for (const name of ['dist', 'release.json', 'openapi', 'protocols', 'fixtures', 'README.md', 'recipes', 'package.json']) {
    await cp(resolve(name), join(directory, name), { recursive: true });
  }
  const audit = () => execFileSync(process.execPath, [resolve('scripts/audit-surface.mjs')], {
    cwd: directory, stdio: 'pipe', encoding: 'utf8',
  });
  assert.doesNotThrow(audit);
  const code = join(directory, 'dist/esm/provider-canary.js');
  await writeFile(code, 'export const forbidden = "https://api.authentica.sa";\n');
  assert.throws(audit, (error) => String(error.stderr).includes('forbidden_package_surface:provider:'));
  await rm(code);
  const unregistered = join(directory, 'fixtures/v1/unregistered.json');
  await writeFile(unregistered, '{"provider":"authentica"}\n');
  assert.throws(audit, (error) => String(error.stderr).includes('forbidden_package_surface:provider:'));
  await rm(unregistered);
  await appendFile(join(directory, 'fixtures/v1/authentica-send-round-trip.json'), '\n');
  assert.throws(audit, (error) => /digest|mismatch/.test(String(error.stderr)));
});
