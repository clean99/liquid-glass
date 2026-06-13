# GitHub Repository Settings

This package is intended to live at `clean99/liquid-glass` as a public GitHub
repository. Keep the repository empty before the first push because this local
repository already contains the README, license, workflows, and issue templates.

## First Push

Create the repository in GitHub with:

- visibility: public
- name: `liquid-glass`
- owner: `clean99`
- description:
  `Beautiful, accessible Liquid Glass components for React with real SVG/CSS refraction and production-ready fallbacks.`
- README: disabled
- `.gitignore`: disabled
- license: disabled

Then run:

```sh
git remote set-url origin git@github.com:clean99/liquid-glass.git
git push -u origin main
```

If GitHub CLI is installed and authenticated, the equivalent bootstrap is:

```sh
gh repo create clean99/liquid-glass \
  --public \
  --description "Beautiful, accessible Liquid Glass components for React with real SVG/CSS refraction and production-ready fallbacks." \
  --source . \
  --remote origin \
  --push
```

## Required Settings

- General > Features: enable Issues, Discussions, and Projects only if they are
  actively used.
- General > Features: disable Wiki if repository docs remain the source of
  truth.
- Pages > Build and deployment: select GitHub Actions as the Pages source.
- Actions > General: allow GitHub Actions and reusable workflows.
- Actions > Workflow permissions: read and write permissions, with pull request
  creation enabled for the release workflow.
- Workflows: use Node 24 for CI, Pages, Visual Regression, and Release. pnpm 11
  requires Node `>=22.13.0`, and Node 20 action runtime is deprecated.
- Branches: protect `main` after the first successful CI run.
- Tags and releases: publish from Changesets only.

## Current Remote Checks

As of June 13, 2026, the public repository exists and has the expected
description, topics, license, and default branch. The GitHub API reports no
Pages site yet, so a Pages workflow failure at `actions/configure-pages` should
be treated as a repository-setting issue until Pages is enabled with GitHub
Actions as the source.

Discussions are currently disabled. Keep the issue template contact link pointed
at Discussions only after that feature is enabled, or use Issues for structured
questions.

## Branch Protection

Require these checks before merging to `main`:

- `ci`
- `visual`

Use linear history if the repository does not need merge commits. Do not enable
rules that block the Changesets release workflow from opening its version pull
request.

## Repository Secrets

Required for npm publishing:

- `NPM_TOKEN`: npm automation token with publish access to
  `@clean99/liquid-glass`.

Provided by GitHub Actions:

- `GITHUB_TOKEN`: used by Changesets to open the version pull request.

No local auth, session, cache, Playwright report, or test-result files should be
committed.

## Topics

Use repository topics that reflect the public package surface:

- `react`
- `typescript`
- `design-system`
- `liquid-glass`
- `apple-liquid-glass`
- `css-refraction`
- `svg-filter`
- `refractive`
- `shadcn-ui`
- `storybook`
- `accessibility`

## Public Site

The `pages.yml` workflow deploys Storybook through GitHub Pages. After the first
successful run, the public documentation URL should be added to the repository
homepage.

## Rollback

- Documentation or Storybook issue: revert the bad commit and let Pages redeploy.
- npm issue: publish a patch release that reverts the package behavior, then
  deprecate the bad version on npm if needed.
