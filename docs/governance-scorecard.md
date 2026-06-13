# Governance Scorecard

The governance scorecard is a repeatable audit for the repository work that is
easy to overstate by hand: docs, issue routing, CI gates, release readiness,
registry distribution, attribution, and discoverability.

The comparative benchmark lives in `docs/ui-library-benchmark.md`. It separates
local gate readiness from public launch readiness so the project does not
overclaim npm, Pages, or exact Kube parity.

## Commands

Local-only audit:

```sh
pnpm audit:governance
```

CI gate:

```sh
pnpm test:governance
```

Remote-aware audit:

```sh
CHECK_REMOTE_GOVERNANCE=1 pnpm audit:governance
```

Machine-readable output for automation:

```sh
CHECK_REMOTE_GOVERNANCE=1 pnpm --silent audit:governance:json
```

The remote-aware audit checks public GitHub state such as Pages, homepage,
topics, wiki state, and repository visibility. It is not part of CI because
repository settings can be unavailable to forks and local contributors.
When GitHub's public API is unavailable or rate-limited, the JSON report keeps
the local score and marks `remoteStatus.checked` as `false` instead of failing
the automation.

## Score Areas

| Area                     | What it proves                                                                                  |
| ------------------------ | ----------------------------------------------------------------------------------------------- |
| Repository first screen  | README, `llms.txt`, and package metadata tell users and assistants the true project status.     |
| Documentation structure  | Required docs exist and include visual flow diagrams, accessibility, and an AI/agent map.       |
| Contribution workflow    | PR and issue templates route bugs, features, and registry issues.                               |
| Release CI               | CI, release, visual, and Pages workflows use the expected gates.                                |
| Registry distribution    | shadcn-style registry files are generated, tested, and honest about npm dependency.             |
| Storybook Pages          | The workflow can build and deploy Storybook after Pages is enabled.                             |
| Visual documentation     | Storybook, screenshots, state profiles, a11y, and reference gates describe the visual contract. |
| Dependency governance    | Dependabot updates are grouped so dependency noise stays manageable.                            |
| Security and attribution | Security policy, license, attributions, and reference provenance are present.                   |
| Publish readiness        | Changesets, package files, public publish config, and release docs are aligned.                 |
| Discoverability          | Keywords, repository metadata, `llms.txt`, and links expose the package to the right audience.  |

## Current Remote Gaps

As of June 13, 2026, the known remote gaps are:

- GitHub Pages is not enabled, so Storybook deploy is skipped after the local
  build and a11y gate.
- The repository homepage is empty until Pages succeeds.
- Wiki is enabled even though repository docs are the canonical source.
- Discussions are disabled, so issue template contact links should not point
  there until it is enabled.

These are repository settings, not package code defects.
