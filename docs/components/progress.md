# LiquidProgress

`LiquidProgress` renders a determinate progress bar with ARIA progressbar attributes.

## Status

- Inventory: `progress`, implemented
- Export: `LiquidProgress`
- Source: `src/components/LiquidProgress.tsx`
- Story: `stories/LiquidFoundation.stories.tsx`
- Registry item: `registry/components/liquid-progress.json`
- Visual profile: `feedback`
- npm package: not published to npm yet.

## Usage

```tsx
import { LiquidProgress } from "@clean99/liquid-glass";

export function Example() {
  return <LiquidProgress aria-label="Release progress" value={75} max={100} />;
}
```

## Anatomy

The root carries progressbar semantics and the inner indicator width is derived from value and max.

| Public part      | Role                                                                   |
| ---------------- | ---------------------------------------------------------------------- |
| `LiquidProgress` | Exported component or helper from `src/components/LiquidProgress.tsx`. |

## API

| API surface           | Notes                                                                        |
| --------------------- | ---------------------------------------------------------------------------- |
| `LiquidProgressProps` | Public TypeScript surface exported from `src/components/LiquidProgress.tsx`. |

The component also accepts the native HTML attributes documented by its source
props type. Local material settings follow the same rules as `LiquidSurface`
when the implementation renders a Liquid surface.

## Visual States

The feedback profile expects default, loading, empty, dismissible, live-region, material modes, and environment coverage where applicable.

Storybook coverage comes from `stories/LiquidFoundation.stories.tsx`. The component is assigned
to the `feedback` profile in `docs/visual-state-coverage.json`.

## Accessibility

Provide an accessible name and keep value/max meaningful. Use live-region text elsewhere for long-running task updates.

## Verification

- `tests/components.test.tsx` exercises the implemented component surface.
- `stories/LiquidFoundation.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-progress.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
