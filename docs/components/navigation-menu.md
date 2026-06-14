# LiquidNav

`LiquidNav` renders a Liquid surface as semantic navigation.

## Status

- Inventory: `navigation-menu`, implemented
- Export: `LiquidNav`
- Source: `src/components/LiquidNav.tsx`
- Story: `stories/LiquidNav.stories.tsx`
- Registry item: `registry/components/liquid-navigation-menu.json`
- Visual profile: `navigation`
- npm package: not published to npm yet.

## Usage

```tsx
import { LiquidNav } from "@clean99/liquid-glass";

export function Example() {
  return (
    <LiquidNav aria-label="Primary navigation">
      <a href="/docs">Docs</a>
      <a href="/components">Components</a>
    </LiquidNav>
  );
}
```

## Anatomy

It fixes the rendered element to `nav` and applies navigation material while letting links remain ordinary anchors.

| Public part | Role                                                              |
| ----------- | ----------------------------------------------------------------- |
| `LiquidNav` | Exported component or helper from `src/components/LiquidNav.tsx`. |

## API

| API surface      | Notes                                                                   |
| ---------------- | ----------------------------------------------------------------------- |
| `LiquidNavProps` | Public TypeScript surface exported from `src/components/LiquidNav.tsx`. |

The component also accepts the native HTML attributes documented by its source
props type. Local material settings follow the same rules as `LiquidSurface`
when the implementation renders a Liquid surface.

## Visual States

The navigation profile expects default, hover, focus-visible, current item, collapsed, overflow, material modes, and environment coverage.

Storybook coverage comes from `stories/LiquidNav.stories.tsx`. The component is assigned
to the `navigation` profile in `docs/visual-state-coverage.json`.

## Accessibility

Always provide an accessible label when more than one nav region can appear on a page.

## Verification

- `tests/components.test.tsx` exercises the implemented component surface.
- `stories/LiquidNav.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-navigation-menu.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
