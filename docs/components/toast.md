# LiquidToast

`LiquidToast` renders one notification record and exposes the imperative Liquid toast store helpers.

## Status

- Inventory: `toast`, implemented
- Export: `LiquidToast`
- Source: `src/components/LiquidToast.tsx`
- Story: `stories/LiquidToast.stories.tsx`
- Registry item: `registry/components/liquid-toast.json`
- Visual profile: `feedback`
- npm package: not published to npm yet.

## Usage

```tsx
import { LiquidToast, LiquidToastClose, LiquidToaster, LiquidSonner } from "@clean99/liquid-glass";

export function Example() {
  return <LiquidToast title="Build passed" description="Reference check completed." />;
}
```

## Anatomy

A toast is a Liquid surface with title, description, variant, optional action content, and close control. The store API creates and dismisses records.

| Public part        | Role                                                                |
| ------------------ | ------------------------------------------------------------------- |
| `LiquidToast`      | Exported component or helper from `src/components/LiquidToast.tsx`. |
| `LiquidToastClose` | Exported component or helper from `src/components/LiquidToast.tsx`. |
| `LiquidToaster`    | Exported component or helper from `src/components/LiquidToast.tsx`. |
| `LiquidSonner`     | Exported component or helper from `src/components/LiquidToast.tsx`. |

## API

| API surface             | Notes                                                                     |
| ----------------------- | ------------------------------------------------------------------------- |
| `LiquidToastPosition`   | Public TypeScript surface exported from `src/components/LiquidToast.tsx`. |
| `LiquidToastProps`      | Public TypeScript surface exported from `src/components/LiquidToast.tsx`. |
| `LiquidToastCloseProps` | Public TypeScript surface exported from `src/components/LiquidToast.tsx`. |
| `LiquidToasterProps`    | Public TypeScript surface exported from `src/components/LiquidToast.tsx`. |
| `LiquidToastApi`        | Public TypeScript surface exported from `src/components/LiquidToast.tsx`. |

The component also accepts the native HTML attributes documented by its source
props type. Local material settings follow the same rules as `LiquidSurface`
when the implementation renders a Liquid surface.

## Visual States

The feedback profile expects default, loading, empty, dismissible, live-region, material modes, and environment coverage where applicable.

Storybook coverage comes from `stories/LiquidToast.stories.tsx`. The component is assigned
to the `feedback` profile in `docs/visual-state-coverage.json`.

## Accessibility

Keep toast text concise and non-blocking. Critical failures need persistent page-level messaging too.

## Verification

- `tests/components.test.tsx` exercises the implemented component surface.
- `stories/LiquidToast.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-toast.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
