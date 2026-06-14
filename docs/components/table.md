# LiquidTable

`LiquidTable` provides semantic table primitives with Liquid container styling.

## Status

- Inventory: `table`, implemented
- Export: `LiquidTable`
- Source: `src/components/LiquidTable.tsx`
- Story: `stories/LiquidFoundation.stories.tsx`
- Registry item: `registry/components/liquid-table.json`
- Visual profile: `data`
- npm package: not published to npm yet.

## Usage

```tsx
import {
  LiquidTableContainer,
  LiquidTable,
  LiquidTableHeader,
  LiquidTableBody,
  LiquidTableFooter,
  LiquidTableRow,
  LiquidTableHead,
  LiquidTableCell,
  LiquidTableCaption
} from "@clean99/liquid-glass";

export function Example() {
  return (
    <LiquidTableContainer>
      <LiquidTable>
        <LiquidTableHeader>
          <LiquidTableRow>
            <LiquidTableHead>Name</LiquidTableHead>
          </LiquidTableRow>
        </LiquidTableHeader>
        <LiquidTableBody>
          <LiquidTableRow>
            <LiquidTableCell>Surface</LiquidTableCell>
          </LiquidTableRow>
        </LiquidTableBody>
      </LiquidTable>
    </LiquidTableContainer>
  );
}
```

## Anatomy

The container handles overflow. Table, header, body, footer, row, head, cell, and caption preserve native table semantics.

| Public part            | Role                                                                |
| ---------------------- | ------------------------------------------------------------------- |
| `LiquidTableContainer` | Exported component or helper from `src/components/LiquidTable.tsx`. |
| `LiquidTable`          | Exported component or helper from `src/components/LiquidTable.tsx`. |
| `LiquidTableHeader`    | Exported component or helper from `src/components/LiquidTable.tsx`. |
| `LiquidTableBody`      | Exported component or helper from `src/components/LiquidTable.tsx`. |
| `LiquidTableFooter`    | Exported component or helper from `src/components/LiquidTable.tsx`. |
| `LiquidTableRow`       | Exported component or helper from `src/components/LiquidTable.tsx`. |
| `LiquidTableHead`      | Exported component or helper from `src/components/LiquidTable.tsx`. |
| `LiquidTableCell`      | Exported component or helper from `src/components/LiquidTable.tsx`. |
| `LiquidTableCaption`   | Exported component or helper from `src/components/LiquidTable.tsx`. |

## API

| API surface                 | Notes                                                                     |
| --------------------------- | ------------------------------------------------------------------------- |
| `LiquidTableContainerProps` | Public TypeScript surface exported from `src/components/LiquidTable.tsx`. |
| `LiquidTableProps`          | Public TypeScript surface exported from `src/components/LiquidTable.tsx`. |
| `LiquidTableHeaderProps`    | Public TypeScript surface exported from `src/components/LiquidTable.tsx`. |
| `LiquidTableBodyProps`      | Public TypeScript surface exported from `src/components/LiquidTable.tsx`. |
| `LiquidTableFooterProps`    | Public TypeScript surface exported from `src/components/LiquidTable.tsx`. |
| `LiquidTableRowProps`       | Public TypeScript surface exported from `src/components/LiquidTable.tsx`. |
| `LiquidTableHeadProps`      | Public TypeScript surface exported from `src/components/LiquidTable.tsx`. |
| `LiquidTableCellProps`      | Public TypeScript surface exported from `src/components/LiquidTable.tsx`. |
| `LiquidTableCaptionProps`   | Public TypeScript surface exported from `src/components/LiquidTable.tsx`. |

The component also accepts the native HTML attributes documented by its source
props type. Local material settings follow the same rules as `LiquidSurface`
when the implementation renders a Liquid surface.

## Visual States

The data profile expects default, empty, sorted, filtered, dense content, overflow, material modes, and environment coverage.

Storybook coverage comes from `stories/LiquidFoundation.stories.tsx`. The component is assigned
to the `data` profile in `docs/visual-state-coverage.json`.

## Accessibility

Use real headers and captions when helpful. Do not replace tabular data with div rows when a table is the right structure.

## Verification

- `tests/components.test.tsx` exercises the implemented component surface.
- `stories/LiquidFoundation.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-table.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
