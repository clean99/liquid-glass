# Reference Research

This project studies public Liquid Glass implementations, but it does not copy
third-party source into the package.

All external research sources are tracked in `docs/reference-provenance.json` and
checked by `pnpm test:research`. That file is the source of truth for inspected
commits, licenses, attribution docs, and whether any third-party source was
copied. The allowed copied-source state is `false`.

## Kube Liquid Glass Article

Reference URL: `https://kube.io/blog/liquid-glass-css-svg/`.

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

Chrome/CDP asset sampling on the public page confirmed the Storybook reference
fixtures should use the same demo images as Kube rather than generated or
synthetic stand-ins. The locked Storybook fixture paths and source URLs live in
`stories/kube-reference-assets.ts`; the captured file dimensions and sha256
hashes live in `stories/assets/kube/manifest.json`. The local files live under
`stories/assets/kube/` and are excluded from the npm package by `package.json`
`files`.

The Kube article loads Inter from `https://rsms.me/inter/`. Storybook now serves
a locked local `InterVariable.woff2` fixture from `stories/assets/kube/fonts/`
for reference screenshots only, and the comparison script waits for
`document.fonts.status === "loaded"` before taking Kube and candidate
screenshots. This keeps text-edge diffs attributable to real layout and material
differences instead of font fallback timing.

`pnpm test:kube-assets` opens the rendered public page, clicks the Searchbox
`Use image background` control, reads CSS backgrounds, `<img>` sources, and SVG
`<image>`/`<feImage>` hrefs, and CDP network response URLs, then compares those
live demo URLs against the manifest before `pnpm test:kube-reference` captures
pixels. The URL gate covers the loaded demo photos, album-art fixtures, Kube
same-origin SVG filter maps, and the Inter variable font requested by the public
page. It also fails if a rendered CSS demo background is not covered by the
manifest or an explicit generated fallback entry. The Searchbox, Switch, and
Slider default control background has no raster URL, so
`stories/assets/kube/reference-captures/control-grid-background.png` is a live
background screenshot fixture. The asset gate re-captures those three public
demo backgrounds with children hidden, records whether the fresh screenshot hash
matches the fixture, records a browser pixel-diff ratio, and hard-checks
computed CSS tokens plus a `1px` width / `2px` height capture tolerance. It does
not hard-fail live capture pixels because Linux and macOS browser raster paths
can produce byte-level PNG drift and one-pixel layout rounding for the same CSS.
`generatedFallbackAssets` is intentionally empty. If Kube has no
rendered source image for a future component state, the fallback must be a
captured/generated reference fixture with provenance instead of a synthetic
placeholder.

- Searchbox image background:
  `photo-1497250681960-ef046c08a56e?q=80&w=1600&auto=format&fit=crop`,
- Lens demo image layer:
  `photo-1579380656108-f98e4df8ea62?q=80&w=800&auto=format&fit=crop`,
- Lens page background sample:
  `photo-1688494930098-e88c53c26e3a?auto=format&q=80&fit=crop&w=1400&h=1600&crop=focalpoint&fp-x=0.3&fp-y=0.5&fp-z=1`.
- Lens hero inline SVG image crop:
  `photo-1688494930098-e88c53c26e3a?auto=format&q=80&fit=crop&w=400&h=700&crop=focalpoint&fp-x=0.3&fp-y=0.6&fp-z=1.9`.

The current locked fixture dimensions are `1600x2399` for the searchbox
background, `800x1200` for the magnifying-glass image layer, and `1400x1600`
for the lens page background sample. The hero inline crop is locked separately
at `400x700`, matching the live SVG `<image>` reference rather than a generated
stand-in. The images are attributed and stored only as Storybook/parity
fixtures. They are not copied into the published package.

Chrome pageAssets sampling of the public Music Player demo also captured the
rendered album-art grid from `https://is1-ssl.mzstatic.com/image/thumb/`. The
Storybook Kube Music Player reference now uses the first two visible rows as
local Storybook fixtures under `stories/assets/kube/music/` exported through
`kubeReferenceMusicAlbumAssets`. The grid keeps the Kube-observed `154px` tile,
`19px` gap, and `object-fit: cover` behavior instead of synthetic gradient cover
stand-ins. The album covers are attributed, recorded in provenance, and excluded
from the published package.

