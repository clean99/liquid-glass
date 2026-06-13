# Kube Reference Parity Gate

The Kube Liquid Glass article is the external visual reference for this package.
The comparison must use browser screenshots and real pointer actions, not manual
inspection.

## Current Gate Shape

```mermaid
flowchart TD
  A["Build package"] --> B["Build static Storybook"]
  B --> C["Open kube.io reference in Chromium"]
  B --> D["Open local Storybook stories in Chromium"]
  C --> E["Capture static sections"]
  D --> F["Capture matching local stories"]
  C --> G["Press and drag target lens with real pointer input"]
  D --> H["Press and drag local lens with real pointer input"]
  E --> I["Pixel diff"]
  F --> I
  G --> J["Action metric parity"]
  H --> J
  G --> K["Interactive pixel diff"]
  H --> K
  K --> L["Diff PNG artifact"]
```

`pnpm test:kube-reference` is the normal regression gate. It compares the static
reference components, hard-fails action metrics for the interactive lens, and
hard-fails pressed and dragged lens screenshots produced by real pointer input.

`pnpm test:kube-reference:strict` sets `KUBE_STRICT_INTERACTIVE=1` and preserves
the release-candidate command used by CI and manual reviews. The interactive
screenshots are hard gates in both commands.

`pnpm test:kube-reference:exact` is the final acceptance target. It sets
`KUBE_EXACT_PARITY=1`, `KUBE_STRICT_INTERACTIVE=1`, `KUBE_MAX_DIFF_RATIO=0`, and
`KUBE_PIXEL_DELTA_THRESHOLD=0`, then runs the same browser comparison against the
public Kube page. This command is intentionally not part of `ci` or `verify`
while the current implementation still fails exact pixel parity. It exists so
the project has a real 1:1 target instead of silently redefining success around
loose thresholds.

Each row writes target, candidate, and diff PNG artifacts under
`test-results/kube-reference/`. The diff image is generated from the same crop
used for the metric, so it is useful for diagnosing phase, material, and edge
errors without changing the gate. For pressed and dragged lens rows, the script
captures a page clip from the post-action visual bounding box instead of relying
on `element.screenshot()`, because the Kube page and local Storybook do not use
the same DOM transform structure. `kube-reference-results.json` records the
target screenshot size, candidate screenshot size, effective compare region,
diff threshold, action clip, action metrics, and a non-gating best phase offset.
The phase offset scans a small candidate-image translation window and records
which sampled offset best aligns the local crop with the Kube crop. Those fields
are required for lens work: without them a pressed-state regression can be
mistaken for a material problem when the real issue is a capture-size,
background-phase, or crop mismatch.

## Latest Measurement

Measured locally on 2026-06-13 against `https://kube.io/blog/liquid-glass-css-svg/`.

| Reference                | Diff ratio | Best phase | Phase diff | Threshold | Mode |
| ------------------------ | ---------: | ---------- | ---------: | --------: | ---- |
| magnifying-glass         |     0.2007 | `0,-1`     |     0.1908 |    0.2400 | gate |
| magnifying-glass-pressed |     0.3393 | `3,1`      |     0.3303 |    0.3750 | gate |
| magnifying-glass-dragged |     0.3845 | `-3,0`     |     0.3804 |    0.4200 | gate |
| searchbox                |     0.0180 | `0,0`      |     0.0169 |    0.0200 | gate |
| switch                   |     0.0136 | `0,0`      |     0.0132 |    0.0200 | gate |
| slider                   |     0.0163 | `0,0`      |     0.0135 |    0.0200 | gate |

This measurement includes these verified geometry fixes:

- the draggable story uses the Kube CSS coordinate `top: 19.5px`; the visual
  top becomes roughly `34.5px` only after the reference `scaleY(0.8)` transform,
- the magnification pass uses a full rectangular center-pull displacement map;
  the bevel-only capsule field is reserved for the second displacement pass,
- the specular pass uses a narrow gray rim instead of a broad white highlight.
- the specular map uses a directional rim light, so the brightest points follow
  the Kube reference's upper-right and lower-left edge response instead of
  drawing an even plastic ring around the whole capsule.
- the bevel displacement pass uses a `25px` edge falloff, not the full capsule
  radius.
- the water-drop shadow belongs to the lens surface itself; applying it
  as an outer handle `drop-shadow()` makes the material read like plastic and
  regresses the pressed/dragged screenshot rows.
