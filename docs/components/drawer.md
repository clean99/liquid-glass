# LiquidDrawer

`LiquidDrawer` uses the Sheet/Dialog foundation for temporary task panels that feel drawer-oriented.

## Status

- Inventory: `drawer`, implemented
- Export: `LiquidDrawer`
- Source: `src/components/LiquidDrawer.tsx`
- Story: `stories/LiquidOverlay.stories.tsx`
- Registry item: `registry/components/liquid-drawer.json`
- Visual profile: `overlay`
- npm package: not published to npm yet.

## Usage

```tsx
import {
  LiquidDrawer,
  LiquidDrawerTrigger,
  LiquidDrawerClose,
  LiquidDrawerHeader,
  LiquidDrawerFooter,
  LiquidDrawerTitle,
  LiquidDrawerDescription,
  LiquidDrawerContent
} from "@clean99/liquid-glass";

export function Example() {
  return (
    <LiquidDrawer>
      <LiquidDrawerTrigger>Open release drawer</LiquidDrawerTrigger>
      <LiquidDrawerContent>
        <LiquidDrawerTitle>Release drawer</LiquidDrawerTitle>
        <LiquidDrawerDescription>Focused controls for a short task.</LiquidDrawerDescription>
        <LiquidDrawerClose>Close drawer</LiquidDrawerClose>
      </LiquidDrawerContent>
    </LiquidDrawer>
  );
}
```

## Anatomy

Drawer aliases the Sheet root, trigger, close, title, description, header, and footer while providing drawer-specific content defaults.

| Public part               | Role                                                                 |
| ------------------------- | -------------------------------------------------------------------- |
| `LiquidDrawer`            | Exported component or helper from `src/components/LiquidDrawer.tsx`. |
| `LiquidDrawerTrigger`     | Exported component or helper from `src/components/LiquidDrawer.tsx`. |
| `LiquidDrawerClose`       | Exported component or helper from `src/components/LiquidDrawer.tsx`. |
| `LiquidDrawerHeader`      | Exported component or helper from `src/components/LiquidDrawer.tsx`. |
| `LiquidDrawerFooter`      | Exported component or helper from `src/components/LiquidDrawer.tsx`. |
| `LiquidDrawerTitle`       | Exported component or helper from `src/components/LiquidDrawer.tsx`. |
| `LiquidDrawerDescription` | Exported component or helper from `src/components/LiquidDrawer.tsx`. |
| `LiquidDrawerContent`     | Exported component or helper from `src/components/LiquidDrawer.tsx`. |

## API

| API surface                    | Notes                                                                      |
| ------------------------------ | -------------------------------------------------------------------------- |
| `LiquidDrawerProps`            | Public TypeScript surface exported from `src/components/LiquidDrawer.tsx`. |
| `LiquidDrawerTriggerProps`     | Public TypeScript surface exported from `src/components/LiquidDrawer.tsx`. |
| `LiquidDrawerCloseProps`       | Public TypeScript surface exported from `src/components/LiquidDrawer.tsx`. |
| `LiquidDrawerContentProps`     | Public TypeScript surface exported from `src/components/LiquidDrawer.tsx`. |
| `LiquidDrawerHeaderProps`      | Public TypeScript surface exported from `src/components/LiquidDrawer.tsx`. |
| `LiquidDrawerFooterProps`      | Public TypeScript surface exported from `src/components/LiquidDrawer.tsx`. |
| `LiquidDrawerTitleProps`       | Public TypeScript surface exported from `src/components/LiquidDrawer.tsx`. |
| `LiquidDrawerDescriptionProps` | Public TypeScript surface exported from `src/components/LiquidDrawer.tsx`. |

The component also accepts the native HTML attributes documented by its source
props type. Local material settings follow the same rules as `LiquidSurface`
when the implementation renders a Liquid surface.

## Visual States

The overlay profile expects closed, open, focus trap, escape, outside click, long content, material modes, and environment coverage.

Storybook coverage comes from `stories/LiquidOverlay.stories.tsx`. The component is assigned
to the `overlay` profile in `docs/visual-state-coverage.json`.

## Accessibility

The content uses dialog semantics. Keep a title and description in the drawer and preserve an obvious close path.

## Verification

- `tests/components.test.tsx` exercises the implemented component surface.
- `stories/LiquidOverlay.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-drawer.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
