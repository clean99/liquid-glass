# LiquidSheet

`LiquidSheet` uses the dialog foundation for side-positioned panels.

## Status

- Inventory: `sheet`, implemented
- Export: `LiquidSheet`
- Source: `src/components/LiquidSheet.tsx`
- Story: `stories/LiquidOverlay.stories.tsx`
- Registry item: `registry/components/liquid-sheet.json`
- Visual profile: `overlay`
- npm package: not published to npm yet.

## Usage

```tsx
import {
  LiquidSheet,
  LiquidSheetTrigger,
  LiquidSheetClose,
  LiquidSheetHeader,
  LiquidSheetFooter,
  LiquidSheetTitle,
  LiquidSheetDescription,
  LiquidSheetContent
} from "@clean99/liquid-glass";

export function Example() {
  return (
    <LiquidSheet>
      <LiquidSheetTrigger>Open settings</LiquidSheetTrigger>
      <LiquidSheetContent side="left">
        <LiquidSheetTitle>Settings</LiquidSheetTitle>
        <LiquidSheetDescription>Controls for the current view.</LiquidSheetDescription>
        <LiquidSheetClose>Close settings</LiquidSheetClose>
      </LiquidSheetContent>
    </LiquidSheet>
  );
}
```

## Anatomy

Sheet aliases the dialog root, trigger, close, title, description, header, and footer while adding side placement to content.

| Public part              | Role                                                                |
| ------------------------ | ------------------------------------------------------------------- |
| `LiquidSheet`            | Exported component or helper from `src/components/LiquidSheet.tsx`. |
| `LiquidSheetTrigger`     | Exported component or helper from `src/components/LiquidSheet.tsx`. |
| `LiquidSheetClose`       | Exported component or helper from `src/components/LiquidSheet.tsx`. |
| `LiquidSheetHeader`      | Exported component or helper from `src/components/LiquidSheet.tsx`. |
| `LiquidSheetFooter`      | Exported component or helper from `src/components/LiquidSheet.tsx`. |
| `LiquidSheetTitle`       | Exported component or helper from `src/components/LiquidSheet.tsx`. |
| `LiquidSheetDescription` | Exported component or helper from `src/components/LiquidSheet.tsx`. |
| `LiquidSheetContent`     | Exported component or helper from `src/components/LiquidSheet.tsx`. |

## API

| API surface                   | Notes                                                                     |
| ----------------------------- | ------------------------------------------------------------------------- |
| `LiquidSheetProps`            | Public TypeScript surface exported from `src/components/LiquidSheet.tsx`. |
| `LiquidSheetTriggerProps`     | Public TypeScript surface exported from `src/components/LiquidSheet.tsx`. |
| `LiquidSheetCloseProps`       | Public TypeScript surface exported from `src/components/LiquidSheet.tsx`. |
| `LiquidSheetHeaderProps`      | Public TypeScript surface exported from `src/components/LiquidSheet.tsx`. |
| `LiquidSheetFooterProps`      | Public TypeScript surface exported from `src/components/LiquidSheet.tsx`. |
| `LiquidSheetTitleProps`       | Public TypeScript surface exported from `src/components/LiquidSheet.tsx`. |
| `LiquidSheetDescriptionProps` | Public TypeScript surface exported from `src/components/LiquidSheet.tsx`. |
| `LiquidSheetSide`             | Public TypeScript surface exported from `src/components/LiquidSheet.tsx`. |
| `LiquidSheetContentProps`     | Public TypeScript surface exported from `src/components/LiquidSheet.tsx`. |

The component also accepts the native HTML attributes documented by its source
props type. Local material settings follow the same rules as `LiquidSurface`
when the implementation renders a Liquid surface.

## Visual States

The overlay profile expects closed, open, focus trap, escape, outside click, long content, material modes, and environment coverage.

Storybook coverage comes from `stories/LiquidOverlay.stories.tsx`. The component is assigned
to the `overlay` profile in `docs/visual-state-coverage.json`.

## Accessibility

The sheet content is still dialog content. Provide title, description, focus handling, and a visible close action.

## Verification

- `tests/components.test.tsx` exercises the implemented component surface.
- `stories/LiquidOverlay.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-sheet.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
