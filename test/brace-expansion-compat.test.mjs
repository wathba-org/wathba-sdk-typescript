import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const openapiRequire = createRequire(
  require.resolve('openapi-typescript/package.json'),
);
const redoclyRequire = createRequire(
  openapiRequire.resolve('@redocly/openapi-core'),
);
const minimatch = redoclyRequire('minimatch');
const minimatchRequire = createRequire(
  redoclyRequire.resolve('minimatch/package.json'),
);
const { expand } = minimatchRequire('brace-expansion');

test('patched minimatch uses the fixed brace expansion export', () => {
  assert.equal(minimatch('sdk-esm', 'sdk-{esm,cjs}'), true);
  assert.equal(minimatch('sdk-browser', 'sdk-{esm,cjs}'), false);
});

test('patched brace expansion bounds chained expansion output', () => {
  const maxLength = 10_000;
  const output = expand('{a,b}'.repeat(200), {
    max: 1_000,
    maxLength,
  });
  const totalLength = output.reduce((total, value) => total + value.length, 0);

  assert.ok(totalLength <= maxLength);
});
