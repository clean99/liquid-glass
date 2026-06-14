# LiquidHoverCard

`LiquidHoverCard` shows supplemental content from hover and focus without replacing a click-through destination.

## Status

- Inventory: `hover-card`, implemented
- Export: `LiquidHoverCard`
- Source: `src/components/LiquidHoverCard.tsx`
- Story: `stories/LiquidOverlay.stories.tsx`
- Registry item: `registry/components/liquid-hover-card.json`
- Visual profile: `overlay`
- npm package: not published to npm yet.

## Usage

```tsx
import {
  LiquidHoverCard,
  LiquidHoverCardTrigger,
  LiquidHoverCardContent
} from "@clean99/liquid-glass";

export function Example() {
  return (
    <LiquidHoverCard>
      <LiquidHoverCardTrigger href="#author">Author</LiquidHoverCardTrigger>
      <LiquidHoverCardContent>Systems notes and essays.</LiquidHoverCardContent>
    </LiquidHoverCard>
  );
}
```

## Anatomy

The root owns delay and open state. The trigger is an anchor-like element and content is a Liquid surface positioned near it.

| Public part              | Role                                                                    |
| ------------------------ | ----------------------------------------------------------------------- |
| `LiquidHoverCard`        | Exported component or helper from `src/components/LiquidHoverCard.tsx`. |
| `LiquidHoverCardTrigger` | Exported component or helper from `src/components/LiquidHoverCard.tsx`. |
| `LiquidHoverCardContent` | Exported component or helper from `src/components/LiquidHoverCard.tsx`. |

## API

| API surface                   | Notes                                                                         |
| ----------------------------- | ----------------------------------------------------------------------------- |
| `LiquidHoverCardProps`        | Public TypeScript surface exported from `src/components/LiquidHoverCard.tsx`. |
| `LiquidHoverCardTriggerProps` | Public TypeScript surface exported from `src/components/LiquidHoverCard.tsx`. |
| `LiquidHoverCardContentProps` | Public TypeScript surface exported from `src/components/LiquidHoverCard.tsx`. |

The component also accepts the native HTML attributes documented by its source
props type. Local material settings follow the same rules as `LiquidSurface`
when the implementation renders a Liquid surface.

## Visual States

The overlay profile expects closed, open, focus trap, escape, outside click, long content, material modes, and environment coverage.

Storybook coverage comes from `stories/LiquidOverlay.stories.tsx`. The component is assigned
to the `overlay` profile in `docs/visual-state-coverage.json`.

## Accessibility

Keep hover-card content supplemental. Users should not need the hover card to complete a core workflow.

## Verification

- `tests/components.test.tsx` exercises the implemented component surface.
- `stories/LiquidOverlay.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-hover-card.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
