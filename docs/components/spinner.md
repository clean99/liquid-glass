# LiquidSpinner

`LiquidSpinner` renders an inline loading spinner with optional visible label or decorative mode.

## Status

- Inventory: `spinner`, implemented
- Export: `LiquidSpinner`
- Source: `src/components/LiquidSpinner.tsx`
- Story: `stories/LiquidFoundation.stories.tsx`
- Registry item: `registry/components/liquid-spinner.json`
- Visual profile: `feedback`
- npm package: not published to npm yet.

## Usage

```tsx
import { LiquidSpinner } from "@clean99/liquid-glass";

export function Example() {
  return <LiquidSpinner label="Loading stories" />;
}
```

## Anatomy

The root is an inline spinner element. Decorative mode suppresses the status label when another label already exists.

| Public part     | Role                                                                  |
| --------------- | --------------------------------------------------------------------- |
| `LiquidSpinner` | Exported component or helper from `src/components/LiquidSpinner.tsx`. |

## API

| API surface          | Notes                                                                       |
| -------------------- | --------------------------------------------------------------------------- |
| `LiquidSpinnerProps` | Public TypeScript surface exported from `src/components/LiquidSpinner.tsx`. |

The component also accepts the native HTML attributes documented by its source
props type. Local material settings follow the same rules as `LiquidSurface`
when the implementation renders a Liquid surface.

## Visual States

The feedback profile expects default, loading, empty, dismissible, live-region, material modes, and environment coverage where applicable.

Storybook coverage comes from `stories/LiquidFoundation.stories.tsx`. The component is assigned
to the `feedback` profile in `docs/visual-state-coverage.json`.

## Accessibility

Use `label` for standalone loading indicators. Use decorative mode only when nearby text already announces the loading state.

## Verification

- `tests/components.test.tsx` exercises the implemented component surface.
- `stories/LiquidFoundation.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-spinner.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
