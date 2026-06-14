# LiquidToaster

`LiquidToaster` renders the toast viewport and store-backed notifications through the Sonner-compatible alias.

## Status

- Inventory: `sonner`, implemented
- Export: `LiquidToaster`
- Source: `src/components/LiquidToast.tsx`
- Story: `stories/LiquidToast.stories.tsx`
- Registry item: `registry/components/liquid-sonner.json`
- Visual profile: `feedback`
- npm package: not published to npm yet.

## Usage

```tsx
import { LiquidToast, LiquidToastClose, LiquidToaster, LiquidSonner } from "@clean99/liquid-glass";

export function Example() {
  return <LiquidToaster position="top-center" />;
}
```

## Anatomy

The toaster subscribes to the Liquid toast store and renders ordered toast records. `LiquidSonner` is an alias of the same viewport.

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

Use short toast titles and descriptions. Do not put destructive workflows only in transient toasts.

## Verification

- `tests/components.test.tsx` exercises the implemented component surface.
- `stories/LiquidToast.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-sonner.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
