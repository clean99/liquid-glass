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
