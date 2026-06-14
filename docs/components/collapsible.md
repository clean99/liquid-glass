# LiquidCollapsible

`LiquidCollapsible` pairs a Liquid button trigger with a region-like content surface for expandable details.

## Status

- Inventory: `collapsible`, implemented
- Export: `LiquidCollapsible`
- Source: `src/components/LiquidCollapsible.tsx`
- Story: `stories/LiquidOverlay.stories.tsx`
- Registry item: `registry/components/liquid-collapsible.json`
- Visual profile: `disclosure`
- npm package: not published to npm yet.

## Usage

```tsx
import {
  LiquidCollapsible,
  LiquidCollapsibleTrigger,
  LiquidCollapsibleContent
} from "@clean99/liquid-glass";

export function Example() {
  return (
    <LiquidCollapsible>
      <LiquidCollapsibleTrigger>Implementation notes</LiquidCollapsibleTrigger>
      <LiquidCollapsibleContent>Keep content outside distorted layers.</LiquidCollapsibleContent>
    </LiquidCollapsible>
  );
}
```

## Anatomy

The root owns open state, the trigger exposes the control, and the content surface appears only when expanded.

| Public part                | Role                                                                      |
| -------------------------- | ------------------------------------------------------------------------- |
| `LiquidCollapsible`        | Exported component or helper from `src/components/LiquidCollapsible.tsx`. |
| `LiquidCollapsibleTrigger` | Exported component or helper from `src/components/LiquidCollapsible.tsx`. |
| `LiquidCollapsibleContent` | Exported component or helper from `src/components/LiquidCollapsible.tsx`. |

## API

| API surface                     | Notes                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------- |
| `LiquidCollapsibleProps`        | Public TypeScript surface exported from `src/components/LiquidCollapsible.tsx`. |
| `LiquidCollapsibleTriggerProps` | Public TypeScript surface exported from `src/components/LiquidCollapsible.tsx`. |
| `LiquidCollapsibleContentProps` | Public TypeScript surface exported from `src/components/LiquidCollapsible.tsx`. |

The component also accepts the native HTML attributes documented by its source
props type. Local material settings follow the same rules as `LiquidSurface`
when the implementation renders a Liquid surface.

## Visual States

The disclosure profile expects default, hover, focus-visible, expanded, collapsed, material modes, and environment coverage.

Storybook coverage comes from `stories/LiquidOverlay.stories.tsx`. The component is assigned
to the `disclosure` profile in `docs/visual-state-coverage.json`.

## Accessibility

The trigger carries button semantics and expanded state. Keep the expanded content focused and do not hide required form fields inside a collapsed panel by default.

## Verification

- `tests/components.test.tsx` exercises the implemented component surface.
- `stories/LiquidOverlay.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-collapsible.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
