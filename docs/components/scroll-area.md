# LiquidScrollArea

`LiquidScrollArea` creates a bounded scroll region with Liquid-compatible surface styling.

## Status

- Inventory: `scroll-area`, implemented
- Export: `LiquidScrollArea`
- Source: `src/components/LiquidScrollArea.tsx`
- Story: `stories/LiquidFoundation.stories.tsx`
- Registry item: `registry/components/liquid-scroll-area.json`
- Visual profile: `layout`
- npm package: not published to npm yet.

## Usage

```tsx
import { LiquidScrollArea } from "@clean99/liquid-glass";

export function Example() {
  return (
    <LiquidScrollArea aria-label="Scrollable release notes" maxHeight="12rem">
      <p>Long release notes...</p>
    </LiquidScrollArea>
  );
}
```

## Anatomy

The wrapper applies max height and overflow behavior while keeping children in the readable content layer.

| Public part        | Role                                                                     |
| ------------------ | ------------------------------------------------------------------------ |
| `LiquidScrollArea` | Exported component or helper from `src/components/LiquidScrollArea.tsx`. |

## API

| API surface             | Notes                                                                          |
| ----------------------- | ------------------------------------------------------------------------------ |
| `LiquidScrollAreaProps` | Public TypeScript surface exported from `src/components/LiquidScrollArea.tsx`. |

The component also accepts the native HTML attributes documented by its source
props type. Local material settings follow the same rules as `LiquidSurface`
when the implementation renders a Liquid surface.

## Visual States

The layout profile expects dense content, overflow, nested surface, responsive, material modes, and environment coverage.

Storybook coverage comes from `stories/LiquidFoundation.stories.tsx`. The component is assigned
to the `layout` profile in `docs/visual-state-coverage.json`.

## Accessibility

Give standalone scroll regions an accessible label and avoid hiding essential content behind tiny scroll boxes.

## Verification

- `tests/components.test.tsx` exercises the implemented component surface.
- `stories/LiquidFoundation.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-scroll-area.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
