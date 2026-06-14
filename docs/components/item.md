# LiquidItem

`LiquidItem` renders a reusable display row with optional interactive material treatment.

## Status

- Inventory: `item`, implemented
- Export: `LiquidItem`
- Source: `src/components/LiquidItem.tsx`
- Story: `stories/LiquidFoundation.stories.tsx`
- Registry item: `registry/components/liquid-item.json`
- Visual profile: `display`
- npm package: not published to npm yet.

## Usage

```tsx
import { LiquidItem } from "@clean99/liquid-glass";

export function Example() {
  return <LiquidItem interactive>Open command palette</LiquidItem>;
}
```

## Anatomy

The root is an element wrapper with Liquid item classes. Interactive mode changes presentation but does not invent command semantics.

| Public part  | Role                                                               |
| ------------ | ------------------------------------------------------------------ |
| `LiquidItem` | Exported component or helper from `src/components/LiquidItem.tsx`. |

## API

| API surface       | Notes                                                                    |
| ----------------- | ------------------------------------------------------------------------ |
| `LiquidItemProps` | Public TypeScript surface exported from `src/components/LiquidItem.tsx`. |

The component also accepts the native HTML attributes documented by its source
props type. Local material settings follow the same rules as `LiquidSurface`
when the implementation renders a Liquid surface.

## Visual States

The display profile expects default, variant, long content, nested surface, material modes, and environment coverage.

Storybook coverage comes from `stories/LiquidFoundation.stories.tsx`. The component is assigned
to the `display` profile in `docs/visual-state-coverage.json`.

## Accessibility

Use a real button or anchor when the item performs an action or navigation. Interactive styling alone is not semantics.

## Verification

- `tests/components.test.tsx` exercises the implemented component surface.
- `stories/LiquidFoundation.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-item.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
