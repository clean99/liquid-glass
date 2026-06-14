# Testing

Core checks:

```sh
pnpm lint
pnpm typecheck
pnpm test:docs
pnpm test:launch-readiness
pnpm test:inventory
pnpm test:component-coverage
pnpm test:visual-docs
pnpm audit:visual-docs
pnpm test:research
pnpm test:unit
pnpm test:a11y
pnpm test:e2e
pnpm test:storybook
pnpm test:kube-assets
pnpm test:kube-reference:strict
pnpm test:kube-reference:exact
pnpm build
pnpm test:package
```

Release check:

```sh
pnpm verify
```

`pnpm verify` runs `pnpm run ci`, visual regression, Kube reference comparison,
and `pnpm pack --dry-run`. Use it before versioning, tagging, or publishing the
package.

`pnpm test:launch-readiness` runs the launch-progress audit with the current
pre-launch threshold. It does not claim npm, Pages, or exact Kube completion;
it prevents the quantified readiness score from moving backwards unnoticed.

Optical checks:

```sh
pnpm test:physics
pnpm test:kube-assets
pnpm test:kube-reference
pnpm test:kube-reference:strict
pnpm test:kube-reference:exact
```

Visual checks:

```sh
pnpm test:visual
pnpm test:visual:update
```

`pnpm test:visual` runs deterministic Playwright screenshots for representative
component states. The screenshot matcher allows a `0.06` max diff pixel ratio so
Linux and macOS font antialiasing do not fail otherwise identical states.
Use `pnpm test:visual:update` only when the intended visual change is reviewed
and the new snapshots are part of the same change.

`pnpm test:storybook` builds static Storybook and checks the enhanced-mode
contract for representative stories: resolved mode, SVG `url(...)` filter use,
radius, dimensions, and background material values.

`pnpm test:e2e` builds static Storybook, opens it in Chromium, and performs real
pointer actions for focus, hover, active press, and the draggable lens board. The
test uses real pointer actions instead of synthetic DOM events, records
`requestAnimationFrame` samples, and asserts pressed, dragging, and released
animation states. Focus screenshots record idle and focused mean luma plus
dark/black-pixel ratios for every audited surface, then fail if focus introduces
relative darkening. The material state also rejects any opaque low-luma focus
fill, so an `rgba(40, 42, 44, 0.44)` style black capsule cannot pass by hiding
behind text metrics. The OTP story starts with `123`, so the focused screenshot
covers the real filled-character selection path rather than only an empty cell.
Switch and slider focus hard-fail if the focused thumb loses too much brightness,
so the Kube-style focus contract remains frosted material plus growth rather
than a black or hard-ring state.

When debugging Storybook focus manually, verify the Storybook process cwd before
trusting a visible regression. A 2026-06-14 Chrome check found `localhost:6006`
serving `/Users/bytedance/Documents/Blog-dev/apps/docs`, which still had the old
dark OTP focus rule. The package Storybook launched from this repository on
`localhost:6016` resolved OTP focus to `rgba(255, 255, 255, 0.9)` with `scale(1.055)`.

`pnpm test:a11y` builds static Storybook, opens representative component stories in
Chromium, runs `@axe-core/playwright`, writes `test-results/a11y/storybook-a11y-summary.json`,
and fails on any `critical` or `serious` accessibility violation. This is the CI
gate; the Storybook addon is useful while developing, but it is not treated as
the only source of truth.

The accessibility contract lives in `docs/accessibility.md`. Axe catches static
violations, while unit tests, component tests, real Storybook interactions,
visual-state coverage, and Kube reference checks cover behavior and material
claims that axe cannot prove alone.

`pnpm test:kube-assets` runs `scripts/verify-kube-demo-assets.mjs`, opens the
rendered public Kube article, enables the Searchbox image-background state,
reads CSS background URLs, `<img>` sources, and SVG `<image>` hrefs, then compares them against
`stories/assets/kube/manifest.json`. It writes
`test-results/kube-assets/observed-kube-demo-assets.json` for diagnostics. This
is intentionally a networked provenance gate: if the public demo changes source
assets, the local fixtures must be reviewed instead of silently drifting.

