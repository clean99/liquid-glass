import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  LiquidCollapsible,
  LiquidCollapsibleContent,
  LiquidCollapsibleTrigger,
  LiquidHoverCard,
  LiquidHoverCardContent,
  LiquidHoverCardTrigger,
  LiquidPopover,
  LiquidPopoverClose,
  LiquidPopoverContent,
  LiquidPopoverTrigger,
  LiquidSheet,
  LiquidSheetClose,
  LiquidSheetContent,
  LiquidSheetDescription,
  LiquidSheetFooter,
  LiquidSheetHeader,
  LiquidSheetTitle,
  LiquidSheetTrigger,
  LiquidTooltip,
  LiquidTooltipContent,
  LiquidTooltipTrigger,
  LiquidTypography
} from "../src";
import { StoryFrame } from "./story-fixtures";

const meta = {
  title: "Liquid Glass/Overlay Primitives",
  parameters: { a11y: { test: "error" } }
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Light: Story = {
  render: () => (
    <StoryFrame mode="fallback" theme="light" width={680}>
      <OverlayExample />
    </StoryFrame>
  )
};

export const Dark: Story = {
  render: () => (
    <StoryFrame mode="fallback" theme="dark" width={680}>
      <OverlayExample />
    </StoryFrame>
  )
};

function OverlayExample() {
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <LiquidTypography variant="h2">Overlay primitives</LiquidTypography>
      <LiquidTypography variant="lead">
        Popovers and sheets use clear foreground content over a controlled material shell.
      </LiquidTypography>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <LiquidPopover>
          <LiquidPopoverTrigger>Open popover</LiquidPopoverTrigger>
          <LiquidPopoverContent align="start">
            <LiquidTypography variant="h3">Release channel</LiquidTypography>
            <LiquidTypography variant="muted">
              Enhanced refraction is capped by surface budget and browser capability.
            </LiquidTypography>
            <LiquidPopoverClose>Done</LiquidPopoverClose>
          </LiquidPopoverContent>
        </LiquidPopover>

        <LiquidTooltip delayDuration={0}>
          <LiquidTooltipTrigger>Hover tooltip</LiquidTooltipTrigger>
          <LiquidTooltipContent>Small help text, not a hard outline.</LiquidTooltipContent>
        </LiquidTooltip>

        <LiquidHoverCard openDelay={0}>
          <LiquidHoverCardTrigger href="#">Hover card</LiquidHoverCardTrigger>
          <LiquidHoverCardContent>
            <LiquidTypography variant="h3">Frontend systems</LiquidTypography>
            <LiquidTypography variant="muted">
              Dense, readable, and backed by deterministic behavior tests.
            </LiquidTypography>
          </LiquidHoverCardContent>
        </LiquidHoverCard>

        <LiquidSheet>
          <LiquidSheetTrigger>Open sheet</LiquidSheetTrigger>
          <LiquidSheetContent side="right">
            <LiquidSheetHeader>
              <LiquidSheetTitle>Project settings</LiquidSheetTitle>
              <LiquidSheetDescription>
                Sheet content uses dialog semantics with a side-mounted material surface.
              </LiquidSheetDescription>
            </LiquidSheetHeader>
            <LiquidTypography variant="p">
              Use sheets for focused editing. Long article content should stay outside glass.
            </LiquidTypography>
            <LiquidSheetFooter>
              <LiquidSheetClose>Close</LiquidSheetClose>
            </LiquidSheetFooter>
          </LiquidSheetContent>
        </LiquidSheet>
      </div>

      <LiquidCollapsible defaultOpen>
        <LiquidCollapsibleTrigger>Toggle implementation notes</LiquidCollapsibleTrigger>
        <LiquidCollapsibleContent>
          <LiquidTypography variant="p">
            Collapsible content is a labelled region. Trigger state is exposed with aria-expanded
            and aria-controls.
          </LiquidTypography>
        </LiquidCollapsibleContent>
      </LiquidCollapsible>
    </div>
  );
}