Chrome pageAssets sampling also exposed Kube same-origin SVG filter map PNGs.
Those maps are now stored under `stories/assets/kube/maps/` and exported from
`stories/kube-reference-assets.ts` as reference-only fixtures. They are not used
as runtime implementation shortcuts; they lock dimensions, source URLs, and
sha256 hashes so exact-gate failures can be classified as map shape, material,
background phase, or interaction geometry instead of subjective screenshot
judgment. The core magnifying-glass triplet is:

- `magnifying-map-q51ggw.png`: `210x150`,
- `displacement-map-w2qrsb.png`: `420x300`,
- `specular-map-w2qrsb.png`: `420x300`.

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

The magnification map is not a capsule-edge map. Sampling the live reference
shows a full rectangular center-pull field: the center is neutral
`[128,128]`, the top-left corner pulls strongly down and right, and the right
edge pulls back toward the center. That first pass zooms the source image before
the second capsule bevel pass bends the perimeter. Reusing one capsule field for
both passes creates the impossible crossing artifacts called out in review.

The specular map is also much thinner than a normal glassmorphism highlight. It
is a narrow gray capsule rim, not a white filled ring. The center is fully
transparent, pixels a few CSS pixels inside the capsule are transparent again,
and diagonal cap normals are deliberately darker. This is the difference between
a physical edge glint and a plastic outline.

Chrome/CDP sampling of the public Searchbox demo shows the focus state is a
material and scale change, not a hard ring. In the measured viewport, the
search capsule starts at `336x44.8` with `scale(0.8)`. Real click focus and text
entry expand the same wrapper to `420x56` with `scale(1)`, a `1.25x` visual
growth that preserves `outline-style: none`. Local focus states should therefore
grow and deepen frosted material while keeping readable content outside the
displacement layer; black slabs, white rings, and text shadows are regressions.

Switch and slider focus audits must measure the whole control for geometry and
the track for material. Measuring only the thumb reports a small scale such as
`0.72` or `0.68`, which proves the thumb changed but does not prove the focused
glass control grew. The current behavior gate therefore focuses the native
control path, captures `.lg-switch` and `.lg-slider` as the visual focus objects,
and separately requires the `.lg-switch__track` and `.lg-slider__track` material
layers to add frosted shadow response without black context pixels.

The same focus model applies to generic surfaces. A 2026-06-14 Storybook dev
audit reproduced the user-visible black focus regression on enhanced buttons:
the focused surface was using the bright focus fill, but it also carried the
base `--lg-surface-shadow`, whose dark-theme variant adds heavy black outer and
inner shadow. Focus now uses a dedicated blue-white lift shadow instead of the
base glass shadow, and the behavior gate records screenshot luma and dark/black
pixel ratios for button, nav, and toggle focus states.

A later 2026-06-14 Chrome/CDP pass showed the remaining Storybook focus
regression was not OTP empty focus: empty OTP and filled OTP both resolved to
white frosted material with no outline. The worse failures were generic dark
theme focus surfaces: button, toggle, nav, toolbar, and segmented control were
visibly gray because the focused capsule stayed too transparent and kept white
foreground text. Generic focus surfaces now use `--lg-control-focus-surface-strong`
plus `--lg-control-focus-text`, so focus reads as a light frosted capsule with
dark content. The `SelectAndOtp` story now starts with `123`, making the real
filled-character focus/select path part of the browser audit. The behavior gate
also requires a focused material alpha floor of `0.8`; screenshot black pixels
alone are not enough because valid dark text inside a light frosted capsule
would otherwise be misclassified as a black focus block.

The checked Searchbox image-background run also records a control contract, not
just pixels. A 2026-06-14 sample showed the local surface, glass layer, content
layer, input, and icon were `0.5px` above the live Kube geometry while the
credit and checkbox label already aligned. The Storybook anchor is now
`calc(50% + 1.5px)`, and `scripts/compare-kube-reference.mjs` hard-gates those
vertical deltas at `0.25px`. This removes one measured geometry error while the
remaining exact diff stays dominated by background/filter pixel differences.

`bezelWidth`, capsule radius, and displacement falloff are separate inputs. The
capsule radius is `75px`, but the observed bevel displacement returns to neutral
within roughly `25px` from the edge. Treating the full radius as the falloff was
a real bug: it kept pushing pixels too far into the center and made the lens
look like crossed texture instead of edge refraction.

