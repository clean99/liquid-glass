# LiquidSeparator

`LiquidSeparator` renders decorative or semantic separators in horizontal or vertical orientation.

## Status

- Inventory: `separator`, implemented
- Export: `LiquidSeparator`
- Source: `src/components/LiquidSeparator.tsx`
- Story: `stories/LiquidFoundation.stories.tsx`
- Registry item: `registry/components/liquid-separator.json`
- Visual profile: `layout`
- npm package: not published to npm yet.

## Usage

```tsx
import { LiquidSeparator } from "@clean99/liquid-glass";

export function Example() {
  return <LiquidSeparator decorative={false} orientation="vertical" />;
}
```

## Anatomy

The root carries orientation classes and can be decorative or semantic depending on props.

| Public part       | Role                                                                    |
| ----------------- | ----------------------------------------------------------------------- |
| `LiquidSeparator` | Exported component or helper from `src/components/LiquidSeparator.tsx`. |

## API

| API surface            | Notes                                                                         |
| ---------------------- | ----------------------------------------------------------------------------- |
| `LiquidSeparatorProps` | Public TypeScript surface exported from `src/components/LiquidSeparator.tsx`. |

The component also accepts the native HTML attributes documented by its source
props type. Local material settings follow the same rules as `LiquidSurface`
when the implementation renders a Liquid surface.

## Visual States

The layout profile expects dense content, overflow, nested surface, responsive, material modes, and environment coverage.

Storybook coverage comes from `stories/LiquidFoundation.stories.tsx`. The component is assigned
to the `layout` profile in `docs/visual-state-coverage.json`.

## Accessibility

Use decorative separators for visual grouping only. Use non-decorative separators when the separator communicates structure.

## Verification

- `tests/components.test.tsx` exercises the implemented component surface.
- `stories/LiquidFoundation.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-separator.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
