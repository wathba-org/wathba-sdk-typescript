import { readPublishedPackageProvenance } from './published-package-provenance.mjs';

const repository =
  'https://github.com/wathba-org/wathba-sdk-typescript';
const { npmProvenance } = await readPublishedPackageProvenance({
  name: '@wathba-cli/sdk',
  version: '0.1.0',
  repository,
  workflowRefs: [
    {
      path: '.github/workflows/bootstrap-first-publish.yml',
      ref: 'refs/heads/main',
    },
    {
      path: '.github/workflows/release.yml',
      ref: 'refs/tags/v0.1.0',
    },
  ],
});

process.stdout.write(npmProvenance.sourceCommit);
