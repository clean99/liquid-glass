# LiquidDataTable

`LiquidDataTable` wraps TanStack Table with sorting, filtering, row state, and Liquid table presentation.

## Status

- Inventory: `data-table`, implemented
- Export: `LiquidDataTable`
- Source: `src/components/LiquidDataTable.tsx`
- Story: `stories/LiquidDataTable.stories.tsx`
- Registry item: `registry/components/liquid-data-table.json`
- Visual profile: `data`
- npm package: not published to npm yet.

## Usage

```tsx
import { LiquidDataTable } from "@clean99/liquid-glass";

export function Example() {
  return <LiquidDataTable columns={columns} data={rows} getRowId={(row) => row.id} />;
}
```

## Anatomy

Column definitions and data create the table model. The component renders header groups, body rows, empty state, and optional toolbar areas from that model.

| Public part       | Role                                                                    |
| ----------------- | ----------------------------------------------------------------------- |
| `LiquidDataTable` | Exported component or helper from `src/components/LiquidDataTable.tsx`. |

## API

| API surface                | Notes                                                                         |
| -------------------------- | ----------------------------------------------------------------------------- |
| `LiquidDataTableColumnDef` | Public TypeScript surface exported from `src/components/LiquidDataTable.tsx`. |
| `LiquidDataTableProps`     | Public TypeScript surface exported from `src/components/LiquidDataTable.tsx`. |

The component also accepts the native HTML attributes documented by its source
props type. Local material settings follow the same rules as `LiquidSurface`
when the implementation renders a Liquid surface.

## Visual States

The data profile expects default, empty, sorted, filtered, dense content, overflow, material modes, and environment coverage.

Storybook coverage comes from `stories/LiquidDataTable.stories.tsx`. The component is assigned
to the `data` profile in `docs/visual-state-coverage.json`.

## Accessibility

Use clear column headers and stable row identifiers. Filtering and sorting controls should have visible labels or aria labels.

## Verification

- `tests/components.test.tsx` exercises the implemented component surface.
- `stories/LiquidDataTable.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-data-table.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
