import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState, type CSSProperties } from "react";
import { LiquidProvider, LiquidSearchBox } from "../src";
import {
  kubeReferenceControlGridBackground,
  kubeReferenceImageAssets
} from "./kube-reference-assets";
import { storyVisualState, StoryFrame } from "./story-fixtures";

const meta = {
  title: "Liquid Glass/LiquidSearchBox",
  component: LiquidSearchBox,
  parameters: {
    a11y: { test: "error" },
    visualState: storyVisualState({
      components: ["searchbox"],
      evidence: ["Storybook states", "Kube reference gate", "a11y scan"],
      profiles: ["form"],
      stateTags: ["default", "focus-visible", "loaded media", "Kube reference"]
    })
  }
} satisfies Meta<typeof LiquidSearchBox>;

export default meta;
type Story = StoryObj;

const kubeFontStack =
  'InterVariable, Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';

export const KubeReference: Story = {
  parameters: {
    visualState: {
      evidence: ["pnpm test:kube-reference"],
      profile: "form",
      states: ["default", "light", "material-mode", "Kube reference"]
    }
  },
  render: () => <KubeSearchboxReferenceStory />
};

function KubeSearchboxReferenceStory() {
  const [useImageBackground, setUseImageBackground] = useState(false);
  const kubeSearchboxSurfaceStyle = {
    "--lg-surface-radius": "28px",
    ...(useImageBackground ? { "--lg-text": "#fff" } : {})
  } as CSSProperties;

  return (
    <LiquidProvider defaultMode="enhanced" disableOnMobile={false} maxEnhancedSurfaces={4}>
      <div
        data-lg-theme="light"
        style={{
          minHeight: 360,
          padding: 40,
          background:
            "linear-gradient(90deg, rgba(15,23,42,0.055) 0 1px, transparent 1px 48px), linear-gradient(180deg, rgba(15,23,42,0.045) 0 1px, transparent 1px 48px), linear-gradient(135deg, #fff, #f5f6f4)",
          backgroundSize: "48px 48px, 48px 48px, auto",
          fontFamily: kubeFontStack
        }}
      >
        <div
          data-lg-reference-frame="searchbox"
          style={{
            position: "relative",
            boxSizing: "border-box",
            width: 706,
            height: 313,
            overflow: "hidden",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            borderRadius: 9.75,
            background: useImageBackground
              ? `url("${kubeReferenceImageAssets.searchboxDemoBackground}")`
              : kubeReferenceControlGridBackground.image,
            backgroundPosition: useImageBackground
              ? "50% 50%"
              : kubeReferenceControlGridBackground.position,
            backgroundRepeat: useImageBackground
              ? "no-repeat"
              : kubeReferenceControlGridBackground.repeat,
            backgroundSize: useImageBackground ? "cover" : kubeReferenceControlGridBackground.size
          }}
        >
          {useImageBackground ? <KubeSearchboxPhotoCredit /> : null}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "calc(50% + 1.5px)",
              transform: "translate(-50%, -50%)"
            }}
          >
            <LiquidSearchBox
              aria-label="Search docs"
              surfaceProps={{
                className: "lg-searchbox--kube-reference",
                radius: 28,
                style: kubeSearchboxSurfaceStyle
              }}
            />
          </div>
          <label
            style={{
              position: "absolute",
              left: "50%",
              bottom: useImageBackground ? 7.5 : 12,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: useImageBackground ? "3.25px 7.25px" : undefined,
              color: useImageBackground ? "#fff" : "#111",
              fontSize: useImageBackground ? 9.75 : 10,
              lineHeight: useImageBackground ? "13px" : undefined,
              background: useImageBackground ? "rgba(0, 0, 0, 0.1)" : undefined,
              borderRadius: useImageBackground ? 4.875 : undefined,
              WebkitBackdropFilter: useImageBackground ? "blur(8px)" : undefined,
              backdropFilter: useImageBackground ? "blur(8px)" : undefined,
              textShadow: "none",
              transform: "translateX(-50%)"
            }}
          >
            <input
              checked={useImageBackground}
              onChange={(event) => setUseImageBackground(event.currentTarget.checked)}
              style={{ width: 12, height: 12, margin: 0 }}
              type="checkbox"
            />{" "}
            Use image background
          </label>
        </div>
      </div>
    </LiquidProvider>
  );
}

export const FocusPhotoReference: Story = {
  parameters: {
    visualState: {
      evidence: ["pnpm test:e2e"],
      profile: "form",
      states: ["focus-visible", "light", "loaded media", "Kube reference"]
    }
  },
  render: () => (
    <LiquidProvider defaultMode="enhanced" disableOnMobile={false} maxEnhancedSurfaces={4}>
      <div
        data-lg-theme="light"
        style={{
          minHeight: 360,
          padding: 40,
          background: "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(244,245,243,0.94))",
          fontFamily: kubeFontStack
        }}
      >
        <div
          data-lg-reference-frame="searchbox-focus"
          style={{
            position: "relative",
            boxSizing: "border-box",
            width: 706,
            height: 313,
            overflow: "hidden",
            borderRadius: 12,
            background: `url("${kubeReferenceImageAssets.searchboxDemoBackground}")`,
            backgroundPosition: "50% 50%",
            backgroundSize: "cover"
          }}
        >
          <KubeSearchboxPhotoCredit />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)"
            }}
          >
            <LiquidSearchBox
              aria-label="Search docs"
              surfaceProps={{ style: { "--lg-text": "#fff" } as CSSProperties }}
            />
          </div>
        </div>
      </div>
    </LiquidProvider>
  )
};

function KubeSearchboxPhotoCredit() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 9.75,
        left: 9.75,
        color: "rgba(255, 255, 255, 0.4)",
        fontSize: 9,
        fontWeight: 400,
        letterSpacing: 0.9,
        lineHeight: 1.1,
        textShadow: "none",
        textTransform: "uppercase"
      }}
    >
      <div>Photo by Teemu Paananen</div>
      <div>on Unsplash</div>
    </div>
  );
}

export const DarkMode: Story = {
  render: () => (
    <StoryFrame theme="dark" width={520} height={280}>
      <LiquidSearchBox aria-label="Search dark documentation" />
    </StoryFrame>
  )
};

export const FallbackMode: Story = {
  render: () => (
    <StoryFrame mode="fallback" theme="light" width={520} height={280}>
      <LiquidSearchBox aria-label="Search fallback documentation" />
    </StoryFrame>
  )
};

export const SolidMode: Story = {
  render: () => (
    <StoryFrame mode="solid" theme="light" width={520} height={280}>
      <LiquidSearchBox aria-label="Search solid documentation" />
    </StoryFrame>
  )
};

export const LongPlaceholder: Story = {
  render: () => (
    <StoryFrame mode="fallback" theme="light" width={420} height={280}>
      <LiquidSearchBox
        aria-label="Search mixed language notes"
        placeholder="搜索性能、架构、Agent notes and long English labels"
      />
    </StoryFrame>
  )
};