- all magnifying-glass states now write a filter-contract artifact. The live
  Kube target keeps the same two-pass displacement scales during idle, pressed,
  and dragged captures, so pointer parity must be solved through geometry,
  background phase, and material response instead of fake active filter boosts.
- the draggable optical body is a single `LiquidLens` surface. Splitting pointer
  handling onto an outer wrapper and backdrop-filter onto an inner lens made the
  transformed geometry diverge from active filter sampling and regressed the
  pressed/dragged screenshots.
- the interactive Storybook board applies an `-8px, -2px` content phase offset
  while keeping the Kube lens CSS coordinate unchanged. This moves the
  high-contrast text field under the active lens without faking the lens motion
  metrics. A larger vertical shift regressed pressed and dragged screenshots, so
  the current offset is intentionally small.
- the pressed lens uses a flatter local droplet scale than the dragged state,
  matching Kube's water-drop interaction shape without changing the idle lens
  contract.
- pressed and dragged screenshots are captured from the post-action visual
  bounding box clip. This removed a false mismatch from `element.screenshot()`
  using different target and candidate transform boxes.
- the comparison now records a non-gating best phase offset. Searchbox, switch,
  and slider align at `0,0`; the lens interaction rows improve only modestly
  after tiny offsets, so the remaining gap is material and optical response, not
  just a bad screenshot crop.
- Kube demo image assets are locked in `stories/kube-reference-assets.ts` after
  Chrome/CDP sampling of the public page. The Storybook reference stories use
  the same remote Unsplash image URLs for the Searchbox photo background and
  the Lens image layer; generated or synthetic stand-ins are not accepted by the
  e2e/provenance gates.

This proves five things:

- The static searchbox, switch, and slider stories are already within the current
  screenshot budget, so their thresholds are ratcheted down to `0.0200`.
- The static magnifying glass passes a loose gate, but it is still visually far
  from pixel parity. Its threshold is ratcheted from `0.3000` to `0.2400`, which
  is still not the final target.
- The pressed and dragged water-drop states now pass the current hard gate, but
  the thresholds are still loose while the fixture moves toward tighter pixel
  parity. Pressed is now gated at `0.3750`; dragged is gated at `0.4200`.
  This budget covers Chromium CI sampling variance for the interactive lens
  only; searchbox, switch, and slider remain ratcheted at `0.0200`. The lens
  rows must not be described as 100% complete.
- The latest specular change improved the pressed screenshot but did not improve
  every lens state. That is acceptable only because the generated specular map
  is closer to the reference rim-light physics; it is still not enough for exact
  component parity.
- The final acceptance command is `pnpm test:kube-reference:exact`. Until that
  command passes, Kube parity remains incomplete regardless of the current
  release-candidate gate.

## Remaining Gap

The reference lens changes the visible material during interaction:

- the DOM body scales into a local water-drop shape,
- the material highlight follows the active capsule.

The local implementation now checks action metrics and interactive pixels by
default, but the screenshot diff is still far from true pixel parity. A correct
fix should keep changing the optical model or material rendering. Threshold
changes are acceptable only as documented CI variance budgets for interactive
captures; they are not visual completion.

Latest `pnpm test:kube-reference:exact` result on 2026-06-13:

| Reference                | Exact diff ratio | Best phase | Phase diff |
| ------------------------ | ---------------: | ---------- | ---------: |
| magnifying-glass         |           0.5240 | `0,-1`     |     0.5133 |
| magnifying-glass-pressed |           0.7101 | `0,1`      |     0.6786 |
| magnifying-glass-dragged |           0.6551 | `0,0`      |     0.6544 |
| searchbox                |           0.1138 | `0,0`      |     0.1150 |
| switch                   |           0.0904 | `0,0`      |     0.0934 |
| slider                   |           0.0750 | `0,0`      |     0.0763 |

That exact table is the acceptance blocker. Passing the normal gate only means
the current regression budget is respected.

## Next Work

1. Tighten the magnifying glass fixture so static diff can move below 0.10.
2. Replace the pressed and dragged CI variance budget with tighter thresholds
   after the fixture and material match.
3. Reduce all thresholds toward real parity after the fixture and material
   match.
4. Promote `pnpm test:kube-reference:exact` into `verify` only after it passes
   reliably on Chromium CI.
5. Keep action metrics and pixels separate. A component can move correctly while
   still looking wrong.
