# Open Source Release Checklist

This repository is prepared as an independent package, not as a private blog
subdirectory.

## Required Repository Files

- `README.md`
- `LICENSE`
- `ATTRIBUTIONS.md`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `CODE_OF_CONDUCT.md`
- `CHANGELOG.md`
- `.github/workflows/ci.yml`
- `.github/workflows/visual.yml`
- `.github/workflows/pages.yml`
- `.github/workflows/release.yml`
- `.github/ISSUE_TEMPLATE/bug_report.yml`
- `.github/ISSUE_TEMPLATE/feature_request.yml`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/dependabot.yml`

`pnpm test:docs` verifies the presence of these files and the key claims they
must contain.

## Release Flow

1. Run `pnpm ci`.
2. Run `pnpm test:visual`.
3. Run `pnpm test:kube-reference` when optical behavior changed.
4. Add a changeset for user-visible changes.
5. Merge to `main`.
6. Run the release workflow manually after reviewing the generated version PR.

## GitHub Pages

The `pages.yml` workflow builds Storybook and deploys it through GitHub Pages
Actions. Repository settings must use "GitHub Actions" as the Pages source.

## Rollback

For documentation or Storybook issues, revert the commit and let Pages redeploy.
For package issues, publish a patch release that reverts the exported API or mark
the bad version as deprecated in npm after npm publishing is enabled.
