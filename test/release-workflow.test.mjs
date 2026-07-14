import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const workflow = (name) =>
  readFile(new URL(`../.github/workflows/${name}`, import.meta.url), 'utf8');
const script = (name) =>
  readFile(new URL(`../scripts/${name}`, import.meta.url), 'utf8');

test('tag releases are main-bound, byte-resumable, and OIDC-only', async () => {
  const source = await workflow('release.yml');
  assert.match(source, /git merge-base --is-ancestor "\$GITHUB_SHA" origin\/main/);
  assert.match(source, /group: sdk-release-\$\{\{ github\.ref_name \}\}/);
  assert.match(source, /if: steps\.registry\.outputs\.exists != 'true'/);
  assert.match(source, /verify-published-package\.mjs "\$\{\{ steps\.candidate\.outputs\.path \}\}"/);
  assert.doesNotMatch(source, /NPM_TOKEN|NODE_AUTH_TOKEN/);

  const verifier = await script('verify-published-package.mjs');
  const provenance = await script('registry-provenance.mjs');
  assert.match(verifier, /createHash\('sha512'\)/);
  assert.match(verifier, /candidateIntegrity !== distribution\.integrity/);
  assert.match(verifier, /published_sdk_candidate_integrity_mismatch/);
  assert.match(verifier, /dist\.attestations/);
  assert.match(verifier, /'install',[\s\S]*'--ignore-scripts'/);
  assert.match(
    verifier,
    /'audit',[\s\S]*'signatures',[\s\S]*'--include-attestations'/,
  );
  assert.match(verifier, /readNpmAuditVerifiedProvenance/);
  assert.match(verifier, /readRegistryProvenanceAttestation/);
  assert.match(verifier, /cryptographicallyVerified: true/);
  assert.match(verifier, /readGitHubReleaseContext/);
  assert.match(provenance, /GITHUB_WORKFLOW_REF/);
  assert.match(provenance, /refs\/heads\/main/);
  assert.match(provenance, /refs\/tags\/v\$\{expected\.version\}/);
  assert.match(verifier, /npmProvenance/);
});

test('one-time bootstrap is main-only, explicitly confirmed, and isolates its token', async () => {
  const source = await workflow('bootstrap-first-publish.yml');
  assert.match(source, /PUBLISH @wathba\/sdk 0\.1\.0 ONCE/);
  assert.match(source, /test "\$GITHUB_REF" = "refs\/heads\/main"/);
  assert.match(source, /group: sdk-release-v0\.1\.0/);
  assert.match(source, /already exists; bootstrap is permanently closed/);
  assert.equal((source.match(/secrets\.NPM_TOKEN/g) ?? []).length, 1);
  assert.equal((source.match(/NODE_AUTH_TOKEN:/g) ?? []).length, 1);
  assert.match(source, /--provenance/);
});

test('release workflows pin every external action by commit', async () => {
  for (const name of ['release.yml', 'bootstrap-first-publish.yml']) {
    const source = await workflow(name);
    const uses = [...source.matchAll(/^\s*-?\s*uses:\s*(\S+)/gm)].map((match) => match[1]);
    assert.ok(uses.length > 0);
    for (const dependency of uses) {
      assert.match(dependency, /@[0-9a-f]{40}$/);
    }
  }
});
