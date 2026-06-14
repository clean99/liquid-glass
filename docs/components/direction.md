# LiquidDirection

`LiquidDirection` sets text direction for a subtree without changing global document direction.

## Status

- Inventory: `direction`, implemented
- Export: `LiquidDirection`
- Source: `src/components/LiquidDirection.tsx`
- Story: `stories/LiquidFoundation.stories.tsx`
- Registry item: `registry/components/liquid-direction.json`
- Visual profile: `utility`
- npm package: not published to npm yet.

## Usage

```tsx
import { LiquidDirection } from "@clean99/liquid-glass";

export function Example() {
  return (
    <LiquidDirection dir="rtl">
      <p>RTL preview content</p>
    </LiquidDirection>
  );
}
```

## Anatomy

It renders a wrapper carrying the requested `dir` attribute and leaves layout decisions to the content inside.

| Public part       | Role                                                                    |
| ----------------- | ----------------------------------------------------------------------- |
| `LiquidDirection` | Exported component or helper from `src/components/LiquidDirection.tsx`. |

## API

| API surface            | Notes                                                                         |
| ---------------------- | ----------------------------------------------------------------------------- |
| `LiquidDirectionProps` | Public TypeScript surface exported from `src/components/LiquidDirection.tsx`. |

The component also accepts the native HTML attributes documented by its source
props type. Local material settings follow the same rules as `LiquidSurface`
when the implementation renders a Liquid surface.

## Visual States

The utility profile expects ltr, rtl, nested surface, material modes, and environment coverage.

Storybook coverage comes from `stories/LiquidFoundation.stories.tsx`. The component is assigned
to the `utility` profile in `docs/visual-state-coverage.json`.

## Accessibility

Use it when content direction is real content metadata, not decoration. Nested controls inherit the direction.

## Verification

- `tests/components.test.tsx` exercises the implemented component surface.
- `stories/LiquidFoundation.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-direction.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
