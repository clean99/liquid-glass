import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  LiquidAlert,
  LiquidAlertDescription,
  LiquidAlertTitle,
  LiquidAvatar,
  LiquidAvatarFallback,
  LiquidBadge,
  LiquidBreadcrumb,
  LiquidBreadcrumbItem,
  LiquidBreadcrumbLink,
  LiquidBreadcrumbList,
  LiquidBreadcrumbPage,
  LiquidBreadcrumbSeparator,
  LiquidCheckbox,
  LiquidProgress,
  LiquidSeparator,
  LiquidSkeleton
} from "../src";
import { StoryFrame } from "./story-fixtures";

const meta = {
  title: "Liquid Glass/Foundation Primitives",
  parameters: { a11y: { test: "error" } }
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const ComponentSet: Story = {
  render: () => (
    <StoryFrame mode="fallback" theme="light" width={640}>
      <div style={{ display: "grid", gap: 18 }}>
        <LiquidBreadcrumb>
          <LiquidBreadcrumbList>
            <LiquidBreadcrumbItem>
              <LiquidBreadcrumbLink href="/">Home</LiquidBreadcrumbLink>
              <LiquidBreadcrumbSeparator />
            </LiquidBreadcrumbItem>
            <LiquidBreadcrumbItem>
              <LiquidBreadcrumbLink href="/writing/">Writing</LiquidBreadcrumbLink>
              <LiquidBreadcrumbSeparator />
            </LiquidBreadcrumbItem>
            <LiquidBreadcrumbItem>
              <LiquidBreadcrumbPage>Liquid Glass React</LiquidBreadcrumbPage>
            </LiquidBreadcrumbItem>
          </LiquidBreadcrumbList>
        </LiquidBreadcrumb>

        <LiquidAlert variant="info">
          <LiquidAlertTitle>Readable material first</LiquidAlertTitle>
          <LiquidAlertDescription>
            The foreground stays sharp while the surface carries the optical treatment.
          </LiquidAlertDescription>
        </LiquidAlert>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <LiquidBadge>Default</LiquidBadge>
          <LiquidBadge variant="accent">Enhanced</LiquidBadge>
          <LiquidBadge variant="success">Stable</LiquidBadge>
          <LiquidBadge variant="warning">Fallback</LiquidBadge>
          <LiquidBadge variant="danger">Blocked</LiquidBadge>
        </div>

        <LiquidCheckbox defaultChecked description="Uses native checkbox semantics.">
          Publish release notes
        </LiquidCheckbox>

        <LiquidProgress aria-label="Build progress" value={72} />

        <LiquidSeparator decorative={false} />

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <LiquidAvatar>
            <LiquidAvatarFallback>KH</LiquidAvatarFallback>
          </LiquidAvatar>
          <div style={{ display: "grid", flex: 1, gap: 8 }}>
            <LiquidSkeleton style={{ width: "70%", height: 14 }} />
            <LiquidSkeleton style={{ width: "42%", height: 14 }} />
          </div>
        </div>
      </div>
    </StoryFrame>
  )
};

export const DarkDense: Story = {
  render: () => (
    <StoryFrame mode="fallback" theme="dark" width={640}>
      <div style={{ display: "grid", gap: 16 }}>
        <LiquidAlert variant="success">
          <LiquidAlertTitle>CI gate passed</LiquidAlertTitle>
          <LiquidAlertDescription>
            Unit, component, Storybook behavior, visual, and package checks are tracked.
          </LiquidAlertDescription>
        </LiquidAlert>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <LiquidBadge variant="accent">React 19</LiquidBadge>
          <LiquidBadge variant="success">A11y</LiquidBadge>
          <LiquidBadge variant="warning">Chromium enhanced</LiquidBadge>
        </div>
        <LiquidCheckbox description="Reduced transparency resolves to solid material.">
          Respect user preferences
        </LiquidCheckbox>
        <LiquidProgress aria-label="Parity progress" value={84} />
      </div>
    </StoryFrame>
  )
};
