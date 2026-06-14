# LiquidPagination

`LiquidPagination` provides semantic pagination wrappers, links, previous/next controls, and ellipsis markers.

## Status

- Inventory: `pagination`, implemented
- Export: `LiquidPagination`
- Source: `src/components/LiquidPagination.tsx`
- Story: `stories/LiquidFoundation.stories.tsx`
- Registry item: `registry/components/liquid-pagination.json`
- Visual profile: `navigation`
- npm package: not published to npm yet.

## Usage

```tsx
import {
  LiquidPagination,
  LiquidPaginationList,
  LiquidPaginationItem,
  LiquidPaginationLink,
  LiquidPaginationPrevious,
  LiquidPaginationNext,
  LiquidPaginationEllipsis
} from "@clean99/liquid-glass";

export function Example() {
  return (
    <LiquidPagination>
      <LiquidPaginationList>
        <LiquidPaginationItem>
          <LiquidPaginationPrevious href="#previous" />
        </LiquidPaginationItem>
        <LiquidPaginationItem>
          <LiquidPaginationLink href="#page-1" isActive>
            1
          </LiquidPaginationLink>
        </LiquidPaginationItem>
        <LiquidPaginationItem>
          <LiquidPaginationNext href="#next" />
        </LiquidPaginationItem>
      </LiquidPaginationList>
    </LiquidPagination>
  );
}
```

## Anatomy

The root is navigation, list groups links, items preserve list semantics, active links mark the current page, and ellipsis is non-interactive.

| Public part                | Role                                                                     |
| -------------------------- | ------------------------------------------------------------------------ |
| `LiquidPagination`         | Exported component or helper from `src/components/LiquidPagination.tsx`. |
| `LiquidPaginationList`     | Exported component or helper from `src/components/LiquidPagination.tsx`. |
| `LiquidPaginationItem`     | Exported component or helper from `src/components/LiquidPagination.tsx`. |
| `LiquidPaginationLink`     | Exported component or helper from `src/components/LiquidPagination.tsx`. |
| `LiquidPaginationPrevious` | Exported component or helper from `src/components/LiquidPagination.tsx`. |
| `LiquidPaginationNext`     | Exported component or helper from `src/components/LiquidPagination.tsx`. |
| `LiquidPaginationEllipsis` | Exported component or helper from `src/components/LiquidPagination.tsx`. |

## API

| API surface                     | Notes                                                                          |
| ------------------------------- | ------------------------------------------------------------------------------ |
| `LiquidPaginationProps`         | Public TypeScript surface exported from `src/components/LiquidPagination.tsx`. |
| `LiquidPaginationListProps`     | Public TypeScript surface exported from `src/components/LiquidPagination.tsx`. |
| `LiquidPaginationItemProps`     | Public TypeScript surface exported from `src/components/LiquidPagination.tsx`. |
| `LiquidPaginationLinkProps`     | Public TypeScript surface exported from `src/components/LiquidPagination.tsx`. |
| `LiquidPaginationPreviousProps` | Public TypeScript surface exported from `src/components/LiquidPagination.tsx`. |
| `LiquidPaginationNextProps`     | Public TypeScript surface exported from `src/components/LiquidPagination.tsx`. |
| `LiquidPaginationEllipsisProps` | Public TypeScript surface exported from `src/components/LiquidPagination.tsx`. |

The component also accepts the native HTML attributes documented by its source
props type. Local material settings follow the same rules as `LiquidSurface`
when the implementation renders a Liquid surface.

## Visual States

The navigation profile expects default, hover, focus-visible, current item, collapsed, overflow, material modes, and environment coverage.

Storybook coverage comes from `stories/LiquidFoundation.stories.tsx`. The component is assigned
to the `navigation` profile in `docs/visual-state-coverage.json`.

## Accessibility

Use meaningful hrefs and aria labels for previous and next controls. Mark the current page with the active link state.

## Verification

- `tests/components.test.tsx` exercises the implemented component surface.
- `stories/LiquidFoundation.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-pagination.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
