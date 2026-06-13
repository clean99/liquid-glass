# Maintainers

This file names the public ownership model for `@clean99/liquid-glass`.

## Current Maintainer

| Area                              | Owner      | Scope                                                                                             |
| --------------------------------- | ---------- | ------------------------------------------------------------------------------------------------- |
| Repository stewardship            | `@clean99` | Release decisions, repository settings, npm publish, security routing, and final merge authority. |
| Component API and accessibility   | `@clean99` | Public exports, component semantics, fallback behavior, and accessibility release claims.         |
| Refraction and visual parity      | `@clean99` | Liquid Glass material behavior, Kube strict gate, visual snapshots, and exact parity tracking.    |
| Registry and package distribution | `@clean99` | shadcn-style registry metadata, package files, Changesets, and npm provenance.                    |

## Maintainer Contract

Maintainers must keep public claims tied to evidence:

- npm install is not live because the package is not published to npm yet.
- Storybook Pages is not public until the Pages deploy job succeeds.
- Kube exact 1:1 parity is not claimed until `pnpm test:kube-reference:exact` passes.
- Third-party source code is not copied into this repository.
- Reference sources stay listed in `ATTRIBUTIONS.md` and `docs/reference-provenance.json`.

## Operational Runbook

Use `docs/maintainer-runbook.md` for triage, release, CI, Pages, registry,
security, and rollback procedures.

## Ownership Changes

Adding a maintainer requires a pull request that updates this file,
`.github/CODEOWNERS`, and the relevant repository permissions. Do not grant npm
publish or repository administration access through undocumented side channels.