`pnpm test:kube-reference` first runs `pnpm test:kube-assets`, then captures the
public Kube reference page and matching Storybook stories. It includes static
component screenshots plus
`pressed and dragged magnifying-glass screenshots` produced by real pointer input.
For every compared row, the script writes `*-target.png`, `*-candidate.png`, and
`*-diff.png` under `test-results/kube-reference/`; the diff image is a red
heatmap of the compared crop, not a hand-reviewed artifact.
Pressed and dragged lens rows are captured from the post-action visual bounding
box clip, not from `element.screenshot()`, so DOM transform differences between
Kube and Storybook do not decide the crop. `kube-reference-results.json` records
target and candidate screenshot sizes, the effective crop, action clip, pixel
threshold, diff ratio, a non-gating best phase offset, and pointer action
metrics so geometry, capture, background phase, material, and filter regressions
can be separated.
For the magnifying-glass target, the script also asserts the SVG filter contract:
the candidate must expose the same two-pass displacement pipeline, image count,
map count, and displacement scales before pixels are compared. This contract is
checked for idle, pressed, and dragged magnifying-glass captures.
The interactive lens screenshots and pointer action metrics are both hard
assertions, so press and drag cannot silently stop working or drift visually.
`pnpm test:kube-reference:strict` sets `KUBE_STRICT_INTERACTIVE=1` and preserves
the release-candidate target for the Kube replica work. The current measured gaps
and threshold-tightening plan are tracked in `docs/kube-parity-gate.md`. Strict
mode retries the same live-reference capture once after failure so a transient
Kube page or network sample does not fail CI; thresholds and real pointer input
stay unchanged.
`pnpm test:kube-reference:exact` additionally sets `KUBE_MAX_DIFF_RATIO=0`,
`KUBE_PIXEL_DELTA_THRESHOLD=0`, and `KUBE_EXACT_PARITY=1`. It is the final
acceptance target for 1:1 Kube parity, not a release gate while the measured
diff remains above zero, and it is not retried.
Those hard metrics include the Kube-derived water-drop rule that press expands
both axes, while drag is taller and narrower than press. The comparison script
also compares candidate action metrics against the live Kube target with explicit
per-metric tolerances.
The script waits for observable pointer-action geometry before capture instead
of trusting a fixed timeout. This avoids a bad flaky pattern: pressing the real
reference page during hydration or animation startup and measuring the resting
box as if the interaction had failed.

`pnpm test:docs` verifies the open-source repository contract: required GitHub
templates, registry files, docs, attributions, testing notes, and package scripts.

`pnpm test:research` verifies the structured external-reference provenance in
`docs/reference-provenance.json`. It keeps implementation references, visual
references, licenses, inspected commits, required docs, and the "no copied
third-party source" constraint reviewable. By default it is local and stable for
CI. Run `CHECK_REMOTE_REFS=1 pnpm test:research` during manual release review to
verify pinned commits against public remotes.

`pnpm test:component-coverage` verifies that every implemented component in
`docs/component-inventory.json` is imported and exercised in
`tests/components.test.tsx`. It exists because a source file, story, and registry
shim are not enough to prove a component has behavior coverage.

`pnpm test:visual-docs` verifies `docs/visual-state-coverage.json` against the
component inventory. Every implemented component must be assigned to one visual
state profile, the profile must match its inventory category, the Storybook file
must exist, and each profile must include material-mode, environment, light,
dark, high contrast, reduced motion, and mobile review coverage.
It also runs `pnpm audit:visual-docs` with the current threshold so the
maintainer sees the component coverage, profile contract, story evidence,
reference evidence, and `visual-docs-score` in one place.

`pnpm test:package` builds the package and verifies the publish contract:
CommonJS and ESM entries, type declarations, CSS exports, `sideEffects`, npm
publish access, package file whitelist, React peer dependencies, the
`@hashintel/refractive` dependency, generated CSS/type outputs, and every
implemented component export listed in `docs/component-inventory.json`. A
component cannot be marked implemented if it disappears from the ESM, CommonJS,
or TypeScript declaration package output.

The physical unit tests intentionally exercise pure functions before UI:

- `tests/displacement-map.test.ts` samples generated RGBA displacement and
  specular maps so capsule edge direction, neutral center behavior, and pixel
  ratio clamping stay deterministic. It also locks the reference lens map
  dimensions to `210x150` for magnification and `420x300` for displacement and
  specular maps, matching the live reference assets.
- `tests/edge-mask.test.ts` verifies edge-only refraction and clean-center
  recovery.
- `tests/elasticity.test.ts` verifies bounded pointer-driven scaling and
  translation.
- `tests/refraction-physics.test.ts` verifies optical ranges, filter geometry,
  foreground layering, focus material behavior, and Kube reference pipeline
  assumptions.
