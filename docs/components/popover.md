# LiquidPopover

`LiquidPopover` opens a positioned Liquid surface from a trigger and supports explicit close actions.

## Status

- Inventory: `popover`, implemented
- Export: `LiquidPopover`
- Source: `src/components/LiquidPopover.tsx`
- Story: `stories/LiquidOverlay.stories.tsx`
- Registry item: `registry/components/liquid-popover.json`
- Visual profile: `overlay`
- npm package: not published to npm yet.

## Usage

```tsx
import {
  LiquidPopover,
  LiquidPopoverTrigger,
  LiquidPopoverContent,
  LiquidPopoverClose
} from "@clean99/liquid-glass";

export function Example() {
  return (
    <LiquidPopover>
      <LiquidPopoverTrigger>Mode details</LiquidPopoverTrigger>
      <LiquidPopoverContent>
        Material mode applies per surface.
        <LiquidPopoverClose>Close popover</LiquidPopoverClose>
      </LiquidPopoverContent>
    </LiquidPopover>
  );
}
```

## Anatomy

The root owns open state, trigger connects to content, content renders the Liquid surface, and close reuses button semantics.

| Public part            | Role                                                                  |
| ---------------------- | --------------------------------------------------------------------- |
| `LiquidPopover`        | Exported component or helper from `src/components/LiquidPopover.tsx`. |
| `LiquidPopoverTrigger` | Exported component or helper from `src/components/LiquidPopover.tsx`. |
| `LiquidPopoverContent` | Exported component or helper from `src/components/LiquidPopover.tsx`. |
| `LiquidPopoverClose`   | Exported component or helper from `src/components/LiquidPopover.tsx`. |

## API

| API surface                 | Notes                                                                       |
| --------------------------- | --------------------------------------------------------------------------- |
| `LiquidPopoverProps`        | Public TypeScript surface exported from `src/components/LiquidPopover.tsx`. |
| `LiquidPopoverTriggerProps` | Public TypeScript surface exported from `src/components/LiquidPopover.tsx`. |
| `LiquidPopoverContentProps` | Public TypeScript surface exported from `src/components/LiquidPopover.tsx`. |
| `LiquidPopoverCloseProps`   | Public TypeScript surface exported from `src/components/LiquidPopover.tsx`. |

The component also accepts the native HTML attributes documented by its source
props type. Local material settings follow the same rules as `LiquidSurface`
when the implementation renders a Liquid surface.

## Visual States

The overlay profile expects closed, open, focus trap, escape, outside click, long content, material modes, and environment coverage.

Storybook coverage comes from `stories/LiquidOverlay.stories.tsx`. The component is assigned
to the `overlay` profile in `docs/visual-state-coverage.json`.

## Accessibility

Use popovers for supplemental controls or short content. Keep focus movement and close behavior obvious.

## Verification

- `tests/components.test.tsx` exercises the implemented component surface.
- `stories/LiquidOverlay.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-popover.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
