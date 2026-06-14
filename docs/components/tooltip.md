# LiquidTooltip

`LiquidTooltip` shows a short accessible hint from hover or focus.

## Status

- Inventory: `tooltip`, implemented
- Export: `LiquidTooltip`
- Source: `src/components/LiquidTooltip.tsx`
- Story: `stories/LiquidOverlay.stories.tsx`
- Registry item: `registry/components/liquid-tooltip.json`
- Visual profile: `overlay`
- npm package: not published to npm yet.

## Usage

```tsx
import { LiquidTooltip, LiquidTooltipTrigger, LiquidTooltipContent } from "@clean99/liquid-glass";

export function Example() {
  return (
    <LiquidTooltip>
      <LiquidTooltipTrigger>Help</LiquidTooltipTrigger>
      <LiquidTooltipContent>Keyboard accessible hint</LiquidTooltipContent>
    </LiquidTooltip>
  );
}
```

## Anatomy

The root owns delay and open state, trigger wires pointer and focus events, and content renders a small Liquid surface.

| Public part            | Role                                                                  |
| ---------------------- | --------------------------------------------------------------------- |
| `LiquidTooltip`        | Exported component or helper from `src/components/LiquidTooltip.tsx`. |
| `LiquidTooltipTrigger` | Exported component or helper from `src/components/LiquidTooltip.tsx`. |
| `LiquidTooltipContent` | Exported component or helper from `src/components/LiquidTooltip.tsx`. |

## API

| API surface                 | Notes                                                                       |
| --------------------------- | --------------------------------------------------------------------------- |
| `LiquidTooltipProps`        | Public TypeScript surface exported from `src/components/LiquidTooltip.tsx`. |
| `LiquidTooltipTriggerProps` | Public TypeScript surface exported from `src/components/LiquidTooltip.tsx`. |
| `LiquidTooltipContentProps` | Public TypeScript surface exported from `src/components/LiquidTooltip.tsx`. |

The component also accepts the native HTML attributes documented by its source
props type. Local material settings follow the same rules as `LiquidSurface`
when the implementation renders a Liquid surface.

## Visual States

The overlay profile expects closed, open, focus trap, escape, outside click, long content, material modes, and environment coverage.

Storybook coverage comes from `stories/LiquidOverlay.stories.tsx`. The component is assigned
to the `overlay` profile in `docs/visual-state-coverage.json`.

## Accessibility

Tooltips must be supplemental. Do not hide required instructions only inside tooltip content.

## Verification

- `tests/components.test.tsx` exercises the implemented component surface.
- `stories/LiquidOverlay.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-tooltip.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
