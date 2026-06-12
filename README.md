# @clean99/liquid-glass

Refractive Liquid Glass components for React, built on `@hashintel/refractive` with accessible fallbacks.

`@clean99/liquid-glass` is a small open-source design system for building Apple-inspired Liquid Glass interfaces on the web. It provides typed React components, CSS tokens, Storybook demos, browser behavior checks, package tests, and conservative fallback materials. The refraction engine is delegated to `@hashintel/refractive`; this project owns the component API, accessibility contract, design tokens, fallback strategy, and integration tests.

The goal is not generic glassmorphism. The library treats Liquid Glass as an optical material with clear foreground content, capped enhanced surfaces, reduced-motion and reduced-transparency support, and browser-specific fallback behavior.

## Installation

```sh
pnpm add @clean99/liquid-glass
```

`@hashintel/refractive` is included as a package dependency. React is a peer dependency:

```sh
pnpm add react react-dom
```

## Quick Start

```tsx
"use client";

import { LiquidButton, LiquidCard, LiquidProvider } from "@clean99/liquid-glass";
import "@clean99/liquid-glass/styles.css";

export function Example() {
  return (
    <LiquidProvider defaultMode="auto" maxEnhancedSurfaces={6}>
      <LiquidCard>
        <h2>Frontend Systems</h2>
        <p>Reliable UI architecture with readable Liquid Glass fallbacks.</p>
        <LiquidButton>Read Writing</LiquidButton>
      </LiquidCard>
    </LiquidProvider>
  );
}
```

## Repository Scripts

```sh
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test:docs
pnpm test:inventory
pnpm test:unit
pnpm test:storybook
pnpm build
pnpm test:package
pnpm ci
```

Storybook runs at `http://localhost:6006`.

## Browser Support

| Browser                   | Default behavior                     | Notes                                                                  |
| ------------------------- | ------------------------------------ | ---------------------------------------------------------------------- |
| Chrome / Chromium desktop | Enhanced when capability checks pass | Uses `@hashintel/refractive` through `LiquidSurface` only.             |
| Chrome / Chromium mobile  | Fallback by default                  | Mobile can be forced, but enhanced surfaces are intentionally limited. |
| Safari / iOS Safari       | Fallback or solid                    | WebKit paths are treated as first-class fallback targets.              |
| Firefox                   | Fallback or solid                    | Layout and accessibility must work without SVG backdrop refraction.    |
| Reduced transparency      | Solid                                | Readability wins over visual effect.                                   |
| High contrast             | Higher contrast fallback             | Borders and fill are strengthened through CSS.                         |

## Enhanced, Fallback, Solid, Off

```ts
type LiquidMode = "auto" | "enhanced" | "fallback" | "solid" | "off";
```

- `auto`: conservative default. Enhanced mode is enabled only when runtime checks pass.
- `enhanced`: requests real refraction, but still falls back if unsupported.
- `fallback`: translucent material with blur, saturation, edge, highlight, and shadow.
- `solid`: opaque readable material for reduced transparency and high-risk contexts.
- `off`: no glass treatment beyond structural layout classes.

Users can force a global mode through `LiquidProvider` or `localStorage`:

```ts
localStorage.setItem("clean99-liquid-glass-mode", "fallback");
```

## Next.js Usage

Use components from a client boundary and import CSS once:

```tsx
"use client";

import { LiquidLink, LiquidNav, LiquidProvider } from "@clean99/liquid-glass";
import "@clean99/liquid-glass/styles.css";

export function SiteChrome() {
  return (
    <LiquidProvider defaultMode="auto" disableOnMobile>
      <LiquidNav aria-label="Primary navigation">
        <LiquidLink href="/">Home</LiquidLink>
        <LiquidLink href="/writing/">Writing</LiquidLink>
      </LiquidNav>
    </LiquidProvider>
  );
}
```

For static export, avoid Node-only logic in component code. Capability detection runs after hydration and starts from a conservative fallback snapshot.

## Component API

Implemented components:

- `LiquidProvider`
- `LiquidSurface`
- `FallbackGlassSurface`
- `LiquidAccordion`
- `LiquidAlert`
- `LiquidAlertTitle`
- `LiquidAlertDescription`
- `LiquidAspectRatio`
- `LiquidAvatar`
- `LiquidAvatarImage`
- `LiquidAvatarFallback`
- `LiquidBadge`
- `LiquidBreadcrumb`
- `LiquidButton`
- `LiquidButtonGroup`
- `LiquidCheckbox`
- `LiquidCollapsible`
- `LiquidCollapsibleTrigger`
- `LiquidCollapsibleContent`
- `LiquidDirection`
- `LiquidEmpty`
- `LiquidIconButton`
- `LiquidDialog`
- `LiquidDialogTrigger`
- `LiquidDialogContent`
- `LiquidDialogTitle`
- `LiquidDialogDescription`
- `LiquidDialogClose`
- `LiquidField`
- `LiquidLabel`
- `LiquidInput`
- `LiquidInputGroup`
- `LiquidTextarea`
- `LiquidFieldDescription`
- `LiquidFieldError`
- `LiquidHoverCard`
- `LiquidHoverCardTrigger`
- `LiquidHoverCardContent`
- `LiquidItem`
- `LiquidKbd`
- `LiquidLens`
- `LiquidSearchBox`
- `LiquidNativeSelect`
- `LiquidPagination`
- `LiquidPaginationList`
- `LiquidPaginationItem`
- `LiquidPaginationLink`
- `LiquidPaginationPrevious`
- `LiquidPaginationNext`
- `LiquidProgress`
- `LiquidRadioGroup`
- `LiquidScrollArea`
- `LiquidPopover`
- `LiquidPopoverTrigger`
- `LiquidPopoverContent`
- `LiquidPopoverClose`
- `LiquidSeparator`
- `LiquidSheet`
- `LiquidSheetTrigger`
- `LiquidSheetContent`
- `LiquidSheetTitle`
- `LiquidSheetDescription`
- `LiquidSheetClose`
- `LiquidSkeleton`
- `LiquidSpinner`
- `LiquidSwitch`
- `LiquidSlider`
- `LiquidMusicPlayerBar`
- `LiquidTable`
- `LiquidTableHeader`
- `LiquidTableBody`
- `LiquidTableRow`
- `LiquidTableHead`
- `LiquidTableCell`
- `LiquidCard`
- `LiquidPill`
- `LiquidToggle`
- `LiquidNav`
- `LiquidSegmentedControl`
- `LiquidTabs`
- `LiquidTooltip`
- `LiquidTooltipTrigger`
- `LiquidTooltipContent`
- `LiquidToolbar`
- `LiquidLink`
- `LiquidTypography`

