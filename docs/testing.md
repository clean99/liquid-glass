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

`pnpm test:docs` verifies the open-source repository contract: required GitHub
templates, registry files, docs, attributions, testing notes, and package scripts.

The physical unit tests intentionally exercise pure functions before UI:

- `tests/edge-mask.test.ts` verifies edge-only refraction and clean-center
  recovery.
- `tests/elasticity.test.ts` verifies bounded pointer-driven scaling and
  translation.
- `tests/refraction-physics.test.ts` verifies optical ranges, filter geometry,
  foreground layering, focus material behavior, and Kube reference pipeline
  assumptions.