The same script also performs real pointer actions for the magnifying-glass demo:

- press the lens and capture the water-drop scale state,
- drag the lens across text edges and capture the held drag state,
- compare those interactive screenshots against the matching Storybook board.

The static and draggable Storybook stories now share the same Kube-sized board
fixture. That removes synthetic CSS artwork as a hidden variable: if the
interactive rows drift, the remaining gap is in the lens material, the transform
coordinate system, or the droplet response, not in a different background.

The shared board still needs one deliberate distinction: the interactive
Storybook board applies an `-8px, -2px` content phase offset under the draggable
lens. Real pointer metrics already matched the public page, so moving the lens
coordinate would be the wrong fix. The phase offset changes only the
high-contrast field sampled by the active lens and moved the pressed row from
`0.4163` to `0.4148` and the dragged row from `0.4224` to `0.4142`. A larger
vertical offset (`-8px, -10px`) was tested and rejected because it regressed
pressed to `0.5173` and dragged to `0.4519`.

The draggable magnifying glass uses the same observable geometry as the public
reference: the optical body is `210x150`, and the idle visual height comes from
`scaleY(0.8)`, not from making the DOM node `120px` tall. Pressed and dragged
states change the outer optical body's scale from that baseline. The reference
CSS coordinate is `top: 19.5px`; the apparent visual top is lower only because
the scaled element uses a centered transform origin. The static comparison story
keeps its absolute visual overlay coordinate separate from the draggable CSS
coordinate so the two fixtures do not drift. The live reference keeps the same
two filter stages during active input:

- displacement thickness equivalent: `glassThickness: 88`,
- magnification thickness equivalent:
  `magnificationGlassThickness: 21.496810403025258`,
- observed idle displacement scales: `[24, 98.247...]`.

This matters because a local implementation can cheat by changing SVG
displacement without matching the water-drop geometry. Matching Kube requires
the measured filter contract plus the right water-drop geometry, material
response, and background phase.

This does not replace full visual parity. It prevents a weaker failure mode:
passing the static screenshot while breaking the interaction that makes the
glass feel physical. The pressed and dragged screenshots are now hard pixel
gates, and their action metrics remain hard assertions. The current thresholds
are still loose; future work should lower them as the local board and material
converge with the reference fixture.

Current measured interaction contract:

- press state expands both axes, matching the Kube water-drop response instead
  of flattening the capsule,
- drag state becomes taller and narrower than press while preserving pointer
  travel,
- target press samples have recently measured around `+17px` to `+21px` width
  and `+15px` to `+21px` height across local Chromium and GitHub Actions,
- target drag samples vary with the live page and have recently measured around
  `+2px` to `+17px` width and `+22px` to `+27px` height.

The local `LiquidLensDropletPhase` model intentionally separates `pressed` and
`dragging`. A boolean pressed state was not enough: it made the drag handle keep
the same wide shape after movement, which is not what the reference component
does under real pointer input.

The latest filter-contract and action-metric samples show why the shape model
cannot be a single boolean. Pressed widens toward the Kube water-drop response,
but real pointer action metrics still keep its height growth near `20px`.
Dragged relaxes much narrower and rebounds vertically after movement. A transient
pressed filter-contract sample near `scaleY(0.987)` looked plausible in
isolation, but it over-grew the candidate height and failed the ordinary Kube
action metric.

The active filter contract must be sampled before pointer cleanup. A cleanup-time
sample made Kube appear to keep the idle displacement scales during interaction,
but the live pressed and dragged states actually increase both SVG displacement
passes:

- idle: `[24, 98.2471]`,
- pressed: `[53.0098, 127.9360]`,
- dragged: roughly `[46.96, 121.75]`.

The local draggable reference now maps `pressed` and `dragging` to separate
refraction thicknesses so the candidate filter scales match the live Kube active
contract. This moved the loose pressed lens gate to `0.3061 <= 0.405` and the
dragged lens gate to `0.2491 <= 0.455` in a local 2026-06-14 run. Exact parity
still fails, so this is a real narrowing of the optical state model, not a 1:1
completion claim.

The filter-contract evidence recorded by `scripts/compare-kube-reference.mjs`
shows a real transform-ownership mismatch: the Kube target reports
`transformOwner: "parent"`, the surface's parent carries the `scaleY(0.8)`
matrix, and the filter surface itself is untransformed. A single transformed
filter surface can make action metrics look close while changing the backdrop
sampling coordinate space, so transform ownership is now a first-class
diagnostic rather than a cosmetic DOM preference.

