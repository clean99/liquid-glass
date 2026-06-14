# Component Docs

These pages turn the component documentation contract into source-readable
component pages. They follow `docs/component-documentation.md`: status, install
honesty, usage, anatomy, API, visual states, accessibility, registry, and
verification evidence.

The docs are intentionally package-backed. They describe the public exports in
`src/index.ts`; they do not copy component code from shadcn/ui, Radix UI,
Chakra UI, HeroUI, or any other project.

For a shadcn-style directory of every implemented component, see
`docs/components/map.md`. That page is the discoverability bridge between the
generated inventory and the full written component pages.

## Status

- npm package: not published to npm yet.
- Registry install: prepared, but live consumer commands wait for npm publish.
- Storybook Pages: workflow builds; public deploy waits for GitHub Pages source
  settings.
- Kube exact parity: not claimed until `pnpm test:kube-reference:exact` passes.

## Written Component Pages

| Component                | Page                                 | Source                                      | Story                                        | Registry                                          |
| ------------------------ | ------------------------------------ | ------------------------------------------- | -------------------------------------------- | ------------------------------------------------- |
| `LiquidProvider`         | `docs/components/provider.md`        | `src/providers/LiquidProvider.tsx`          | `stories/LiquidSurface.stories.tsx`          | Not a registry item                               |
| `LiquidSurface`          | `docs/components/surface.md`         | `src/components/LiquidSurface.tsx`          | `stories/LiquidSurface.stories.tsx`          | Not a registry item                               |
| `LiquidAccordion`        | `docs/components/accordion.md`       | `src/components/LiquidAccordion.tsx`        | `stories/LiquidAccordion.stories.tsx`        | `registry/components/liquid-accordion.json`       |
| `LiquidAlert`            | `docs/components/alert.md`           | `src/components/LiquidAlert.tsx`            | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-alert.json`           |
| `LiquidAlertDialog`      | `docs/components/alert-dialog.md`    | `src/components/LiquidAlertDialog.tsx`      | `stories/LiquidOverlay.stories.tsx`          | `registry/components/liquid-alert-dialog.json`    |
| `LiquidAspectRatio`      | `docs/components/aspect-ratio.md`    | `src/components/LiquidAspectRatio.tsx`      | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-aspect-ratio.json`    |
| `LiquidAvatar`           | `docs/components/avatar.md`          | `src/components/LiquidAvatar.tsx`           | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-avatar.json`          |
| `LiquidBadge`            | `docs/components/badge.md`           | `src/components/LiquidBadge.tsx`            | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-badge.json`           |
| `LiquidBreadcrumb`       | `docs/components/breadcrumb.md`      | `src/components/LiquidBreadcrumb.tsx`       | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-breadcrumb.json`      |
| `LiquidButton`           | `docs/components/button.md`          | `src/components/LiquidButton.tsx`           | `stories/LiquidButton.stories.tsx`           | `registry/components/liquid-button.json`          |
| `LiquidButtonGroup`      | `docs/components/button-group.md`    | `src/components/LiquidButtonGroup.tsx`      | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-button-group.json`    |
| `LiquidCalendar`         | `docs/components/calendar.md`        | `src/components/LiquidCalendar.tsx`         | `stories/LiquidCalendar.stories.tsx`         | `registry/components/liquid-calendar.json`        |
| `LiquidCard`             | `docs/components/card.md`            | `src/components/LiquidCard.tsx`             | `stories/LiquidCard.stories.tsx`             | `registry/components/liquid-card.json`            |
| `LiquidCarousel`         | `docs/components/carousel.md`        | `src/components/LiquidCarousel.tsx`         | `stories/LiquidCarousel.stories.tsx`         | `registry/components/liquid-carousel.json`        |
| `LiquidChart`            | `docs/components/chart.md`           | `src/components/LiquidChart.tsx`            | `stories/LiquidChart.stories.tsx`            | `registry/components/liquid-chart.json`           |
| `LiquidCheckbox`         | `docs/components/checkbox.md`        | `src/components/LiquidCheckbox.tsx`         | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-checkbox.json`        |
| `LiquidCollapsible`      | `docs/components/collapsible.md`     | `src/components/LiquidCollapsible.tsx`      | `stories/LiquidOverlay.stories.tsx`          | `registry/components/liquid-collapsible.json`     |
| `LiquidCombobox`         | `docs/components/combobox.md`        | `src/components/LiquidCombobox.tsx`         | `stories/LiquidCommand.stories.tsx`          | `registry/components/liquid-combobox.json`        |
| `LiquidCommand`          | `docs/components/command.md`         | `src/components/LiquidCommand.tsx`          | `stories/LiquidCommand.stories.tsx`          | `registry/components/liquid-command.json`         |
| `LiquidContextMenu`      | `docs/components/context-menu.md`    | `src/components/LiquidContextMenu.tsx`      | `stories/LiquidOverlay.stories.tsx`          | `registry/components/liquid-context-menu.json`    |
| `LiquidDataTable`        | `docs/components/data-table.md`      | `src/components/LiquidDataTable.tsx`        | `stories/LiquidDataTable.stories.tsx`        | `registry/components/liquid-data-table.json`      |
| `LiquidDatePicker`       | `docs/components/date-picker.md`     | `src/components/LiquidDatePicker.tsx`       | `stories/LiquidDatePicker.stories.tsx`       | `registry/components/liquid-date-picker.json`     |
| `LiquidDialog`           | `docs/components/dialog.md`          | `src/components/LiquidDialog.tsx`           | `stories/LiquidDialog.stories.tsx`           | `registry/components/liquid-dialog.json`          |
| `LiquidDirection`        | `docs/components/direction.md`       | `src/components/LiquidDirection.tsx`        | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-direction.json`       |
| `LiquidDrawer`           | `docs/components/drawer.md`          | `src/components/LiquidDrawer.tsx`           | `stories/LiquidOverlay.stories.tsx`          | `registry/components/liquid-drawer.json`          |
| `LiquidDropdownMenu`     | `docs/components/dropdown-menu.md`   | `src/components/LiquidDropdownMenu.tsx`     | `stories/LiquidOverlay.stories.tsx`          | `registry/components/liquid-dropdown-menu.json`   |
| `LiquidEmpty`            | `docs/components/empty.md`           | `src/components/LiquidEmpty.tsx`            | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-empty.json`           |
| `LiquidField`            | `docs/components/field.md`           | `src/components/LiquidField.tsx`            | `stories/LiquidField.stories.tsx`            | `registry/components/liquid-field.json`           |
| `LiquidHoverCard`        | `docs/components/hover-card.md`      | `src/components/LiquidHoverCard.tsx`        | `stories/LiquidOverlay.stories.tsx`          | `registry/components/liquid-hover-card.json`      |
| `LiquidInput`            | `docs/components/input.md`           | `src/components/LiquidField.tsx`            | `stories/LiquidField.stories.tsx`            | `registry/components/liquid-input.json`           |
| `LiquidInputGroup`       | `docs/components/input-group.md`     | `src/components/LiquidInputGroup.tsx`       | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-input-group.json`     |
| `LiquidInputOtp`         | `docs/components/input-otp.md`       | `src/components/LiquidInputOtp.tsx`         | `stories/LiquidField.stories.tsx`            | `registry/components/liquid-input-otp.json`       |
| `LiquidItem`             | `docs/components/item.md`            | `src/components/LiquidItem.tsx`             | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-item.json`            |
| `LiquidKbd`              | `docs/components/kbd.md`             | `src/components/LiquidKbd.tsx`              | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-kbd.json`             |
| `LiquidLabel`            | `docs/components/label.md`           | `src/components/LiquidField.tsx`            | `stories/LiquidField.stories.tsx`            | `registry/components/liquid-label.json`           |
| `LiquidMenubar`          | `docs/components/menubar.md`         | `src/components/LiquidMenubar.tsx`          | `stories/LiquidOverlay.stories.tsx`          | `registry/components/liquid-menubar.json`         |
| `LiquidNativeSelect`     | `docs/components/native-select.md`   | `src/components/LiquidNativeSelect.tsx`     | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-native-select.json`   |
| `LiquidNav`              | `docs/components/navigation-menu.md` | `src/components/LiquidNav.tsx`              | `stories/LiquidNav.stories.tsx`              | `registry/components/liquid-navigation-menu.json` |
| `LiquidPagination`       | `docs/components/pagination.md`      | `src/components/LiquidPagination.tsx`       | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-pagination.json`      |
| `LiquidPopover`          | `docs/components/popover.md`         | `src/components/LiquidPopover.tsx`          | `stories/LiquidOverlay.stories.tsx`          | `registry/components/liquid-popover.json`         |
| `LiquidProgress`         | `docs/components/progress.md`        | `src/components/LiquidProgress.tsx`         | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-progress.json`        |
| `LiquidRadioGroup`       | `docs/components/radio-group.md`     | `src/components/LiquidRadioGroup.tsx`       | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-radio-group.json`     |
| `LiquidResizable`        | `docs/components/resizable.md`       | `src/components/LiquidResizable.tsx`        | `stories/LiquidResizable.stories.tsx`        | `registry/components/liquid-resizable.json`       |
| `LiquidScrollArea`       | `docs/components/scroll-area.md`     | `src/components/LiquidScrollArea.tsx`       | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-scroll-area.json`     |
| `LiquidSearchBox`        | `docs/components/searchbox.md`       | `src/components/LiquidSearchBox.tsx`        | `stories/LiquidSearchBox.stories.tsx`        | `registry/components/liquid-searchbox.json`       |
| `LiquidSelect`           | `docs/components/select.md`          | `src/components/LiquidSelect.tsx`           | `stories/LiquidField.stories.tsx`            | `registry/components/liquid-select.json`          |
| `LiquidSeparator`        | `docs/components/separator.md`       | `src/components/LiquidSeparator.tsx`        | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-separator.json`       |
| `LiquidSheet`            | `docs/components/sheet.md`           | `src/components/LiquidSheet.tsx`            | `stories/LiquidOverlay.stories.tsx`          | `registry/components/liquid-sheet.json`           |
| `LiquidSidebar`          | `docs/components/sidebar.md`         | `src/components/LiquidSidebar.tsx`          | `stories/LiquidSidebar.stories.tsx`          | `registry/components/liquid-sidebar.json`         |
| `LiquidSkeleton`         | `docs/components/skeleton.md`        | `src/components/LiquidSkeleton.tsx`         | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-skeleton.json`        |
| `LiquidSpinner`          | `docs/components/spinner.md`         | `src/components/LiquidSpinner.tsx`          | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-spinner.json`         |
| `LiquidSlider`           | `docs/components/slider.md`          | `src/components/LiquidSlider.tsx`           | `stories/LiquidSlider.stories.tsx`           | `registry/components/liquid-slider.json`          |
| `LiquidToaster`          | `docs/components/sonner.md`          | `src/components/LiquidToast.tsx`            | `stories/LiquidToast.stories.tsx`            | `registry/components/liquid-sonner.json`          |
| `LiquidSwitch`           | `docs/components/switch.md`          | `src/components/LiquidSwitch.tsx`           | `stories/LiquidSwitch.stories.tsx`           | `registry/components/liquid-switch.json`          |
| `LiquidTable`            | `docs/components/table.md`           | `src/components/LiquidTable.tsx`            | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-table.json`           |
| `LiquidTabs`             | `docs/components/tabs.md`            | `src/components/LiquidTabs.tsx`             | `stories/LiquidTabs.stories.tsx`             | `registry/components/liquid-tabs.json`            |
| `LiquidTextarea`         | `docs/components/textarea.md`        | `src/components/LiquidField.tsx`            | `stories/LiquidField.stories.tsx`            | `registry/components/liquid-textarea.json`        |
| `LiquidToast`            | `docs/components/toast.md`           | `src/components/LiquidToast.tsx`            | `stories/LiquidToast.stories.tsx`            | `registry/components/liquid-toast.json`           |
| `LiquidToggle`           | `docs/components/toggle.md`          | `src/components/LiquidToggle.tsx`           | `stories/LiquidToggle.stories.tsx`           | `registry/components/liquid-toggle.json`          |
| `LiquidSegmentedControl` | `docs/components/toggle-group.md`    | `src/components/LiquidSegmentedControl.tsx` | `stories/LiquidSegmentedControl.stories.tsx` | `registry/components/liquid-toggle-group.json`    |
| `LiquidTooltip`          | `docs/components/tooltip.md`         | `src/components/LiquidTooltip.tsx`          | `stories/LiquidOverlay.stories.tsx`          | `registry/components/liquid-tooltip.json`         |
| `LiquidTypography`       | `docs/components/typography.md`      | `src/components/LiquidTypography.tsx`       | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-typography.json`      |

