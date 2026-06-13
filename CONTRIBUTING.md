# Contributing

## Before You Start

Open an issue first for new components, public API changes, registry behavior,
release workflow changes, or optical model changes. Small documentation fixes and
test-only corrections can go straight to a pull request.

Use `SUPPORT.md` to choose the right path for usage questions, accessibility
bugs, registry or package install issues, security reports, and release status
questions.

Maintainer triage and release operations live in `docs/maintainer-runbook.md`.

## Local Setup

```sh
pnpm install
pnpm dev
```

## Quality Gate

Before opening a pull request, run:

```sh
pnpm format
pnpm lint
pnpm typecheck
pnpm test:docs
pnpm test:inventory
pnpm test:release-readiness
pnpm test:unit
```

Use `pnpm run ci` before larger pull requests. It includes docs, reference
provenance, inventory, component coverage, registry, shadcn parity, release
readiness, unit, component, physics, Storybook, e2e, accessibility, build, and
package gates.

Before tagging or publishing a release, run:

```sh
pnpm verify
```

Use `pnpm test:kube-reference` when changing the optical model, lens,
searchbox, switch, slider, or music player demos. Use `pnpm test:e2e` when you
want the browser behavior gate without the visual and Kube reference runs.

## Pull Request Scope

- Keep one behavioral concern per pull request.
- Update docs and registry metadata in the same pull request as public API changes.
- Add or update tests for pure business logic before adding UI-specific checks.
- Do not copy third-party source code into this repository.
- Do not claim npm publish, GitHub Pages, or exact Kube parity before those gates
  have actually succeeded.

## Component Rules

- Keep foreground text outside the refraction layer.
- Route enhanced, fallback, solid, and off modes through `LiquidSurface`.
- Do not import `@hashintel/refractive` directly from high-level components.
- Prefer native semantics before custom keyboard handling.
- Add pure utility tests for interaction math and browser support decisions.
- Add Storybook coverage for light, dark, enhanced, fallback, reduced motion, high contrast, long text, and dense layouts.

## Changesets

For user-visible changes, run:

```sh
pnpm changeset
```

The package is currently pre-1.0. Keep breaking API changes explicit in the changeset body.

## Release Changes

Release workflow, package metadata, registry, attribution, and provenance changes
must pass `pnpm test:release-readiness` and `pnpm test:research`. The first npm
publish also requires the `NPM_TOKEN` repository secret and GitHub Actions
provenance.
