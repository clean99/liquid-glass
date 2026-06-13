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

The results JSON also records `diffDiagnostics`: vertical bands, horizontal
bands, radial center/rim regions, and the worst region by diff ratio. That keeps
exact-parity work grounded in measurable failure classes such as bottom
highlight, outer rim material, center background phase, or horizontal crop drift
instead of subjective screenshot review.

## Representative Strict Measurement

Measured locally on 2026-06-13 against `https://kube.io/blog/liquid-glass-css-svg/`.
Live-page interaction sampling can move a few pixels between runs, so this table
is a representative strict gate sample rather than a promise of bit-stable
metrics.

| Reference                | Diff ratio | Best phase | Phase diff | Threshold | Mode |
| ------------------------ | ---------: | ---------- | ---------: | --------: | ---- |
| magnifying-glass         |     0.2007 | `0,-1`     |     0.1908 |    0.2400 | gate |
| magnifying-glass-pressed |     0.3818 | `0,-2`     |     0.3674 |    0.4050 | gate |
| magnifying-glass-dragged |     0.3921 | `-2,-1`    |     0.3775 |    0.4550 | gate |
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
- the pressed lens uses a flatter local droplet scale than the dragged state and
  keeps its height growth near the middle of recent local and CI Kube samples,
  matching Kube's water-drop interaction shape without changing the idle lens
  contract.
- the pressed action metric guard allows `5px` width-delta and `7px`
  height-delta variance because the live Kube page has recently sampled between
  roughly `17px` and `21px` of width growth and `15px` and `21px` of height
  growth during press deformation; the screenshot gate remains unchanged.
- the dragged action metric guard allows `8px` height-delta and `9px`
  width-delta variance for the same live-page sampling reason; it is still only
  a capture sanity check before the screenshot gate runs.
- pressed and dragged screenshots are captured from the post-action visual
  bounding box clip. This removed a false mismatch from `element.screenshot()`
  using different target and candidate transform boxes.
- the comparison now records a non-gating best phase offset. Searchbox, switch,
  and slider align at `0,0`; the lens interaction rows improve only modestly
  after tiny offsets, so the remaining gap is material and optical response, not
  just a bad screenshot crop.
- Kube demo image assets are locked in `stories/kube-reference-assets.ts` after
  Chrome/CDP sampling of the public page. Storybook serves stable local fixture
  paths from `stories/assets/kube/`, while the original Unsplash source URLs
  remain recorded for attribution and provenance. `stories/assets/kube/manifest.json`
  locks the fixture dimensions and sha256 hashes. Generated or synthetic
  stand-ins are not accepted by the e2e/provenance gates.
- Kube same-origin SVG filter map PNGs are also locked under
  `stories/assets/kube/maps/` and recorded in the same manifest. The maps are
  reference-only fixtures, not runtime shortcuts. They give the exact gate a
  concrete map contract for deciding whether the remaining diff is optical-map
  shape, material/specular response, background phase, or interaction geometry.

This proves five things:

- The static searchbox, switch, and slider stories are already within the current
  screenshot budget, so their thresholds are ratcheted down to `0.0200`.
- The static magnifying glass passes a loose gate, but it is still visually far
  from pixel parity. Its threshold is ratcheted from `0.3000` to `0.2400`, which
  is still not the final target.
- The pressed and dragged water-drop states now pass the current hard gate, but
  the thresholds are still loose while the fixture moves toward tighter pixel
  parity. Pressed is now gated at `0.4050`; dragged is gated at `0.4550`.
  This budget covers Chromium CI sampling variance for the interactive lens
  only; searchbox, switch, and slider remain ratcheted at `0.0200`. The lens
  rows must not be described as 100% complete.
- GitHub Actions failures emit `Kube reference parity failed` for completed
  threshold failures and `Kube reference capture failed` when an individual
  reference crashes before comparison. The workflow also writes a step summary
  with every completed row, so failures stay diagnosable from the public run page
  even when full logs are unavailable.
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

Recent sampled `pnpm test:kube-reference:exact` result on 2026-06-13:

| Reference                | Exact diff ratio | Best phase | Phase diff |
| ------------------------ | ---------------: | ---------- | ---------: |
| magnifying-glass         |           0.5240 | `0,-1`     |     0.5133 |
| magnifying-glass-pressed |           0.7153 | `-1,1`     |     0.6874 |
| magnifying-glass-dragged |           0.6326 | `-1,0`     |     0.6342 |
| searchbox                |           0.1138 | `0,0`      |     0.1150 |
| switch                   |           0.0904 | `0,0`      |     0.0934 |
| slider                   |           0.0750 | `0,0`      |     0.0763 |

The exact command is still non-gating and can also fail earlier when the live
Kube page does not produce a valid interaction deformation sample. That is still
a failed exact-parity run, not release readiness.

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
