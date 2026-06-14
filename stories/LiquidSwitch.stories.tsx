import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LiquidProvider, LiquidSwitch } from "../src";
import { kubeReferenceControlGridBackground } from "./kube-reference-assets";
import { storyVisualState, StoryFrame } from "./story-fixtures";

const meta = {
  title: "Liquid Glass/LiquidSwitch",
  component: LiquidSwitch,
  parameters: {
    a11y: { test: "error" },
    visualState: storyVisualState({
      components: ["switch"],
      evidence: ["Storybook states", "Kube reference gate", "visual snapshot"],
      profiles: ["control"],
      stateTags: ["default", "selected", "disabled", "Kube reference"]
    })
  }
} satisfies Meta<typeof LiquidSwitch>;

export default meta;
type Story = StoryObj;

export const KubeReference: Story = {
  parameters: {
    visualState: {
      evidence: ["pnpm test:kube-reference"],
      profile: "control",
      states: ["default", "light", "material-mode", "Kube reference"]
    }
  },
  render: () => (
    <LiquidProvider defaultMode="enhanced" disableOnMobile={false} maxEnhancedSurfaces={4}>
      <div
        data-lg-reference-frame="switch"
        data-lg-theme="light"
        style={{
          boxSizing: "border-box",
          display: "grid",
          height: 313,
          placeItems: "center",
          position: "relative",
          background: kubeReferenceControlGridBackground.image,
          backgroundPosition: kubeReferenceControlGridBackground.position,
          backgroundRepeat: kubeReferenceControlGridBackground.repeat,
          backgroundSize: kubeReferenceControlGridBackground.size,
          border: "1px solid rgba(0,0,0,0.1)",
          borderRadius: 9.75,
          width: 706
        }}
      >
        <LiquidSwitch aria-label="Use image background" />
        <label
          style={{
            position: "absolute",
            left: "50%",
            bottom: 12,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "#111",
            fontSize: 10,
            transform: "translateX(-50%)"
          }}
        >
          <input style={{ width: 12, height: 12, margin: 0 }} type="checkbox" /> Force active
        </label>
      </div>
    </LiquidProvider>
  )
};

export const FallbackMode: Story = {
  render: () => (
    <StoryFrame mode="fallback" theme="light" width={480} height={280} field={false}>
      <LiquidSwitch aria-label="Fallback switch" />
    </StoryFrame>
  )
};
