# Component Map

This page is the shadcn-style component directory for `@clean99/liquid-glass`.
It gives every implemented public component one discoverable row, even when the
full written component page is still pending. The source of truth is
`docs/component-inventory.json`; visual evidence is tracked in
`docs/visual-state-coverage.json`; registry files are generated under
`registry/components/`.

Do not treat "Storybook + inventory" as finished written docs. It means the
component is implemented, exported, covered by Storybook metadata, covered by
component tests, and has a generated registry item, but still needs the full
written page shape from `docs/component-documentation.md`.

## Status

- Implemented public components: 60.
- Full written component pages: Provider, Surface, Accordion, Button, Card,
  Checkbox, Combobox, DatePicker, Dialog, DropdownMenu, Field, SearchBox,
  Select, Sidebar, Slider, Switch, Tabs.
- npm package: not published to npm yet.
- shadcn-style registry: generated and testable, but live install commands wait
  for npm publish.
- Storybook Pages: workflow builds; public site waits for GitHub Pages settings.
- Kube exact parity: not claimed until `pnpm test:kube-reference:exact` passes.

## Coverage Flow

```mermaid
flowchart TD
  Inventory["docs/component-inventory.json"] --> Map["docs/components/map.md"]
  Coverage["docs/visual-state-coverage.json"] --> Map
  Source["src/components/*.tsx"] --> Map
  Stories["stories/*.stories.tsx"] --> Map
  Registry["registry/components/liquid-*.json"] --> Map
  Map --> ComponentPages["docs/components/*.md"]
  ComponentPages --> DocsGate["pnpm test:docs"]
  Map --> DocsGate
```

## Category Count

| Category     | Count |
| ------------ | ----: |
| `command`    |     1 |
| `control`    |    10 |
| `data`       |     3 |
| `date-time`  |     2 |
| `disclosure` |     2 |
| `display`    |     3 |
| `feedback`   |     7 |
| `form`       |     8 |
| `layout`     |     5 |
| `media`      |     2 |
| `navigation` |     6 |
| `overlay`    |     9 |
| `typography` |     1 |
| `utility`    |     1 |

## Implemented Component Directory

