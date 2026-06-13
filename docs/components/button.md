# LiquidButton

`LiquidButton` is the default action control. It renders a native button by
default and delegates material rendering to `LiquidSurface`.

## Status

- Inventory: `button`, implemented
- Export: `LiquidButton`
- Source: `src/components/LiquidButton.tsx`
- Story: `stories/LiquidButton.stories.tsx`
- Registry item: `registry/components/liquid-button.json`
- npm package: not published to npm yet.

## Usage

```tsx
import { LiquidButton } from "@clean99/liquid-glass";

export function SaveAction() {
  return <LiquidButton>Save changes</LiquidButton>;
}
```

Link-style usage:

```tsx
<LiquidButton as="a" href="/docs">
  Read docs
</LiquidButton>
```

## Anatomy

`LiquidButton` fixes these `LiquidSurface` values unless overridden:

| Surface field | Value                                |
| ------------- | ------------------------------------ |
| `as`          | `button`                             |
| `kind`        | `button`                             |
| `interactive` | `true`                               |
| `radius`      | `pill`                               |
| `type`        | `button` for native button rendering |

## API

`LiquidButtonProps` extends `LiquidSurfaceProps` without `kind`, and narrows
`as` to `button` or `a`.

| Prop       | Type            | Default  | Notes                                                        |
| ---------- | --------------- | -------- | ------------------------------------------------------------ |
| `as`       | `button` or `a` | `button` | Use `a` only with link semantics and `href`.                 |
| `type`     | `string`        | `button` | Passed only when rendered as a native button.                |
| `disabled` | `boolean`       | `false`  | Prevents click handling and sets native disabled on buttons. |
| `mode`     | `LiquidMode`    | `auto`   | Local material request.                                      |
| `children` | `ReactNode`     | none     | Visible accessible name should come from text or labels.     |

## Visual States

Storybook covers light, dark, disabled, focus-visible, and long-label states.
The control profile in `docs/visual-state-coverage.json` expects default, hover,
focus-visible, pressed, disabled, and selected review states where applicable.

## Accessibility

Native button rendering is the normal path. Link rendering should be reserved
for navigation. Do not use a button for links or a link for form submission.

## Verification

- `tests/components.test.tsx` checks native button rendering, click handling,
  disabled click blocking, and forwarded refs.
- `stories/LiquidButton.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-button.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
