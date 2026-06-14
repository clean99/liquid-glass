# LiquidCarousel

`LiquidCarousel` wraps Embla carousel behavior in Liquid Glass controls and stable slide layout.

## Status

- Inventory: `carousel`, implemented
- Export: `LiquidCarousel`
- Source: `src/components/LiquidCarousel.tsx`
- Story: `stories/LiquidCarousel.stories.tsx`
- Registry item: `registry/components/liquid-carousel.json`
- Visual profile: `media`
- npm package: not published to npm yet.

## Usage

```tsx
import {
  LiquidCarousel,
  LiquidCarouselContent,
  LiquidCarouselItem,
  LiquidCarouselPrevious,
  LiquidCarouselNext
} from "@clean99/liquid-glass";

export function Example() {
  return (
    <LiquidCarousel aria-label="Featured components">
      <LiquidCarouselContent>
        <LiquidCarouselItem>Surface</LiquidCarouselItem>
        <LiquidCarouselItem>Button</LiquidCarouselItem>
      </LiquidCarouselContent>
      <LiquidCarouselPrevious />
      <LiquidCarouselNext />
    </LiquidCarousel>
  );
}
```

## Anatomy

The root owns the carousel context, the content component owns the moving track, each item is one slide, and previous/next controls are Liquid icon buttons.

| Public part              | Role                                                                   |
| ------------------------ | ---------------------------------------------------------------------- |
| `LiquidCarousel`         | Exported component or helper from `src/components/LiquidCarousel.tsx`. |
| `LiquidCarouselContent`  | Exported component or helper from `src/components/LiquidCarousel.tsx`. |
| `LiquidCarouselItem`     | Exported component or helper from `src/components/LiquidCarousel.tsx`. |
| `LiquidCarouselPrevious` | Exported component or helper from `src/components/LiquidCarousel.tsx`. |
| `LiquidCarouselNext`     | Exported component or helper from `src/components/LiquidCarousel.tsx`. |

## API

| API surface                   | Notes                                                                        |
| ----------------------------- | ---------------------------------------------------------------------------- |
| `LiquidCarouselApi`           | Public TypeScript surface exported from `src/components/LiquidCarousel.tsx`. |
| `LiquidCarouselOptions`       | Public TypeScript surface exported from `src/components/LiquidCarousel.tsx`. |
| `LiquidCarouselPlugin`        | Public TypeScript surface exported from `src/components/LiquidCarousel.tsx`. |
| `LiquidCarouselProps`         | Public TypeScript surface exported from `src/components/LiquidCarousel.tsx`. |
| `LiquidCarouselContentProps`  | Public TypeScript surface exported from `src/components/LiquidCarousel.tsx`. |
| `LiquidCarouselItemProps`     | Public TypeScript surface exported from `src/components/LiquidCarousel.tsx`. |
| `LiquidCarouselControlProps`  | Public TypeScript surface exported from `src/components/LiquidCarousel.tsx`. |
| `LiquidCarouselViewportProps` | Public TypeScript surface exported from `src/components/LiquidCarousel.tsx`. |

The component also accepts the native HTML attributes documented by its source
props type. Local material settings follow the same rules as `LiquidSurface`
when the implementation renders a Liquid surface.

## Visual States

The media profile expects fallback content, loaded media, keyboard navigation, material modes, and environment coverage.

Storybook coverage comes from `stories/LiquidCarousel.stories.tsx`. The component is assigned
to the `media` profile in `docs/visual-state-coverage.json`.

## Accessibility

Give the carousel an accessible label and keep slide order meaningful. Previous and next controls expose button semantics.

## Verification

- `tests/components.test.tsx` exercises the implemented component surface.
- `stories/LiquidCarousel.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-carousel.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