| Export                   | Slug              | Category     | Visual profile | Source                                      | Story                                        | Registry                                          | Written page                       |
| ------------------------ | ----------------- | ------------ | -------------- | ------------------------------------------- | -------------------------------------------- | ------------------------------------------------- | ---------------------------------- |
| `LiquidAccordion`        | `accordion`       | `disclosure` | `disclosure`   | `src/components/LiquidAccordion.tsx`        | `stories/LiquidAccordion.stories.tsx`        | `registry/components/liquid-accordion.json`       | `docs/components/accordion.md`     |
| `LiquidAlert`            | `alert`           | `feedback`   | `feedback`     | `src/components/LiquidAlert.tsx`            | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-alert.json`           | Storybook + inventory              |
| `LiquidAlertDialog`      | `alert-dialog`    | `overlay`    | `overlay`      | `src/components/LiquidAlertDialog.tsx`      | `stories/LiquidOverlay.stories.tsx`          | `registry/components/liquid-alert-dialog.json`    | Storybook + inventory              |
| `LiquidAspectRatio`      | `aspect-ratio`    | `layout`     | `layout`       | `src/components/LiquidAspectRatio.tsx`      | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-aspect-ratio.json`    | Storybook + inventory              |
| `LiquidAvatar`           | `avatar`          | `media`      | `media`        | `src/components/LiquidAvatar.tsx`           | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-avatar.json`          | Storybook + inventory              |
| `LiquidBadge`            | `badge`           | `display`    | `display`      | `src/components/LiquidBadge.tsx`            | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-badge.json`           | Storybook + inventory              |
| `LiquidBreadcrumb`       | `breadcrumb`      | `navigation` | `navigation`   | `src/components/LiquidBreadcrumb.tsx`       | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-breadcrumb.json`      | Storybook + inventory              |
| `LiquidButton`           | `button`          | `control`    | `control`      | `src/components/LiquidButton.tsx`           | `stories/LiquidButton.stories.tsx`           | `registry/components/liquid-button.json`          | `docs/components/button.md`        |
| `LiquidButtonGroup`      | `button-group`    | `control`    | `control`      | `src/components/LiquidButtonGroup.tsx`      | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-button-group.json`    | Storybook + inventory              |
| `LiquidCalendar`         | `calendar`        | `date-time`  | `date-time`    | `src/components/LiquidCalendar.tsx`         | `stories/LiquidCalendar.stories.tsx`         | `registry/components/liquid-calendar.json`        | Storybook + inventory              |
| `LiquidCard`             | `card`            | `layout`     | `layout`       | `src/components/LiquidCard.tsx`             | `stories/LiquidCard.stories.tsx`             | `registry/components/liquid-card.json`            | `docs/components/card.md`          |
| `LiquidCarousel`         | `carousel`        | `media`      | `media`        | `src/components/LiquidCarousel.tsx`         | `stories/LiquidCarousel.stories.tsx`         | `registry/components/liquid-carousel.json`        | Storybook + inventory              |
| `LiquidChart`            | `chart`           | `data`       | `data`         | `src/components/LiquidChart.tsx`            | `stories/LiquidChart.stories.tsx`            | `registry/components/liquid-chart.json`           | Storybook + inventory              |
| `LiquidCheckbox`         | `checkbox`        | `control`    | `control`      | `src/components/LiquidCheckbox.tsx`         | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-checkbox.json`        | `docs/components/checkbox.md`      |
| `LiquidCollapsible`      | `collapsible`     | `disclosure` | `disclosure`   | `src/components/LiquidCollapsible.tsx`      | `stories/LiquidOverlay.stories.tsx`          | `registry/components/liquid-collapsible.json`     | Storybook + inventory              |
| `LiquidCombobox`         | `combobox`        | `control`    | `control`      | `src/components/LiquidCombobox.tsx`         | `stories/LiquidCommand.stories.tsx`          | `registry/components/liquid-combobox.json`        | `docs/components/combobox.md`      |
| `LiquidCommand`          | `command`         | `command`    | `command`      | `src/components/LiquidCommand.tsx`          | `stories/LiquidCommand.stories.tsx`          | `registry/components/liquid-command.json`         | Storybook + inventory              |
| `LiquidContextMenu`      | `context-menu`    | `overlay`    | `overlay`      | `src/components/LiquidContextMenu.tsx`      | `stories/LiquidOverlay.stories.tsx`          | `registry/components/liquid-context-menu.json`    | Storybook + inventory              |
| `LiquidDataTable`        | `data-table`      | `data`       | `data`         | `src/components/LiquidDataTable.tsx`        | `stories/LiquidDataTable.stories.tsx`        | `registry/components/liquid-data-table.json`      | Storybook + inventory              |
| `LiquidDatePicker`       | `date-picker`     | `date-time`  | `date-time`    | `src/components/LiquidDatePicker.tsx`       | `stories/LiquidDatePicker.stories.tsx`       | `registry/components/liquid-date-picker.json`     | `docs/components/date-picker.md`   |
| `LiquidDialog`           | `dialog`          | `overlay`    | `overlay`      | `src/components/LiquidDialog.tsx`           | `stories/LiquidDialog.stories.tsx`           | `registry/components/liquid-dialog.json`          | `docs/components/dialog.md`        |
| `LiquidDirection`        | `direction`       | `utility`    | `utility`      | `src/components/LiquidDirection.tsx`        | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-direction.json`       | Storybook + inventory              |
| `LiquidDrawer`           | `drawer`          | `overlay`    | `overlay`      | `src/components/LiquidDrawer.tsx`           | `stories/LiquidOverlay.stories.tsx`          | `registry/components/liquid-drawer.json`          | Storybook + inventory              |
| `LiquidDropdownMenu`     | `dropdown-menu`   | `overlay`    | `overlay`      | `src/components/LiquidDropdownMenu.tsx`     | `stories/LiquidOverlay.stories.tsx`          | `registry/components/liquid-dropdown-menu.json`   | `docs/components/dropdown-menu.md` |
| `LiquidEmpty`            | `empty`           | `feedback`   | `feedback`     | `src/components/LiquidEmpty.tsx`            | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-empty.json`           | Storybook + inventory              |
| `LiquidField`            | `field`           | `form`       | `form`         | `src/components/LiquidField.tsx`            | `stories/LiquidField.stories.tsx`            | `registry/components/liquid-field.json`           | `docs/components/field.md`         |
| `LiquidHoverCard`        | `hover-card`      | `overlay`    | `overlay`      | `src/components/LiquidHoverCard.tsx`        | `stories/LiquidOverlay.stories.tsx`          | `registry/components/liquid-hover-card.json`      | Storybook + inventory              |
| `LiquidInput`            | `input`           | `form`       | `form`         | `src/components/LiquidField.tsx`            | `stories/LiquidField.stories.tsx`            | `registry/components/liquid-input.json`           | Storybook + inventory              |
| `LiquidInputGroup`       | `input-group`     | `form`       | `form`         | `src/components/LiquidInputGroup.tsx`       | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-input-group.json`     | Storybook + inventory              |
| `LiquidInputOtp`         | `input-otp`       | `form`       | `form`         | `src/components/LiquidInputOtp.tsx`         | `stories/LiquidField.stories.tsx`            | `registry/components/liquid-input-otp.json`       | Storybook + inventory              |
| `LiquidItem`             | `item`            | `display`    | `display`      | `src/components/LiquidItem.tsx`             | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-item.json`            | Storybook + inventory              |
| `LiquidKbd`              | `kbd`             | `display`    | `display`      | `src/components/LiquidKbd.tsx`              | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-kbd.json`             | Storybook + inventory              |
| `LiquidLabel`            | `label`           | `form`       | `form`         | `src/components/LiquidField.tsx`            | `stories/LiquidField.stories.tsx`            | `registry/components/liquid-label.json`           | Storybook + inventory              |
| `LiquidMenubar`          | `menubar`         | `navigation` | `navigation`   | `src/components/LiquidMenubar.tsx`          | `stories/LiquidOverlay.stories.tsx`          | `registry/components/liquid-menubar.json`         | Storybook + inventory              |
| `LiquidNativeSelect`     | `native-select`   | `form`       | `form`         | `src/components/LiquidNativeSelect.tsx`     | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-native-select.json`   | Storybook + inventory              |
| `LiquidNav`              | `navigation-menu` | `navigation` | `navigation`   | `src/components/LiquidNav.tsx`              | `stories/LiquidNav.stories.tsx`              | `registry/components/liquid-navigation-menu.json` | Storybook + inventory              |
| `LiquidPagination`       | `pagination`      | `navigation` | `navigation`   | `src/components/LiquidPagination.tsx`       | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-pagination.json`      | Storybook + inventory              |
| `LiquidPopover`          | `popover`         | `overlay`    | `overlay`      | `src/components/LiquidPopover.tsx`          | `stories/LiquidOverlay.stories.tsx`          | `registry/components/liquid-popover.json`         | Storybook + inventory              |
| `LiquidProgress`         | `progress`        | `feedback`   | `feedback`     | `src/components/LiquidProgress.tsx`         | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-progress.json`        | Storybook + inventory              |
| `LiquidRadioGroup`       | `radio-group`     | `control`    | `control`      | `src/components/LiquidRadioGroup.tsx`       | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-radio-group.json`     | Storybook + inventory              |
| `LiquidResizable`        | `resizable`       | `layout`     | `layout`       | `src/components/LiquidResizable.tsx`        | `stories/LiquidResizable.stories.tsx`        | `registry/components/liquid-resizable.json`       | Storybook + inventory              |
| `LiquidScrollArea`       | `scroll-area`     | `layout`     | `layout`       | `src/components/LiquidScrollArea.tsx`       | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-scroll-area.json`     | Storybook + inventory              |
| `LiquidSearchBox`        | `searchbox`       | `form`       | `form`         | `src/components/LiquidSearchBox.tsx`        | `stories/LiquidSearchBox.stories.tsx`        | `registry/components/liquid-searchbox.json`       | `docs/components/searchbox.md`     |
| `LiquidSelect`           | `select`          | `control`    | `control`      | `src/components/LiquidSelect.tsx`           | `stories/LiquidField.stories.tsx`            | `registry/components/liquid-select.json`          | `docs/components/select.md`        |
| `LiquidSeparator`        | `separator`       | `layout`     | `layout`       | `src/components/LiquidSeparator.tsx`        | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-separator.json`       | Storybook + inventory              |
| `LiquidSheet`            | `sheet`           | `overlay`    | `overlay`      | `src/components/LiquidSheet.tsx`            | `stories/LiquidOverlay.stories.tsx`          | `registry/components/liquid-sheet.json`           | Storybook + inventory              |
| `LiquidSidebar`          | `sidebar`         | `navigation` | `navigation`   | `src/components/LiquidSidebar.tsx`          | `stories/LiquidSidebar.stories.tsx`          | `registry/components/liquid-sidebar.json`         | `docs/components/sidebar.md`       |
| `LiquidSkeleton`         | `skeleton`        | `feedback`   | `feedback`     | `src/components/LiquidSkeleton.tsx`         | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-skeleton.json`        | Storybook + inventory              |
| `LiquidSpinner`          | `spinner`         | `feedback`   | `feedback`     | `src/components/LiquidSpinner.tsx`          | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-spinner.json`         | Storybook + inventory              |
| `LiquidSlider`           | `slider`          | `control`    | `control`      | `src/components/LiquidSlider.tsx`           | `stories/LiquidSlider.stories.tsx`           | `registry/components/liquid-slider.json`          | `docs/components/slider.md`        |
| `LiquidToaster`          | `sonner`          | `feedback`   | `feedback`     | `src/components/LiquidToast.tsx`            | `stories/LiquidToast.stories.tsx`            | `registry/components/liquid-sonner.json`          | Storybook + inventory              |
| `LiquidSwitch`           | `switch`          | `control`    | `control`      | `src/components/LiquidSwitch.tsx`           | `stories/LiquidSwitch.stories.tsx`           | `registry/components/liquid-switch.json`          | `docs/components/switch.md`        |
| `LiquidTable`            | `table`           | `data`       | `data`         | `src/components/LiquidTable.tsx`            | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-table.json`           | Storybook + inventory              |
| `LiquidTabs`             | `tabs`            | `navigation` | `navigation`   | `src/components/LiquidTabs.tsx`             | `stories/LiquidTabs.stories.tsx`             | `registry/components/liquid-tabs.json`            | `docs/components/tabs.md`          |
| `LiquidTextarea`         | `textarea`        | `form`       | `form`         | `src/components/LiquidField.tsx`            | `stories/LiquidField.stories.tsx`            | `registry/components/liquid-textarea.json`        | Storybook + inventory              |
| `LiquidToast`            | `toast`           | `feedback`   | `feedback`     | `src/components/LiquidToast.tsx`            | `stories/LiquidToast.stories.tsx`            | `registry/components/liquid-toast.json`           | Storybook + inventory              |
| `LiquidToggle`           | `toggle`          | `control`    | `control`      | `src/components/LiquidToggle.tsx`           | `stories/LiquidToggle.stories.tsx`           | `registry/components/liquid-toggle.json`          | Storybook + inventory              |
| `LiquidSegmentedControl` | `toggle-group`    | `control`    | `control`      | `src/components/LiquidSegmentedControl.tsx` | `stories/LiquidSegmentedControl.stories.tsx` | `registry/components/liquid-toggle-group.json`    | Storybook + inventory              |
| `LiquidTooltip`          | `tooltip`         | `overlay`    | `overlay`      | `src/components/LiquidTooltip.tsx`          | `stories/LiquidOverlay.stories.tsx`          | `registry/components/liquid-tooltip.json`         | Storybook + inventory              |
| `LiquidTypography`       | `typography`      | `typography` | `typography`   | `src/components/LiquidTypography.tsx`       | `stories/LiquidFoundation.stories.tsx`       | `registry/components/liquid-typography.json`      | Storybook + inventory              |

## Written Page Backlog

The backlog is not a mystery queue. Prioritize it by user-facing risk:

1. Form and control components: inputs, toggle, radio group, native select, OTP,
   and remaining date controls.
2. Overlay and navigation components: dialog-adjacent primitives, context menu,
   menubar, navigation menu, pagination, popover, sheet, tooltip, and drawer.
3. Data and layout components: table, data table, chart, resizable, scroll area,
   carousel, and display helpers.
4. Feedback and utility components: alert, toast, sonner, spinner, progress,
   typography, kbd, item, and direction.

Each new written page must follow `docs/component-documentation.md` and keep the
same honesty rules: no live npm install claims before publish, no exact Kube
claim before the exact gate passes, and no copied third-party source or prose.
