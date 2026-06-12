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

The magnifying-glass gate also reads the live SVG filter contract. The local
reference lens must use the same observable two-pass structure as the target:
three `feImage` inputs, two `feDisplacementMap` stages, source magnification
before bevel displacement, and matching displacement scales. This catches the
failure mode where a screenshot happens to look passable while the underlying
optics are still a one-pass or wrong-map implementation.

The generated default map sizes follow the live reference assets:

- `magnifying_displacement_map`: `210x150`,
- `displacement_map`: `420x300`,
- `specular_layer`: `420x300`.

`bezelWidth` remains a physical scale input, but the flat map falloff uses the
full `75px` capsule radius for the reference lens. Keeping those fields separate
prevents the displacement map from collapsing into an unrealistically narrow
edge band.

The same script also performs real pointer actions for the magnifying-glass demo:

- press the lens and capture the water-drop scale state,
- drag the lens across text edges and capture the held drag state,
- compare those interactive screenshots against the matching Storybook board.

The static and draggable Storybook stories now share the same Kube-sized board
fixture. That removes synthetic CSS artwork as a hidden variable: if the
interactive rows drift, the remaining gap is in the lens material, the transform
coordinate system, or the droplet response, not in a different background.

This does not replace full visual parity. It prevents a weaker failure mode:
passing the static screenshot while breaking the interaction that makes the
glass feel physical. The pressed and dragged screenshots are currently
report-only while the demo artwork and droplet deformation are still converging;
their action metrics are hard assertions, and the pixel rows are intended to
become hard gates once the local board matches the reference fixture.

Current measured interaction contract:

- press state expands both axes, matching the Kube water-drop response instead
  of flattening the capsule,
- drag state becomes taller and narrower than press while preserving pointer
  travel,
- target press sample is approximately `+22px` width and `+22px` height,
- target drag sample is approximately `+11px` width and `+25px` height.

The local `LiquidLensDropletPhase` model intentionally separates `pressed` and
`dragging`. A boolean pressed state was not enough: it made the drag handle keep
the same wide shape after movement, which is not what the reference component
does under real pointer input.

`scripts/compare-kube-reference.mjs` now treats these interaction metrics as a
hard contract even while the interactive pixels remain report-only. Candidate
press and drag metrics must stay within the configured tolerances of the live
Kube target, so future visual tuning cannot silently regress the physical
behavior.

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
- Pressed and dragged lens screenshots from real pointer input.
- Pointer-driven drag frames, not inferred drag state.
- Focus material growth and frosted depth.
- No hard outline rings for focus.
- No artificial crosshatch texture.
- Foreground layer stays undistorted.
