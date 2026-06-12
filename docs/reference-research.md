# Reference Research

This project studies public Liquid Glass implementations, but it does not copy
third-party source into the package.

## Kube Liquid Glass Article

Chris Feijoo's Liquid Glass article is the visual and behavioral reference for
the component demos. The observable target is:

- strong edge refraction on high-contrast backgrounds,
- frosted center material,
- readable foreground text and icons,
- focus/active states that scale and deepen the material,
- draggable lens demos that update through real pointer movement,
- restrained highlights instead of plastic white borders.

The comparison script `scripts/compare-kube-reference.mjs` opens the public page,
captures target sections, captures local Storybook stories, and compares pixels.
This is intentionally a regression gate, not a manual screenshot review.

## rdev/liquid-glass-react

The repository `rdev/liquid-glass-react` was inspected at commit
`ac48eab18d1f7f444ae30002d240cae29c863a21` under its MIT license.

Useful implementation patterns:

- SVG filters should separate the edge mask from the clean center.
- RGB channel displacement can create optional chromatic aberration at the bevel.
- Rounded-rect SDF and `smoothStep` are a good way to generate continuous
  displacement maps.
- `mouseContainer`, global mouse position, and explicit pointer offsets are useful
  for demos where the lens must follow real drag input.
- Elasticity should be a small interaction parameter, not a global animation that
  runs for every surface.

This research is expanded in `docs/rdev-liquid-glass-react.md`. The concrete
takeaway is now represented by `sampleLiquidEdgeMask()` and
`resolveLiquidElasticResponse()` instead of copied implementation code.

Rejected patterns:

- Opaque baked displacement-map data URLs are not source-readable enough for this
  package.
- A single component that owns API, engine, pointer math, and styling is too hard
  to test and document.
- Browser fallbacks cannot rely on user-agent checks alone.
- Foreground content must not sit inside the filtered layer.

## shadcn/ui Registry Pattern

The repository keeps a source-readable registry entry so consumers can inspect
examples and design tokens before installing. The registry is not a replacement
for the package build; it is an open-source discovery layer.

Registry files:

- `registry.json`
- `liquid-glass.json`
- `registry/liquid-glass.json`

The two item files are kept equivalent so the repository works both as a package
source and as a flat registry-style URL target.

## What We Will Keep Measuring

- Pixel distance from the Kube reference components.
- Pointer-driven drag frames, not inferred drag state.
- Focus material growth and frosted depth.
- No hard outline rings for focus.
- No artificial crosshatch texture.
- Foreground layer stays undistorted.
