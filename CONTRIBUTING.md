# Contributing

## Local Setup

```sh
pnpm install
pnpm dev
```

## Quality Gate

Before opening a pull request, run:

```sh
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:storybook
pnpm build
pnpm test:package
```

Use `pnpm test:kube-reference` when changing the optical model, lens, searchbox, switch, slider, or music player demos.

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
