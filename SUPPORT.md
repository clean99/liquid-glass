# Support

`@clean99/liquid-glass` is a pre-1.0 open-source React component library. This
page routes support requests so security issues, package install problems,
accessibility bugs, visual regressions, and general usage questions do not
collapse into one queue.

## Before Opening An Issue

Check these docs first:

- `README.md` for project status and install honesty.
- `docs/installation.md` for package setup.
- `docs/browser-support.md` for enhanced, fallback, solid, and off modes.
- `docs/shadcn-registry.md` for shadcn-style registry behavior.
- `docs/testing.md` for local verification commands.
- `docs/kube-parity-gate.md` for Kube reference status.
- `docs/maintainer-runbook.md` for maintainer triage, release, security,
  rollback, Pages, registry, and CI failure procedures.

The package is prepared for npm release, but it is not published yet. Do not
report a missing npm install path as a release bug until the first npm publish
has actually happened.

## Where To Go

| Need                             | Use                                                                                            |
| -------------------------------- | ---------------------------------------------------------------------------------------------- |
| Broken component behavior        | Open a bug report with runtime, browser, liquid mode, reproduction, and screenshots if visual. |
| Accessibility regression         | Open a bug report and include keyboard path, screen reader impact, and expected semantics.     |
| Missing or stale documentation   | Open a documentation issue with page, story, expected content, and evidence.                   |
| Package export or registry issue | Open a registry issue with the exact command, output, environment, and package version/commit. |
| New component or public API idea | Open a feature request before implementation.                                                  |
| Security vulnerability           | Open a private security advisory; do not disclose it publicly first.                           |
| Exact Kube parity discussion     | Treat it as visual reference work; do not claim exact parity until the exact gate passes.      |
| General usage question           | Open a normal issue only if the docs do not answer it and include a minimal example.           |

## Maintainer Response

Maintainers prioritize reports in this order:

1. Security, release integrity, and provenance issues.
2. Accessibility and broken fallback/solid-mode behavior.
3. Package exports, registry metadata, and install path problems.
4. Browser behavior regressions in supported fallback paths.
5. Enhanced refraction tuning and exact visual parity work.
6. General usage questions and feature requests.

## Required Evidence

Good reports include:

- package version or commit SHA;
- React, framework, Node, pnpm, browser, and operating system;
- liquid mode: `auto`, `enhanced`, `fallback`, `solid`, or `off`;
- minimal reproduction, Storybook route, registry URL, or command output;
- screenshots or video for visual and interaction issues;
- whether fallback or solid mode still works.

## Unsupported Requests

These are normally closed or redirected:

- requests to claim npm availability before the package is published;
- requests to claim GitHub Pages availability before the Pages workflow deploys;
- requests to claim exact Kube parity before `pnpm test:kube-reference:exact`
  passes;
- reports that require private credentials, production data, or undisclosed
  third-party source code;
- enhanced-refraction-only browser differences when fallback and solid modes
  remain readable and functional.