## Full Directory

`docs/components/map.md` lists all 60 implemented public components with their
source file, Storybook evidence, visual profile, registry item, and written page
status. It follows the same role as the shadcn/ui component directory: a user
can scan the whole component surface from one place without guessing which
Storybook file or registry item owns a component. The written page set now
covers all 60 implemented component-map rows plus the Provider and Surface
foundation pages.

## Documentation Flow

```mermaid
flowchart TD
  Inventory["docs/component-inventory.json"] --> ComponentPage["docs/components/*.md"]
  Inventory --> ComponentMap["docs/components/map.md"]
  VisualState["docs/visual-state-coverage.json"] --> ComponentPage
  VisualState --> ComponentMap
  Source["src public exports"] --> ComponentPage
  Source --> ComponentMap
  Stories["Storybook stories"] --> ComponentPage
  Stories --> ComponentMap
  Registry["registry/components/*.json"] --> ComponentPage
  Registry --> ComponentMap
  ComponentMap --> ComponentPage
  ComponentPage --> DocsGate["pnpm test:docs"]
  ComponentMap --> DocsGate
  ComponentPage --> GovernanceGate["pnpm test:governance"]
```

## Add Or Update A Page

1. Start from `docs/component-documentation.md`.
2. Use `docs/component-inventory.json` for status, source, story, and category.
3. Use `docs/visual-state-coverage.json` for the state profile.
4. Link the generated registry item only when one exists.
5. Keep npm, Pages, and exact Kube parity claims honest.
6. Run the standard gate before review.

```sh
pnpm format
pnpm lint
pnpm typecheck
pnpm test:docs
pnpm test:release-readiness
pnpm test:unit
```
