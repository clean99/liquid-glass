# LiquidKbd

`LiquidKbd` formats keyboard shortcuts and inline key names.

## Status

- Inventory: `kbd`, implemented
- Export: `LiquidKbd`
- Source: `src/components/LiquidKbd.tsx`
- Story: `stories/LiquidFoundation.stories.tsx`
- Registry item: `registry/components/liquid-kbd.json`
- Visual profile: `display`
- npm package: not published to npm yet.

## Usage

```tsx
import { LiquidKbd } from "@clean99/liquid-glass";

export function Example() {
  return <LiquidKbd>Cmd K</LiquidKbd>;
}
```

## Anatomy

It renders a keyboard-like inline element with the standard Liquid typography treatment.

| Public part | Role                                                              |
| ----------- | ----------------------------------------------------------------- |
| `LiquidKbd` | Exported component or helper from `src/components/LiquidKbd.tsx`. |

## API

| API surface      | Notes                                                                   |
| ---------------- | ----------------------------------------------------------------------- |
| `LiquidKbdProps` | Public TypeScript surface exported from `src/components/LiquidKbd.tsx`. |

The component also accepts the native HTML attributes documented by its source
props type. Local material settings follow the same rules as `LiquidSurface`
when the implementation renders a Liquid surface.

## Visual States

The display profile expects default, variant, long content, nested surface, material modes, and environment coverage.

Storybook coverage comes from `stories/LiquidFoundation.stories.tsx`. The component is assigned
to the `display` profile in `docs/visual-state-coverage.json`.

## Accessibility

Use readable key names. Do not hide the only explanation of a shortcut inside an icon.

## Verification

- `tests/components.test.tsx` exercises the implemented component surface.
- `stories/LiquidFoundation.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-kbd.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
