# Component Inventory

The source of truth is `docs/component-inventory.json`.

The inventory tracks component coverage against the shadcn/ui baseline in `docs/shadcn-parity.json`. It is intentionally honest:

- `implemented`: exported, has source, has Storybook coverage, and is checked by `pnpm test:inventory`
- `planned`: part of the product-ready target but not shipped yet
- `research`: requires design or accessibility research before implementation

Run:

```sh
pnpm test:inventory
```

This prevents implemented components from drifting out of `src/index.ts`, source files, or Storybook coverage, and prevents the parity baseline from losing official shadcn/ui component entries.
