# LiquidCommand

`LiquidCommand` implements a keyboard-searchable command surface with input, list, groups, empty state, separator, and selectable items.

## Status

- Inventory: `command`, implemented
- Export: `LiquidCommand`
- Source: `src/components/LiquidCommand.tsx`
- Story: `stories/LiquidCommand.stories.tsx`
- Registry item: `registry/components/liquid-command.json`
- Visual profile: `command`
- npm package: not published to npm yet.

## Usage

```tsx
import {
  LiquidCommand,
  LiquidCommandInput,
  LiquidCommandList,
  LiquidCommandEmpty,
  LiquidCommandGroup,
  LiquidCommandSeparator,
  LiquidCommandItem
} from "@clean99/liquid-glass";

export function Example() {
  return (
    <LiquidCommand onValueSelect={(value) => runCommand(value)}>
      <LiquidCommandInput aria-label="Search commands" />
      <LiquidCommandList>
        <LiquidCommandEmpty>No command found.</LiquidCommandEmpty>
        <LiquidCommandGroup heading="Navigation">
          <LiquidCommandItem value="docs">Open docs</LiquidCommandItem>
        </LiquidCommandGroup>
      </LiquidCommandList>
    </LiquidCommand>
  );
}
```

## Anatomy

The root owns filtering and active item state. Input drives query state, list exposes results, groups organize records, and items call selection handlers.

| Public part              | Role                                                                  |
| ------------------------ | --------------------------------------------------------------------- |
| `LiquidCommand`          | Exported component or helper from `src/components/LiquidCommand.tsx`. |
| `LiquidCommandInput`     | Exported component or helper from `src/components/LiquidCommand.tsx`. |
| `LiquidCommandList`      | Exported component or helper from `src/components/LiquidCommand.tsx`. |
| `LiquidCommandEmpty`     | Exported component or helper from `src/components/LiquidCommand.tsx`. |
| `LiquidCommandGroup`     | Exported component or helper from `src/components/LiquidCommand.tsx`. |
| `LiquidCommandSeparator` | Exported component or helper from `src/components/LiquidCommand.tsx`. |
| `LiquidCommandItem`      | Exported component or helper from `src/components/LiquidCommand.tsx`. |

## API

| API surface                   | Notes                                                                       |
| ----------------------------- | --------------------------------------------------------------------------- |
| `LiquidCommandProps`          | Public TypeScript surface exported from `src/components/LiquidCommand.tsx`. |
| `LiquidCommandInputProps`     | Public TypeScript surface exported from `src/components/LiquidCommand.tsx`. |
| `LiquidCommandListProps`      | Public TypeScript surface exported from `src/components/LiquidCommand.tsx`. |
| `LiquidCommandEmptyProps`     | Public TypeScript surface exported from `src/components/LiquidCommand.tsx`. |
| `LiquidCommandGroupProps`     | Public TypeScript surface exported from `src/components/LiquidCommand.tsx`. |
| `LiquidCommandSeparatorProps` | Public TypeScript surface exported from `src/components/LiquidCommand.tsx`. |
| `LiquidCommandItemProps`      | Public TypeScript surface exported from `src/components/LiquidCommand.tsx`. |

The component also accepts the native HTML attributes documented by its source
props type. Local material settings follow the same rules as `LiquidSurface`
when the implementation renders a Liquid surface.

## Visual States

The command profile expects default, active item, empty, keyboard navigation, long labels, material modes, and environment coverage.

Storybook coverage comes from `stories/LiquidCommand.stories.tsx`. The component is assigned
to the `command` profile in `docs/visual-state-coverage.json`.

## Accessibility

Provide an input label and keep item labels concise. Disabled items must remain non-selectable through keyboard and pointer paths.

## Verification

- `tests/components.test.tsx` exercises the implemented component surface.
- `stories/LiquidCommand.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-command.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