Earlier handle/surface split experiments regressed the current Chromium pixel
gate when they also changed map loading or backdrop sampling. The older
generated/data-url experiment regressed:

- idle magnifying glass diff: `0.2000 -> 0.6977`,
- pressed magnifying glass diff: `0.4163 -> 0.7928`,
- dragged magnifying glass diff: `0.4224 -> 0.9294`.

A later 2026-06-14 retry with network-loaded Kube PNG maps still failed the
normal gate: idle magnifying glass moved to `0.3140 > 0.24`, even though pressed
(`0.3711 <= 0.405`) and dragged (`0.4304 <= 0.455`) stayed within the current
loose gates. The current implementation keeps generated local maps, but splits
only the interactive story's same-size handle and filter surface: the outer
handle owns pointer/focus transforms and the inner `LiquidLens` surface stays
untransformed. That moved pressed and dragged transform ownership to
`parent->parent` while the normal gate still passed (`pressed 0.2996 <= 0.405`,
`dragged 0.2603 <= 0.455` phase-adjusted on 2026-06-14). Contract shape alone
is still not completion; exact parity remains the judge.

`scripts/compare-kube-reference.mjs` now treats these interaction metrics and
the magnifying-glass filter contract as hard contracts. Candidate press and drag
metrics must stay within the configured tolerances of the live Kube target, every
magnifying-glass state must expose the same two-pass filter shape and
displacement scales, and pressed/dragged screenshots are pixel gates. Future
visual tuning cannot silently regress the physical behavior or hide behind a
different SVG pipeline.

The strict interaction sampler also guards the whole pointer path. A 2026-06-13
GitHub Actions sample placed Kube's dragged handle at the lower document edge
after `scrollIntoView`, leaving the drag start/end path partially outside the
`1100x760` viewport before screenshot comparison even began. The sampler now
checks the complete press/drag path, injects a temporary inert bottom spacer only
when the live page cannot scroll farther, reruns the scroll, and removes the
spacer during cleanup. This is a capture reliability fix, not a visual parity
budget change.

A later 2026-06-13 GitHub Actions sample produced an implausible dragged metric
with a large negative document-space `deltaY` after the page scroll position
jumped while the pointer was held down. Pointer movement and screenshot clips are
viewport-space operations, so the sampler now gates drag movement with viewport
`deltaX` and `deltaY` while still recording `documentDelta*` and `scrollDelta*`
fields for diagnosis. This removes the false rejection without changing any
pixel-diff budget.

Another 2026-06-13 CI sample showed a polluted Kube drag state with a huge
negative viewport and document `deltaY` while `scrollDeltaY` stayed at `0`.
That is not a parity signal: it means the live reference handle jumped outside
the capture coordinate system before a screenshot could be taken. The target
action wrapper now treats that exact implausible drag failure as recoverable,
reloads the Kube page, reacquires the demo and handle, and reruns the real
pointer path before failing the gate. The same target-page recovery covers
transient public-reference samples where press produces no deformation or drag
produces no movement after the internal pointer retries. Candidate Storybook
failures are not recovered this way; they still fail the gate.

`pnpm test:kube-reference:strict` sets `KUBE_STRICT_INTERACTIVE=1` and promotes
the release-candidate path used by CI and manual reviews. The current measured
status is documented in `docs/kube-parity-gate.md`. The command now passes, but
the remaining work is to lower thresholds toward true pixel parity rather than
claiming that the current loose gate is final quality.

Exact-parity runs also record a `thresholdSweep` for each crop. The zero
threshold remains the final acceptance target, but the sweep shows whether a
failed row is dominated by low-amplitude material/color drift or by large
localized geometry, phase, or refraction errors.

The Kube filter contract now also writes `layerTransformDelta` for the lens
rows. It parses root, parent, surface, and effective CSS transform matrices into
scale and translation metrics, then reports the maximum scale and translation
delta next to the diff rows. The 2026-06-14 exact run still fails with lens
worst regions in `lowerMid` / `bottom`, so the next implementation change should
target remaining sampling-model alignment before tuning material colors.

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
The pinned research commit and MIT license are also recorded in
`docs/reference-provenance.json`.

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
