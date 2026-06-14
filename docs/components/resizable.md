# LiquidResizable

`LiquidResizable` wraps react-resizable-panels with Liquid handles and panel group exports.

## Status

- Inventory: `resizable`, implemented
- Export: `LiquidResizable`
- Source: `src/components/LiquidResizable.tsx`
- Story: `stories/LiquidResizable.stories.tsx`
- Registry item: `registry/components/liquid-resizable.json`
- Visual profile: `layout`
- npm package: not published to npm yet.

## Usage

```tsx
import {
  LiquidResizablePanelGroup,
  LiquidResizable,
  LiquidResizablePanel,
  LiquidResizableHandle
} from "@clean99/liquid-glass";

export function Example() {
  return (
    <LiquidResizable direction="horizontal" style={{ height: 240 }}>
      <LiquidResizablePanel defaultSize={35}>Sidebar</LiquidResizablePanel>
      <LiquidResizableHandle withHandle />
      <LiquidResizablePanel defaultSize={65}>Main</LiquidResizablePanel>
    </LiquidResizable>
  );
}
```

## Anatomy

The panel group owns layout direction, panels define size constraints, and handles expose the drag affordance.

| Public part                 | Role                                                                    |
| --------------------------- | ----------------------------------------------------------------------- |
| `LiquidResizablePanelGroup` | Exported component or helper from `src/components/LiquidResizable.tsx`. |
| `LiquidResizable`           | Exported component or helper from `src/components/LiquidResizable.tsx`. |
| `LiquidResizablePanel`      | Exported component or helper from `src/components/LiquidResizable.tsx`. |
| `LiquidResizableHandle`     | Exported component or helper from `src/components/LiquidResizable.tsx`. |

## API

| API surface                      | Notes                                                                         |
| -------------------------------- | ----------------------------------------------------------------------------- |
| `LiquidResizablePanelGroupProps` | Public TypeScript surface exported from `src/components/LiquidResizable.tsx`. |
| `LiquidResizablePanelProps`      | Public TypeScript surface exported from `src/components/LiquidResizable.tsx`. |
| `LiquidResizableHandleProps`     | Public TypeScript surface exported from `src/components/LiquidResizable.tsx`. |

The component also accepts the native HTML attributes documented by its source
props type. Local material settings follow the same rules as `LiquidSurface`
when the implementation renders a Liquid surface.

## Visual States

The layout profile expects dense content, overflow, nested surface, responsive, material modes, and environment coverage.

Storybook coverage comes from `stories/LiquidResizable.stories.tsx`. The component is assigned
to the `layout` profile in `docs/visual-state-coverage.json`.

## Accessibility

Label split panes when the surrounding context is not obvious. Keep keyboard and pointer resizing from trapping focus.

## Verification

- `tests/components.test.tsx` exercises the implemented component surface.
- `stories/LiquidResizable.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-resizable.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
