# Testing

Core checks:

```sh
pnpm lint
pnpm typecheck
pnpm test:docs
pnpm test:inventory
pnpm test:unit
pnpm test:storybook
pnpm build
pnpm test:package
```

Optical checks:

```sh
pnpm test:physics
pnpm test:kube-reference
```

Visual checks:

```sh
pnpm test:visual
pnpm test:visual:update
```

The Storybook behavior test opens the built Storybook in Chromium and performs real pointer actions for the draggable lens board. The test records `requestAnimationFrame` samples and asserts pressed, dragging, and released animation states.

`pnpm test:kube-reference` captures the public Kube reference page and matching
Storybook stories. It includes static component screenshots plus
`pressed and dragged magnifying-glass screenshots` produced by real pointer input.
For the magnifying-glass target, the script also asserts the SVG filter contract:
the candidate must expose the same two-pass displacement pipeline and matching
map count before pixels are compared.
The interactive lens screenshots are report-only today, but their pointer action
metrics are hard assertions so press and drag cannot silently stop working.
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
