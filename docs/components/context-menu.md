# LiquidContextMenu

`LiquidContextMenu` adapts the shared menu primitives for right-click or context-triggered actions.

## Status

- Inventory: `context-menu`, implemented
- Export: `LiquidContextMenu`
- Source: `src/components/LiquidContextMenu.tsx`
- Story: `stories/LiquidOverlay.stories.tsx`
- Registry item: `registry/components/liquid-context-menu.json`
- Visual profile: `overlay`
- npm package: not published to npm yet.

## Usage

```tsx
import {
  LiquidContextMenu,
  LiquidContextMenuTrigger,
  LiquidContextMenuContent,
  LiquidContextMenuItem,
  LiquidContextMenuLabel,
  LiquidContextMenuSeparator
} from "@clean99/liquid-glass";

export function Example() {
  return (
    <LiquidContextMenu>
      <LiquidContextMenuTrigger>Open context target</LiquidContextMenuTrigger>
      <LiquidContextMenuContent aria-label="Block actions">
        <LiquidContextMenuItem>Copy link</LiquidContextMenuItem>
      </LiquidContextMenuContent>
    </LiquidContextMenu>
  );
}
```

## Anatomy

The root owns open state, trigger listens for context activation, and content renders menu items, labels, and separators.

| Public part                  | Role                                                                      |
| ---------------------------- | ------------------------------------------------------------------------- |
| `LiquidContextMenu`          | Exported component or helper from `src/components/LiquidContextMenu.tsx`. |
| `LiquidContextMenuTrigger`   | Exported component or helper from `src/components/LiquidContextMenu.tsx`. |
| `LiquidContextMenuContent`   | Exported component or helper from `src/components/LiquidContextMenu.tsx`. |
| `LiquidContextMenuItem`      | Exported component or helper from `src/components/LiquidContextMenu.tsx`. |
| `LiquidContextMenuLabel`     | Exported component or helper from `src/components/LiquidContextMenu.tsx`. |
| `LiquidContextMenuSeparator` | Exported component or helper from `src/components/LiquidContextMenu.tsx`. |

## API

| API surface                       | Notes                                                                           |
| --------------------------------- | ------------------------------------------------------------------------------- |
| `LiquidContextMenuProps`          | Public TypeScript surface exported from `src/components/LiquidContextMenu.tsx`. |
| `LiquidContextMenuTriggerProps`   | Public TypeScript surface exported from `src/components/LiquidContextMenu.tsx`. |
| `LiquidContextMenuContentProps`   | Public TypeScript surface exported from `src/components/LiquidContextMenu.tsx`. |
| `LiquidContextMenuItemProps`      | Public TypeScript surface exported from `src/components/LiquidContextMenu.tsx`. |
| `LiquidContextMenuLabelProps`     | Public TypeScript surface exported from `src/components/LiquidContextMenu.tsx`. |
| `LiquidContextMenuSeparatorProps` | Public TypeScript surface exported from `src/components/LiquidContextMenu.tsx`. |

The component also accepts the native HTML attributes documented by its source
props type. Local material settings follow the same rules as `LiquidSurface`
when the implementation renders a Liquid surface.

## Visual States

The overlay profile expects closed, open, focus trap, escape, outside click, long content, material modes, and environment coverage.

Storybook coverage comes from `stories/LiquidOverlay.stories.tsx`. The component is assigned
to the `overlay` profile in `docs/visual-state-coverage.json`.

## Accessibility

Context actions need keyboard alternatives. Give the content an accessible label when the visible trigger text does not describe the menu.

## Verification

- `tests/components.test.tsx` exercises the implemented component surface.
- `stories/LiquidOverlay.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-context-menu.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