Coverage against shadcn/ui-style primitives is tracked in `docs/component-inventory.json`. Implemented rows are verified by `pnpm test:inventory`.

The current shadcn/ui component baseline is stored in `docs/shadcn-parity.json`.
`pnpm test:inventory` fails if the inventory misses a baseline entry.

`LiquidSurface` is the only component abstraction that selects the render engine. Higher-level components compose it instead of importing `@hashintel/refractive` directly.

Kube-aligned primitives:

- `LiquidLens`: transparent capsule lens tuned for high-contrast refraction targets.
- `LiquidSearchBox`: native search input wrapped in a refractive pill surface.
- `LiquidSwitch`: semantic switch with refraction only on the thumb.
- `LiquidSlider`: native range input with refraction only on the thumb.
- `LiquidMusicPlayerBar`: refractive player plate with foreground metadata outside the displacement layer.

## Design Tokens

CSS token exports:

```css
@import "@clean99/liquid-glass/tokens.css";
@import "@clean99/liquid-glass/styles.css";
```

Core tokens include `--lg-bg`, `--lg-bg-2`, `--lg-text`, `--lg-text-muted`, `--lg-glass-fill`, `--lg-glass-border`, `--lg-glass-highlight`, `--lg-glass-edge`, `--lg-glass-shadow`, `--lg-accent`, `--lg-accent-2`, radius tokens, and `--lg-ease-apple`.

The font stack intentionally uses system fonts:

```css
-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial,
"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
```

## Theming

The package supports system color scheme and explicit theme scopes:

```tsx
<div data-lg-theme="dark">
  <LiquidButton>Dark material</LiquidButton>
</div>
```

## Accessibility

- Interactive components use native buttons or anchors by default.
- Dialog uses the native `<dialog>` element, labelled content, and native cancel/close events.
- Field controls use native `input`, `textarea`, `label`, and alert semantics.
- `LiquidToggle` uses `aria-pressed`.
- `LiquidNav` and `LiquidToolbar` require accessible labels.
- `LiquidSegmentedControl` uses `radiogroup` / `radio`.
- `LiquidTabs` uses `tablist` / `tab` / `tabpanel`, roving tab index, Home/End, and arrow-key navigation.
- `LiquidAccordion` uses native trigger buttons, `aria-expanded`, labelled region panels, and Arrow/Home/End focus movement.
- Disabled controls suppress interaction and expose disabled state.
- Focus-visible deepens and scales the material instead of drawing hard white/black rings.
- Reduced transparency resolves to solid mode.

## Performance

- Enhanced refraction is opt-in through runtime capability checks.
- `maxEnhancedSurfaces` limits expensive surfaces.
- Mobile enhanced mode is disabled by default.
- Foreground content is not placed inside a distorted filter layer.
- The package is tree-shakable and exports CSS separately.
- Avoid enhanced mode for article bodies, long lists, code blocks, and tables.

## Testing

The repository includes unit, component, SSR, CSS contract, Storybook behavior, real drag animation, kube-reference, and package output checks.

```sh
pnpm lint
pnpm typecheck
pnpm test:docs
pnpm test:inventory
pnpm test:unit
pnpm test:storybook
pnpm test:kube-reference
pnpm build
pnpm test:package
```

`test:storybook` builds Storybook, opens stories in Chromium, checks enhanced mode contracts, focus/hover/active behavior, and records real pointer-driven drag frames for the draggable lens board.

## shadcn-style Registry

This repository includes a root `registry.json`, a flat `liquid-glass.json`, and a package-local `registry/liquid-glass.json`. It is intentionally source-readable: consumers can inspect the components, tokens, and examples without depending on a private monorepo layout.

The docs gate verifies the registry files stay present and equivalent.

## Documentation Map

- `docs/api-overview.md`: public API shape and mode model.
- `docs/component-inventory.md`: implemented and planned component inventory.
- `docs/optics-architecture.md`: physical invariants and engine boundaries.
- `docs/reference-research.md`: Kube, rdev, and registry research notes.
- `docs/testing.md`: local and CI validation strategy.
- `docs/open-source-release.md`: release, Pages, and rollback checklist.

## Known Limitations

- `asChild` is accepted on `LiquidSurface` but not implemented yet.
- True refraction is currently limited to Chrome/Chromium capability checks.
- Safari and Firefox are first-class fallback targets, not enhanced targets.
- The experimental two-pass reference lens engine is shipped for research but the default enhanced path remains `@hashintel/refractive`.

## Roadmap

- Publish to npm after API review.
- Add copyable shadcn registry items per component.
- Add more navigation and disclosure primitives.
- Add build-time generated filter presets.
- Track Safari and Firefox support as platform capabilities evolve.

## License and Attribution

MIT. See `LICENSE` and `ATTRIBUTIONS.md`.
