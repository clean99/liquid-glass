# LiquidChart

`LiquidChart` provides a themed Recharts container, tooltip content, legend content, and CSS variables for chart tokens.

## Status

- Inventory: `chart`, implemented
- Export: `LiquidChart`
- Source: `src/components/LiquidChart.tsx`
- Story: `stories/LiquidChart.stories.tsx`
- Registry item: `registry/components/liquid-chart.json`
- Visual profile: `data`
- npm package: not published to npm yet.

## Usage

```tsx
import {
  LiquidChart,
  LiquidChartTooltip,
  LiquidChartLegend,
  LiquidChartContainer,
  LiquidChartStyle,
  LiquidChartTooltipContent,
  LiquidChartLegendContent
} from "@clean99/liquid-glass";
import { LineChart } from "recharts";

export function Example() {
  return (
    <LiquidChartContainer config={chartConfig}>
      <LineChart data={data}>
        <LiquidChartTooltip content={<LiquidChartTooltipContent />} />
      </LineChart>
    </LiquidChartContainer>
  );
}
```

## Anatomy

The container provides chart config through context. Tooltip and legend content read the payload and resolve labels, icons, colors, and indicators from that config.

| Public part                 | Role                                                                |
| --------------------------- | ------------------------------------------------------------------- |
| `LiquidChart`               | Exported component or helper from `src/components/LiquidChart.tsx`. |
| `LiquidChartTooltip`        | Exported component or helper from `src/components/LiquidChart.tsx`. |
| `LiquidChartLegend`         | Exported component or helper from `src/components/LiquidChart.tsx`. |
| `LiquidChartContainer`      | Exported component or helper from `src/components/LiquidChart.tsx`. |
| `LiquidChartStyle`          | Exported component or helper from `src/components/LiquidChart.tsx`. |
| `LiquidChartTooltipContent` | Exported component or helper from `src/components/LiquidChart.tsx`. |
| `LiquidChartLegendContent`  | Exported component or helper from `src/components/LiquidChart.tsx`. |

## API

| API surface                      | Notes                                                                     |
| -------------------------------- | ------------------------------------------------------------------------- |
| `LiquidChartContainerProps`      | Public TypeScript surface exported from `src/components/LiquidChart.tsx`. |
| `LiquidChartTooltipContentProps` | Public TypeScript surface exported from `src/components/LiquidChart.tsx`. |
| `LiquidChartLegendContentProps`  | Public TypeScript surface exported from `src/components/LiquidChart.tsx`. |

The component also accepts the native HTML attributes documented by its source
props type. Local material settings follow the same rules as `LiquidSurface`
when the implementation renders a Liquid surface.

## Visual States

The data profile expects default, empty, sorted, filtered, dense content, overflow, material modes, and environment coverage.

Storybook coverage comes from `stories/LiquidChart.stories.tsx`. The component is assigned
to the `data` profile in `docs/visual-state-coverage.json`.

## Accessibility

Charts still need surrounding text, table equivalents, or summaries for critical data. The visual wrapper does not turn a chart into a complete accessible data explanation.

## Verification

- `tests/components.test.tsx` exercises the implemented component surface.
- `stories/LiquidChart.stories.tsx` carries `parameters.visualState`.
- `registry/components/liquid-chart.json` is generated from inventory.
- `pnpm test:unit`
- `pnpm test:visual-docs`
- `pnpm test:registry`
