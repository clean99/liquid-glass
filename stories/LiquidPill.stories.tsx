import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LiquidPill } from "../src";
import {
  longChineseText,
  longEnglishText,
  mixedText,
  storyVisualState,
  StoryFrame
} from "./story-fixtures";

const meta = {
  title: "Liquid Glass/LiquidPill",
  component: LiquidPill,
  parameters: {
    a11y: { test: "error" },
    visualState: storyVisualState({
      components: ["pill"],
      evidence: ["Storybook states", "visual snapshot"],
      profiles: ["display"],
      stateTags: ["default", "variant", "long content"]
    })
  }
} satisfies Meta<typeof LiquidPill>;

export default meta;
type Story = StoryObj;

export const TextVariants: Story = {
  render: () => (
    <StoryFrame width={520}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <LiquidPill>{longChineseText}</LiquidPill>
        <LiquidPill>{longEnglishText}</LiquidPill>
        <LiquidPill>{mixedText}</LiquidPill>
      </div>
    </StoryFrame>
  )
};

export const HighContrast: Story = {
  parameters: { backgrounds: { default: "light" } },
  render: () => (
    <StoryFrame mode="solid">
      <LiquidPill>High contrast solid fallback</LiquidPill>
    </StoryFrame>
  )
};
