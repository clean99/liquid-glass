# LiquidAspectRatio

`LiquidAspectRatio` preserves a fixed media or preview ratio while the child content fills the box.

## Status

- Inventory: `aspect-ratio`, implemented
- Export: `LiquidAspectRatio`
- Source: `src/components/LiquidAspectRatio.tsx`
- Story: `stories/LiquidFoundation.stories.tsx`
- Registry item: `registry/components/liquid-aspect-ratio.json`
- Visual profile: `layout`
- npm package: not published to npm yet.

## Usage

```tsx
import { LiquidAspectRatio } from "@clean99/liquid-glass";

export function Example() {
  return (
    <LiquidAspectRatio ratio={16 / 9}>
      <img src="/preview.jpg" alt="Dashboard preview" />
    </LiquidAspectRatio>
  );
}
```

## Anatomy

It renders a single wrapper with a calculated aspect ratio. Children stay inside that stable box so media and preview panels do not shift surrounding layout.

| Public part         | Role                                                                      |
| ------------------- | ------------------------------------------------------------------------- |
| `LiquidAspectRatio` | Exported component or helper from `src/components/LiquidAspectRatio.tsx`. |

## API

| API surface              | Notes                                                                           |
| ------------------------ | ------------------------------------------------------------------------------- |
| `LiquidAspectRatioProps` | Public TypeScript surface exported from `src/components/LiquidAspectRatio.tsx`. |

The component also accepts the native HTML attributes documented by its source
props type. Local material settings follow the same rules as `LiquidSurface`
when the implementation renders a Liquid surface.

## Visual States

The layout profile expects dense content, overflow, nested surface, responsive, material modes, and environment coverage.

Storybook coverage comes from `stories/LiquidFoundation.stories.tsx`. The component is assigned
to the `layout` profile in `docs/visual-state-coverage.json`.

## Accessibility

The wrapper is neutral. Put accessible names on the child media, link, button, or figure content that users interact with.

## Verification

- `tests/components.test.tsx` exercises the implemented component surface.
- `stories/LiquidFoundation.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-aspect-ratio.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
