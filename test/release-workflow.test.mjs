import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const workflow = (name) =>
  readFile(new URL(`../.github/workflows/${name}`, import.meta.url), 'utf8');
const script = (name) =>
  readFile(new URL(`../scripts/${name}`, import.meta.url), 'utf8');

function job(source, name) {
  const marker = `\n  ${name}:\n`;
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `missing ${name} job`);
  const tail = source.slice(start + marker.length);
  const next = tail.search(/\n  [a-z][a-z0-9_-]*:\n/);
  return next === -1 ? tail : tail.slice(0, next);
}

function assertLeastPrivilegeJobs(source) {
  assert.match(source, /^permissions: \{\}$/m);
  assert.equal((source.match(/id-token: write/g) ?? []).length, 1);
  assert.equal((source.match(/contents: write/g) ?? []).length, 1);
  assert.equal((source.match(/environment: npm-production/g) ?? []).length, 1);

  const candidate = job(source, 'candidate');
  assert.match(candidate, /permissions:\n      contents: read/);
  assert.match(candidate, /pnpm install --frozen-lockfile/);
  assert.match(candidate, /pnpm verify/);
  assert.match(candidate, /pnpm pack/);
  assert.match(candidate, /actions\/upload-artifact@/);
  assert.doesNotMatch(candidate, /id-token: write|contents: write|environment:|NPM_TOKEN|GH_TOKEN/);

  const publish = job(source, 'publish');
  assert.match(publish, /permissions:\n      contents: read\n      id-token: write/);
  assert.match(publish, /environment: npm-production/);
  assert.match(publish, /actions\/download-artifact@/);
  assert.match(publish, /sha512sum --check --strict candidate\.sha512/);
  assert.match(publish, /npm publish/);
  assert.doesNotMatch(
    publish,
    /pnpm install|pnpm verify|pnpm pack|node scripts\/|contents: write|GH_TOKEN/,
  );

  const attest = job(source, 'attest');
  assert.match(attest, /permissions:\n      contents: read/);
  assert.match(attest, /actions\/download-artifact@/);
  assert.match(attest, /verify-published-package\.mjs/);
  assert.match(attest, /actions\/upload-artifact@/);
  assert.doesNotMatch(
    attest,
    /id-token: write|contents: write|environment:|NPM_TOKEN|NODE_AUTH_TOKEN|GH_TOKEN|pnpm install|pnpm verify/,
  );

  const release = job(source, 'release');
  assert.match(release, /permissions:\n      contents: write/);
  assert.match(release, /actions\/download-artifact@/);
  assert.match(release, /verify-publication-attestation-asset\.mjs/);
  assert.doesNotMatch(
    release,
    /id-token: write|environment:|NPM_TOKEN|NODE_AUTH_TOKEN|pnpm install|pnpm verify|npm publish/,
  );
  const validatorStart = release.indexOf(
    '- name: Validate the durable publication evidence without a write token',
  );
  assert.ok(validatorStart > -1);
  const validator = release.slice(validatorStart);
  assert.doesNotMatch(validator, /GH_TOKEN|github\.token/);
  assert.doesNotMatch(release.slice(0, validatorStart), /node scripts\//);
}

test('tag releases separate authority and re-authorize main at each mutation', async () => {
  const source = await workflow('release.yml');
  assertLeastPrivilegeJobs(source);
  assert.match(source, /group: sdk-release-\$\{\{ github\.ref_name \}\}/);
  assert.match(source, /if: steps\.registry\.outputs\.exists != 'true'/);
  assert.match(source, /npm 11\.5\.1 or later is required/);
  assert.doesNotMatch(source, /cache:\s*pnpm/);
  assert.doesNotMatch(source, /NPM_TOKEN|NODE_AUTH_TOKEN/);

  const publish = job(source, 'publish');
  const publishCommand = publish.lastIndexOf('npm publish "${RUNNER_TEMP}');
  assert.ok(publishCommand > -1);
  assert.ok(publish.lastIndexOf('git fetch --force origin', publishCommand) > -1);
  assert.ok(
    publish.lastIndexOf(
      'git merge-base --is-ancestor "$GITHUB_SHA" origin/main',
      publishCommand,
    ) > -1,
  );

  const release = job(source, 'release');
  assert.match(
    release,
    /authorize_tag_on_main\n            gh release create "\$GITHUB_REF_NAME"/,
  );
  assert.match(
    release,
    /authorize_tag_on_main\n                gh release upload "\$GITHUB_REF_NAME"/,
  );
  assert.doesNotMatch(release, /jq -S 'del\(\.retrievedAt\)'/);
  assert.doesNotMatch(release, /--clobber/);
});

test('published registry evidence remains SHA-512 and SLSA provenance bound', async () => {
  const verifier = await script('verify-published-package.mjs');
  const publishedProvenance = await script('published-package-provenance.mjs');
  const provenance = await script('registry-provenance.mjs');
  assert.match(verifier, /createHash\('sha512'\)/);
  assert.match(verifier, /candidateIntegrity !== distribution\.integrity/);
  assert.match(verifier, /published_sdk_candidate_integrity_mismatch/);
  assert.match(publishedProvenance, /dist\.attestations/);
  assert.match(publishedProvenance, /'install',[\s\S]*'--ignore-scripts'/);
  assert.match(
    publishedProvenance,
    /'audit',[\s\S]*'signatures',[\s\S]*'--include-attestations'/,
  );
  assert.match(publishedProvenance, /readNpmAuditVerifiedProvenance/);
  assert.match(publishedProvenance, /readRegistryProvenanceAttestation/);
  assert.match(publishedProvenance, /cryptographicallyVerified: true/);
  assert.match(verifier, /readGitHubReleaseContext/);
  assert.match(verifier, /readPublishedPackageProvenance/);
  assert.match(verifier, /createNpmRegistryMetadata/);
  assert.match(verifier, /npmRegistryMetadataDigest/);
  assert.match(verifier, /registryMetadata,/);
  assert.match(provenance, /GITHUB_WORKFLOW_REF/);
  assert.match(provenance, /refs\/heads\/main/);
  assert.match(provenance, /refs\/tags\/v\$\{expected\.version\}/);
  assert.match(verifier, /npmProvenance/);
});

test('bootstrap preserves advanced-main recovery without ambient authority', async () => {
  const source = await workflow('bootstrap-first-publish.yml');
  const resolver = await script('resolve-published-source-commit.mjs');
  assertLeastPrivilegeJobs(source);
  assert.match(source, /PUBLISH @wathba-cli\/sdk 0\.1\.0 ONCE/);
  assert.match(source, /test "\$GITHUB_REF" = "refs\/heads\/main"/);
  assert.match(source, /group: sdk-release-v0\.1\.0/);
  assert.match(source, /git merge-base --is-ancestor "\$GITHUB_SHA" origin\/main/);
  assert.match(source, /id: registry/);
  assert.match(source, /echo "exists=true" >> "\$GITHUB_OUTPUT"/);
  assert.match(source, /echo "exists=false" >> "\$GITHUB_OUTPUT"/);
  assert.match(source, /if: steps\.registry\.outputs\.exists != 'true'/);
  assert.match(
    source,
    /source_commit="\$\(node scripts\/resolve-published-source-commit\.mjs\)"/,
  );
  assert.match(source, /source_commit="\$GITHUB_SHA"/);
  assert.match(source, /test "\$source_commit" = "\$\(git rev-parse origin\/main\)"/);
  assert.match(source, /git merge-base --is-ancestor "\$source_commit" origin\/main/);
  assert.match(source, /ref: \$\{\{ steps\.source\.outputs\.commit \}\}/);
  assert.match(source, /source_commit: \$\{\{ steps\.source\.outputs\.commit \}\}/);
  assert.match(
    source,
    /WATHBA_SDK_EXPECTED_SOURCE_COMMIT: \$\{\{ needs\.candidate\.outputs\.source_commit \}\}/,
  );
  assert.equal((source.match(/secrets\.NPM_TOKEN/g) ?? []).length, 1);
  assert.equal((source.match(/NODE_AUTH_TOKEN:/g) ?? []).length, 1);
  assert.match(source, /--provenance/);
  assert.doesNotMatch(source, /cache:\s*pnpm/);

  const publish = job(source, 'publish');
  const publishCommand = publish.lastIndexOf('npm publish "${RUNNER_TEMP}');
  assert.ok(
    publish.lastIndexOf(
      'test "$PUBLISHED_SOURCE_COMMIT" = "$(git rev-parse origin/main)"',
      publishCommand,
    ) > -1,
  );
  assert.ok(publish.lastIndexOf('git fetch --force origin', publishCommand) > -1);

  const release = job(source, 'release');
  assert.match(release, /release_tag="v0\.1\.0"/);
  assert.match(
    release,
    /PUBLISHED_SOURCE_COMMIT: \$\{\{ needs\.candidate\.outputs\.source_commit \}\}/,
  );
  assert.match(release, /--target "\$PUBLISHED_SOURCE_COMMIT"/);
  assert.match(release, /--verify-tag/);
  assert.match(release, /commits\/\$\{release_tag\}/);
  assert.match(release, /test "\$tag_commit" = "\$PUBLISHED_SOURCE_COMMIT"/);
  assert.match(release, /--json tagName,name,isDraft,isPrerelease/);
  assert.match(release, /\.name == "@wathba-cli\/sdk 0\.1\.0"/);
  assert.match(release, /existing bootstrap release identity is invalid/);
  assert.match(release, /evidence_state=existing/);
  assert.match(release, /cmp "\$attestation_path" "\$existing_evidence"/);
  assert.match(
    release,
    /authorize_source_on_main\n            if \[ "\$tag_exists" = "true" \]/,
  );
  assert.match(
    release,
    /authorize_source_on_main\n                gh release upload "\$release_tag"/,
  );
  assert.doesNotMatch(release, /\$GITHUB_SHA/);
  assert.doesNotMatch(release, /jq -S 'del\(\.retrievedAt\)'|--clobber/);
  assert.doesNotMatch(source, /bootstrap is permanently closed/);

  assert.match(resolver, /readPublishedPackageProvenance/);
  assert.match(resolver, /process\.stdout\.write\(npmProvenance\.sourceCommit\)/);
  assert.doesNotMatch(resolver, /GITHUB_SHA/);
  assert.ok(
    source.indexOf('ref: ${{ steps.source.outputs.commit }}') <
      source.indexOf('uses: pnpm/action-setup@'),
  );
  assert.ok(source.indexOf('\n  attest:\n') < source.indexOf('\n  release:\n'));
});

test('release workflows pin every external action by commit', async () => {
  for (const name of ['release.yml', 'bootstrap-first-publish.yml']) {
    const source = await workflow(name);
    const uses = [...source.matchAll(/^\s*-?\s*uses:\s*(\S+)/gm)].map(
      (match) => match[1],
    );
    assert.ok(uses.length > 0);
    for (const dependency of uses) {
      assert.match(dependency, /@[0-9a-f]{40}$/);
    }
  }
});
