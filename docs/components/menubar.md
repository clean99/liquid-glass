# LiquidMenubar

`LiquidMenubar` renders top-level menu groups with keyboard-aware roving focus and nested item lists.

## Status

- Inventory: `menubar`, implemented
- Export: `LiquidMenubar`
- Source: `src/components/LiquidMenubar.tsx`
- Story: `stories/LiquidOverlay.stories.tsx`
- Registry item: `registry/components/liquid-menubar.json`
- Visual profile: `navigation`
- npm package: not published to npm yet.

## Usage

```tsx
import { LiquidMenubar } from "@clean99/liquid-glass";

export function Example() {
  return <LiquidMenubar menus={menus} value={active} onValueChange={setActive} />;
}
```

## Anatomy

The root receives menu records, renders triggers for each menu, and exposes menu items with shared Liquid menu behavior.

| Public part     | Role                                                                  |
| --------------- | --------------------------------------------------------------------- |
| `LiquidMenubar` | Exported component or helper from `src/components/LiquidMenubar.tsx`. |

## API

| API surface          | Notes                                                                       |
| -------------------- | --------------------------------------------------------------------------- |
| `LiquidMenubarItem`  | Public TypeScript surface exported from `src/components/LiquidMenubar.tsx`. |
| `LiquidMenubarMenu`  | Public TypeScript surface exported from `src/components/LiquidMenubar.tsx`. |
| `LiquidMenubarProps` | Public TypeScript surface exported from `src/components/LiquidMenubar.tsx`. |

The component also accepts the native HTML attributes documented by its source
props type. Local material settings follow the same rules as `LiquidSurface`
when the implementation renders a Liquid surface.

## Visual States

The navigation profile expects default, hover, focus-visible, current item, collapsed, overflow, material modes, and environment coverage.

Storybook coverage comes from `stories/LiquidOverlay.stories.tsx`. The component is assigned
to the `navigation` profile in `docs/visual-state-coverage.json`.

## Accessibility

Use concise menu labels and predictable item order. Disabled items should not be selectable.

## Verification

- `tests/components.test.tsx` exercises the implemented component surface.
- `stories/LiquidOverlay.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-menubar.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
