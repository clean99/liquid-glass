# Open Source Release Checklist

This repository is prepared as an independent package, not as a private blog
subdirectory.

## GitHub Repository Bootstrap

The intended remote is `git@github.com:clean99/liquid-glass.git`. Create the
repository as a public GitHub repository before the first push. With GitHub CLI
available, the bootstrap command is:

```sh
gh repo create clean99/liquid-glass \
  --public \
  --description "Beautiful, accessible Liquid Glass components for React with real SVG/CSS refraction and production-ready fallbacks." \
  --source . \
  --remote origin \
  --push
```

Without GitHub CLI, create `clean99/liquid-glass` in the GitHub UI, keep it
empty, then run:

```sh
git remote set-url origin git@github.com:clean99/liquid-glass.git
git push -u origin main
```

Do not initialize the GitHub repository with a README, license, or `.gitignore`;
those files already live in this repository.

## Required Repository Files

- `README.md`
- `llms.txt`
- `LICENSE`
- `ATTRIBUTIONS.md`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `CODE_OF_CONDUCT.md`
- `CHANGELOG.md`
- `ROADMAP.md`
- `docs/accessibility.md`
- `docs/open-source-governance.md`
- `docs/release-evidence.md`
- `docs/reference-provenance.json`
- `.github/workflows/ci.yml`
- `.github/workflows/visual.yml`
- `.github/workflows/pages.yml`
- `.github/workflows/release.yml`
- `.github/ISSUE_TEMPLATE/bug_report.yml`
- `.github/ISSUE_TEMPLATE/feature_request.yml`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/dependabot.yml`

`pnpm test:docs` verifies the presence of these files and the key claims they
must contain, including the assistant-facing `llms.txt` documentation index and
the accessibility contract.

Repository-level settings are tracked in `docs/github-repository-settings.md`.
The shadcn-style registry distribution model is tracked in
`docs/shadcn-registry.md`. Maintainer triage and incident procedures are tracked
in `docs/maintainer-runbook.md`. Public-claim evidence is tracked in
`docs/release-evidence.md`.

## Publication Status

The package is not published to npm yet. Do not describe `pnpm add
@clean99/liquid-glass` or `npx shadcn@latest add ...` as a working consumer path
until the first npm release succeeds. Registry metadata can be reviewed before
publish, but the registry entries intentionally depend on the npm package.

## Release Flow

GitHub Actions run Node 24. The package `engines.node` lower bound is
`>=22.13.0` because pnpm 11 requires at least that Node line.

1. Run `pnpm test:component-coverage`, `pnpm test:visual-docs`, and
   `pnpm test:release-readiness` to validate component behavior coverage,
   visual state coverage, package metadata, workflows, docs, registry files,
   Changesets, and strict release gates.
2. Run `pnpm test:governance` to validate the local open-source readiness
   scorecard. Run `CHECK_REMOTE_GOVERNANCE=1 pnpm audit:governance` during
   maintainer release review to include GitHub Pages and repository metadata.
   Use `docs/release-evidence.md` to separate proven public claims from prepared
   but unpublished work.
3. Run `pnpm test:research` to validate external reference provenance, licenses,
   inspected commits, and the no-copied-source policy.
4. For manual release review, run
   `CHECK_REMOTE_REFS=1 pnpm test:research` to verify pinned research commits
   against public remotes.
5. Run `pnpm verify`.
6. Run `pnpm test:kube-reference:strict` for release-candidate visual parity.
7. Confirm `pnpm test:a11y` and `pnpm test:e2e` pass on `main`; accessibility
   claims must remain tied to `docs/accessibility.md`, not informal screenshots.
8. Confirm `pnpm pack --dry-run` includes only package, docs, examples, registry,
   schema, license, README, and attribution files.
9. Add a changeset for user-visible changes.
10. Merge to `main`.
11. Run the release workflow manually after reviewing the generated version PR.
12. The release workflow runs `pnpm verify`, then uses Changesets to either open
    a version PR or publish the already-versioned package with `pnpm release`.
    The workflow sets `NPM_CONFIG_PROVENANCE=true` so npm receives a GitHub
    Actions provenance statement for published artifacts.

Publishing requires repository secrets:

- `NPM_TOKEN`: npm automation token with publish access for the package.
- `GITHUB_TOKEN`: provided by GitHub Actions for the version PR.

`package.json` must keep `publishConfig.access` set to `public`; scoped packages
default to private publishing on npm unless this is explicit.

The release job keeps `id-token: write` and `NPM_CONFIG_PROVENANCE=true` together.
Do not move provenance into `.npmrc`: local manual publishes do not have the
GitHub Actions OIDC context and should not pretend they can generate the same
attestation.

## GitHub Pages

The `pages.yml` workflow installs Chromium, runs `pnpm test:a11y`, builds
Storybook, and deploys it through GitHub Pages Actions. Repository settings must
use "GitHub Actions" as the Pages source. If Pages is not enabled yet, the
workflow skips deploy after Storybook and a11y succeed; check the repository
Pages setting before changing application code.

## Visual Regression

The `visual.yml` workflow runs deterministic Playwright visual snapshots and
`pnpm test:kube-reference:strict`. The strict Kube gate captures the public
reference and local Storybook with real pointer input for idle, pressed, and
dragged states. It runs for pull requests and every `main` push so maintainers
can require a public visual regression signal before a release. Do not replace
it with the looser command for pull requests.

## Rollback

For documentation or Storybook issues, revert the commit and let Pages redeploy.
For package issues, publish a patch release that reverts the exported API or mark
the bad version as deprecated in npm.
