# LiquidTypography

`LiquidTypography` applies named text variants while preserving the caller-selected semantic element.

## Status

- Inventory: `typography`, implemented
- Export: `LiquidTypography`
- Source: `src/components/LiquidTypography.tsx`
- Story: `stories/LiquidFoundation.stories.tsx`
- Registry item: `registry/components/liquid-typography.json`
- Visual profile: `typography`
- npm package: not published to npm yet.

## Usage

```tsx
import { LiquidTypography } from "@clean99/liquid-glass";

export function Example() {
  return (
    <LiquidTypography as="p" variant="lead">
      Reference material
    </LiquidTypography>
  );
}
```

## Anatomy

The component maps variants to Liquid typography classes and renders the requested element.

| Public part        | Role                                                                     |
| ------------------ | ------------------------------------------------------------------------ |
| `LiquidTypography` | Exported component or helper from `src/components/LiquidTypography.tsx`. |

## API

| API surface               | Notes                                                                          |
| ------------------------- | ------------------------------------------------------------------------------ |
| `LiquidTypographyVariant` | Public TypeScript surface exported from `src/components/LiquidTypography.tsx`. |
| `LiquidTypographyProps`   | Public TypeScript surface exported from `src/components/LiquidTypography.tsx`. |

The component also accepts the native HTML attributes documented by its source
props type. Local material settings follow the same rules as `LiquidSurface`
when the implementation renders a Liquid surface.

## Visual States

The typography profile expects scale, long content, nested surface, material modes, and environment coverage.

Storybook coverage comes from `stories/LiquidFoundation.stories.tsx`. The component is assigned
to the `typography` profile in `docs/visual-state-coverage.json`.

## Accessibility

Choose the `as` element for document structure first, then choose the visual variant. Do not use display styling to fake headings.

## Verification

- `tests/components.test.tsx` exercises the implemented component surface.
- `stories/LiquidFoundation.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-typography.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
