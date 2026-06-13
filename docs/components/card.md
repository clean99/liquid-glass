# LiquidCard

`LiquidCard` is a layout container for readable content on a Liquid Glass
surface. It is not an interactive primitive by default.

## Status

- Inventory: `card`, implemented
- Export: `LiquidCard`
- Source: `src/components/LiquidCard.tsx`
- Story: `stories/LiquidCard.stories.tsx`
- Registry item: `registry/components/liquid-card.json`
- npm package: not published to npm yet.

## Usage

```tsx
import { LiquidCard, LiquidPill } from "@clean99/liquid-glass";

export function ArticleCard() {
  return (
    <LiquidCard>
      <LiquidPill>Frontend Systems</LiquidPill>
      <h3>Workspace V2 Tab System</h3>
      <p>Architecture notes with readable foreground content.</p>
    </LiquidCard>
  );
}
```

## Anatomy

`LiquidCard` is a small wrapper around `LiquidSurface`:

| Surface field | Value           |
| ------------- | --------------- |
| `kind`        | `card`          |
| `radius`      | `xl` by default |

All other material props pass through.

## API

`LiquidCardProps` is `LiquidSurfaceProps` without `kind`.

| Prop        | Type              | Default  | Notes                                   |
| ----------- | ----------------- | -------- | --------------------------------------- |
| `children`  | `ReactNode`       | none     | Keep text in normal foreground content. |
| `radius`    | `LiquidRadius`    | `xl`     | Override only when layout requires it.  |
| `mode`      | `LiquidMode`      | `auto`   | Local material request.                 |
| `intensity` | `LiquidIntensity` | `subtle` | Inherited from `LiquidSurface`.         |

## Visual States

Storybook covers realistic article content, dark mode, dense grids, nested
surface behavior, and responsive layout. The layout profile expects dense
content, overflow, nested surface, and responsive review states.

## Accessibility

`LiquidCard` does not add landmark or interactive semantics. Use semantic HTML
inside it: `article`, headings, lists, buttons, and links as appropriate.

## Verification

- `tests/components.test.tsx` checks fallback card behavior.
- `stories/LiquidCard.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-card.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
