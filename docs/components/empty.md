# LiquidEmpty

`LiquidEmpty` renders an empty-state block with icon, title, description, and optional actions.

## Status

- Inventory: `empty`, implemented
- Export: `LiquidEmpty`
- Source: `src/components/LiquidEmpty.tsx`
- Story: `stories/LiquidFoundation.stories.tsx`
- Registry item: `registry/components/liquid-empty.json`
- Visual profile: `feedback`
- npm package: not published to npm yet.

## Usage

```tsx
import {
  LiquidEmpty,
  LiquidEmptyIcon,
  LiquidEmptyTitle,
  LiquidEmptyDescription,
  LiquidEmptyActions,
  LiquidButton
} from "@clean99/liquid-glass";

export function Example() {
  return (
    <LiquidEmpty>
      <LiquidEmptyIcon>0</LiquidEmptyIcon>
      <LiquidEmptyTitle>No data</LiquidEmptyTitle>
      <LiquidEmptyDescription>Try another filter.</LiquidEmptyDescription>
      <LiquidEmptyActions>
        <LiquidButton>Reset</LiquidButton>
      </LiquidEmptyActions>
    </LiquidEmpty>
  );
}
```

## Anatomy

The root centers the empty state, icon frames the visual cue, title names the state, description explains it, and actions offer recovery.

| Public part              | Role                                                                |
| ------------------------ | ------------------------------------------------------------------- |
| `LiquidEmpty`            | Exported component or helper from `src/components/LiquidEmpty.tsx`. |
| `LiquidEmptyIcon`        | Exported component or helper from `src/components/LiquidEmpty.tsx`. |
| `LiquidEmptyTitle`       | Exported component or helper from `src/components/LiquidEmpty.tsx`. |
| `LiquidEmptyDescription` | Exported component or helper from `src/components/LiquidEmpty.tsx`. |
| `LiquidEmptyActions`     | Exported component or helper from `src/components/LiquidEmpty.tsx`. |

## API

| API surface                   | Notes                                                                     |
| ----------------------------- | ------------------------------------------------------------------------- |
| `LiquidEmptyProps`            | Public TypeScript surface exported from `src/components/LiquidEmpty.tsx`. |
| `LiquidEmptyIconProps`        | Public TypeScript surface exported from `src/components/LiquidEmpty.tsx`. |
| `LiquidEmptyTitleProps`       | Public TypeScript surface exported from `src/components/LiquidEmpty.tsx`. |
| `LiquidEmptyDescriptionProps` | Public TypeScript surface exported from `src/components/LiquidEmpty.tsx`. |
| `LiquidEmptyActionsProps`     | Public TypeScript surface exported from `src/components/LiquidEmpty.tsx`. |

The component also accepts the native HTML attributes documented by its source
props type. Local material settings follow the same rules as `LiquidSurface`
when the implementation renders a Liquid surface.

## Visual States

The feedback profile expects default, loading, empty, dismissible, live-region, material modes, and environment coverage where applicable.

Storybook coverage comes from `stories/LiquidFoundation.stories.tsx`. The component is assigned
to the `feedback` profile in `docs/visual-state-coverage.json`.

## Accessibility

Do not rely on the icon alone. The title and description should explain the state in text.

## Verification

- `tests/components.test.tsx` exercises the implemented component surface.
- `stories/LiquidFoundation.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-empty.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
