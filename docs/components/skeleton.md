# LiquidSkeleton

`LiquidSkeleton` renders a loading placeholder using Liquid-compatible radius and shimmer styling.

## Status

- Inventory: `skeleton`, implemented
- Export: `LiquidSkeleton`
- Source: `src/components/LiquidSkeleton.tsx`
- Story: `stories/LiquidFoundation.stories.tsx`
- Registry item: `registry/components/liquid-skeleton.json`
- Visual profile: `feedback`
- npm package: not published to npm yet.

## Usage

```tsx
import { LiquidSkeleton } from "@clean99/liquid-glass";

export function Example() {
  return <LiquidSkeleton aria-label="Loading profile" />;
}
```

## Anatomy

It is a single placeholder block. Size comes from className or style passed by the caller.

| Public part      | Role                                                                   |
| ---------------- | ---------------------------------------------------------------------- |
| `LiquidSkeleton` | Exported component or helper from `src/components/LiquidSkeleton.tsx`. |

## API

| API surface           | Notes                                                                        |
| --------------------- | ---------------------------------------------------------------------------- |
| `LiquidSkeletonProps` | Public TypeScript surface exported from `src/components/LiquidSkeleton.tsx`. |

The component also accepts the native HTML attributes documented by its source
props type. Local material settings follow the same rules as `LiquidSurface`
when the implementation renders a Liquid surface.

## Visual States

The feedback profile expects default, loading, empty, dismissible, live-region, material modes, and environment coverage where applicable.

Storybook coverage comes from `stories/LiquidFoundation.stories.tsx`. The component is assigned
to the `feedback` profile in `docs/visual-state-coverage.json`.

## Accessibility

Skeletons should not be the only loading announcement. Pair long loading states with text or live-region status when needed.

## Verification

- `tests/components.test.tsx` exercises the implemented component surface.
- `stories/LiquidFoundation.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-skeleton.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
