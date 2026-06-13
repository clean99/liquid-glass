import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const errors = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function mustExist(relativePath) {
  if (!fs.existsSync(path.join(root, relativePath))) {
    errors.push(`Missing required file: ${relativePath}`);
  }
}

function mustInclude(relativePath, snippets) {
  if (!fs.existsSync(path.join(root, relativePath))) {
    errors.push(`Missing required file: ${relativePath}`);
    return;
  }

  const source = read(relativePath);
  const normalizedSource = source.toLowerCase();
  for (const snippet of snippets) {
    if (!normalizedSource.includes(snippet.toLowerCase())) {
      errors.push(`${relativePath} must include: ${snippet}`);
    }
  }
}

const packageRequiredFiles = [
  "README.md",
  "LICENSE",
  "ATTRIBUTIONS.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "CODE_OF_CONDUCT.md",
  "CHANGELOG.md",
  "ROADMAP.md",
  "SUPPORT.md",
  ".changeset/config.json",
  "docs/api-overview.md",
  "docs/browser-support.md",
  "docs/component-inventory.json",
  "docs/component-inventory.md",
  "docs/design-principles.md",
  "docs/github-repository-settings.md",
  "docs/governance-scorecard.md",
  "docs/index.md",
  "docs/installation.md",
  "docs/kube-parity-gate.md",
  "docs/open-source-governance.md",
  "docs/open-source-release.md",
  "docs/optics-architecture.md",
  "docs/reference-provenance.json",
  "docs/reference-research.md",
  "docs/rdev-liquid-glass-react.md",
  "docs/shadcn-registry.md",
  "docs/shadcn-parity.json",
  "docs/testing.md",
  "docs/ui-library-benchmark.md",
  "docs/visual-documentation.md",
  "docs/visual-state-coverage.json",
  "examples/README.md",
  "registry.json",
  "liquid-glass.json",
  "registry/liquid-glass.json",
  "scripts/audit-open-source-governance.mjs",
  "scripts/build-component-registry.mjs",
  "scripts/validate-component-test-coverage.mjs",
  "scripts/validate-visual-state-coverage.mjs",
  "scripts/check-release-readiness.mjs",
  "scripts/check-shadcn-parity.mjs",
  "scripts/validate-reference-provenance.mjs",
  "scripts/verify-storybook-a11y.mjs",
  "schema/component-inventory.schema.json",
  "schema/reference-provenance.schema.json",
  "schema/shadcn-parity.schema.json",
  "schema/visual-state-coverage.schema.json"
];

const standaloneRequiredFiles = [
  ".github/workflows/ci.yml",
  ".github/workflows/visual.yml",
  ".github/workflows/pages.yml",
  ".github/workflows/release.yml",
  ".github/ISSUE_TEMPLATE/bug_report.yml",
  ".github/ISSUE_TEMPLATE/feature_request.yml",
  ".github/ISSUE_TEMPLATE/registry_report.yml",
  ".github/ISSUE_TEMPLATE/config.yml",
  ".github/PULL_REQUEST_TEMPLATE.md",
  ".github/dependabot.yml",
  ".github/CODEOWNERS"
];

const isStandaloneRepository = fs.existsSync(path.join(root, ".github"));
const requiredFiles = isStandaloneRepository
  ? [...packageRequiredFiles, ...standaloneRequiredFiles]
  : packageRequiredFiles;

for (const file of requiredFiles) {
  mustExist(file);
}

mustInclude("README.md", [
  "@hashintel/refractive",
  "Browser Support",
  "Accessibility",
  "Performance",
  "pnpm verify",
  "test:inventory",
  "test:component-coverage",
  "test:registry",
  "test:governance",
  "test:research",
  "test:shadcn-parity",
  "test:release-readiness",
  "test:kube-reference",
  "test:kube-reference:strict",
  "test:kube-reference:exact",
  "test:a11y",
  "test:e2e",
  "@axe-core/playwright",
  "shadcn-style Registry"
]);

mustInclude("README.md", [
  "Project Status",
  "not published yet",
  "not published to npm yet",
  "docs/index.md",
  "Open-source governance",
  "UI library benchmark",
  "Support",
  "ROADMAP.md"
]);

mustInclude("docs/index.md", [
  "Liquid Glass UI",
  "shadcn/ui",
  "Radix UI",
  "Chakra UI",
  "HeroUI",
  "```mermaid",
  "Component Navigation",
  "Visual Documentation",
  "Quality Gates",
  "Public Launch Checklist",
  "not published to npm yet",
  "Storybook Pages",
  "shadcn-style Registry",
  "test:kube-reference:exact",
  "pnpm test:visual-docs",
  "pnpm verify"
]);

mustInclude("SUPPORT.md", [
  "pre-1.0",
  "not published yet",
  "private security advisory",
  "Accessibility regression",
  "registry issue",
  "pnpm test:kube-reference:exact",
  "fallback or solid mode"
]);

mustInclude("docs/github-repository-settings.md", [
  "git@github.com:clean99/liquid-glass.git",
  "GitHub Actions",
  "Branch Protection",
  "NPM_TOKEN",
  "Repository Secrets"
]);

mustInclude("docs/shadcn-registry.md", [
  "npx shadcn@latest add",
  "raw.githubusercontent.com/clean99/liquid-glass/main/liquid-glass.json",
  "registry/components",
  "test:registry",
  "test:research",
  "test:shadcn-parity",
  "ui.shadcn.com/docs/registry",
  "requires the npm package"
]);

mustInclude("docs/open-source-governance.md", [
  "shadcn/ui",
  "Radix UI",
  "Chakra UI",
  "HeroUI",
  "mermaid",
  "pnpm test:governance",
  "pnpm test:research",
  "pnpm test:component-coverage",
  "pnpm test:visual-docs",
  "pnpm test:a11y",
  "main push",
  "Current Gaps",
  "Release Flow"
]);

mustInclude("docs/governance-scorecard.md", [
  "pnpm audit:governance",
  "pnpm test:governance",
  "pnpm --silent audit:governance:json",
  "CHECK_REMOTE_GOVERNANCE=1",
  "docs/ui-library-benchmark.md",
  "remoteStatus.checked",
  "GitHub Pages",
  "not part of CI"
]);

mustInclude("docs/ui-library-benchmark.md", [
  "shadcn-ui/ui",
  "radix-ui/primitives",
  "chakra-ui/chakra-ui",
  "heroui-inc/heroui",
  "mermaid",
  "Public Benchmark Surface",
  "Support routing",
  "Visual regression signal",
  "Local governance gate",
  "Public launch score",
  "Visual Documentation Gaps",
  "GitHub Pages",
  "not published"
]);

mustInclude("docs/visual-documentation.md", [
  "Visual Documentation Contract",
  "shadcn/ui",
  "Radix UI",
  "Chakra UI",
  "HeroUI",
  "Storybook Pages",
  "Light and dark",
  "Reduced motion",
  "High contrast",
  "Mobile",
  "Kube reference",
  "parameters.visualState",
  "visual-state-coverage.json",
  "Current Gaps"
]);

mustInclude("docs/visual-state-coverage.json", [
  "visual-state-coverage.schema.json",
  "componentsByProfile",
  "storyEvidence",
  "high contrast",
  "reduced motion",
  "mobile"
]);

mustInclude("docs/github-repository-settings.md", [
  "Maintainer Commands",
  "gh api",
  "build_type=workflow",
  "deploy is skipped",
  "has_wiki=false",
  "CHECK_REMOTE_GOVERNANCE=1 pnpm audit:governance"
]);

mustInclude("ATTRIBUTIONS.md", [
  "@hashintel/refractive",
  "kube.io/blog/liquid-glass-css-svg",
  "rdev/liquid-glass-react",
  "shuding/liquid-glass",
  "shadcn/ui",
  "radix-ui/primitives",
  "chakra-ui/chakra-ui",
  "heroui-inc/heroui"
]);

mustInclude("docs/optics-architecture.md", [
  "LiquidSurface",
  "edge",
  "foreground content",
  "chromatic-aberration.ts",
  "displacement-map.ts",
  "tests/chromatic-aberration.test.ts",
  "tests/displacement-map.test.ts",
  "test:physics",
  "test:kube-reference",
  "test:kube-reference:strict"
]);

mustInclude("docs/reference-research.md", [
  "edge mask",
  "clean center",
  "chromatic aberration",
  "rounded-rect SDF",
  "mouseContainer",
  "Pressed and dragged lens screenshots",
  "test:kube-reference:strict",
  "shadcn/ui Registry Pattern"
]);

mustInclude("docs/reference-provenance.json", [
  "rdev/liquid-glass-react",
  "ac48eab18d1f7f444ae30002d240cae29c863a21",
  "copiedSource",
  "false",
  "Kube Liquid Glass CSS SVG article",
  "shadcn/ui",
  "radix-ui/primitives",
  "chakra-ui/chakra-ui",
  "heroui-inc/heroui"
]);

mustInclude("docs/kube-parity-gate.md", [
  "test:kube-reference:exact",
  "KUBE_EXACT_PARITY=1",
  "KUBE_MAX_DIFF_RATIO=0",
  "KUBE_PIXEL_DELTA_THRESHOLD=0",
  "final acceptance target",
  "not part of `ci` or `verify`"
]);

mustInclude("docs/rdev-liquid-glass-react.md", [
  "MIT licensed",
  "sampleLiquidEdgeMask",
  "resolveLiquidChromaticAberration",
  "createLensFilterPixelMaps",
  "resolveLiquidElasticResponse",
  "Baked base64 displacement maps",
  "edge/center blend",
  "tests/chromatic-aberration.test.ts",
  "real pointer and drag actions"
]);

mustInclude("docs/testing.md", [
  "real pointer actions",
  "pressed and dragged magnifying-glass screenshots",
  "requestAnimationFrame",
  "test:kube-reference",
  "test:kube-reference:strict",
  "test:kube-reference:exact",
  "test:package",
  "test:a11y",
  "test:e2e",
  "test:visual-docs",
  "@axe-core/playwright",
  "critical",
  "serious",
  "KUBE_STRICT_INTERACTIVE",
  "sideEffects",
  "tests/displacement-map.test.ts",
  "tests/edge-mask.test.ts"
]);

mustInclude("CONTRIBUTING.md", [
  "SUPPORT.md",
  "pnpm verify",
  "pnpm test:docs",
  "pnpm test:inventory"
]);
mustInclude("docs/open-source-release.md", [
  "pnpm verify",
  "pnpm test:release-readiness",
  "pnpm test:governance",
  "pnpm pack --dry-run",
  "pnpm test:a11y",
  "pnpm test:kube-reference:strict",
  "pnpm release",
  "NPM_TOKEN",
  "NPM_CONFIG_PROVENANCE",
  "id-token: write",
  "publishConfig.access",
  "not published to npm yet"
]);
if (isStandaloneRepository) {
  mustInclude(".github/ISSUE_TEMPLATE/config.yml", [
    "Support routing",
    "SUPPORT.md",
    "Security reports"
  ]);
  mustInclude(".github/PULL_REQUEST_TEMPLATE.md", [
    "pnpm test:governance",
    "pnpm test:research",
    "pnpm test:component-coverage",
    "pnpm test:visual-docs",
    "pnpm test:a11y",
    "npm publish, Pages, and exact Kube parity are not claimed unless they have succeeded"
  ]);
  mustInclude(".github/workflows/release.yml", [
    "pnpm verify",
    "pnpm release",
    "NPM_TOKEN",
    "NPM_CONFIG_PROVENANCE",
    "id-token: write",
    "playwright install --with-deps chromium"
  ]);
  mustInclude(".github/workflows/ci.yml", [
    "playwright install --with-deps chromium",
    "pnpm test:registry",
    "pnpm test:shadcn-parity",
    "pnpm test:component-coverage",
    "pnpm test:governance",
    "pnpm test:research",
    "pnpm test:visual-docs",
    "pnpm test:release-readiness",
    "pnpm test:e2e",
    "pnpm test:a11y",
    "FORCE_JAVASCRIPT_ACTIONS_TO_NODE24"
  ]);
  mustInclude(".github/workflows/pages.yml", [
    "playwright install --with-deps chromium",
    "pnpm test:a11y",
    "actions/deploy-pages"
  ]);
}
mustInclude(".changeset/config.json", [
  '"access": "public"',
  '"baseBranch": "main"',
  '"updateInternalDependencies": "patch"'
]);

if (fs.existsSync(path.join(root, "package.json"))) {
  const packageJson = JSON.parse(read("package.json"));
  if (!packageJson.scripts?.verify?.includes("pnpm run ci")) {
    errors.push("package.json scripts.verify must call pnpm run ci, not pnpm ci");
  }
  if (!packageJson.scripts?.["test:e2e"]) {
    errors.push("package.json must include test:e2e");
  }
  if (!packageJson.scripts?.["test:kube-reference:strict"]) {
    errors.push("package.json must include test:kube-reference:strict");
  }
  if (!packageJson.scripts?.["test:kube-reference:exact"]) {
    errors.push("package.json must include test:kube-reference:exact");
  }
  if (!packageJson.scripts?.["test:release-readiness"]) {
    errors.push("package.json must include test:release-readiness");
  }
  if (!packageJson.scripts?.["test:governance"]) {
    errors.push("package.json must include test:governance");
  }
  if (!packageJson.scripts?.["audit:governance"]) {
    errors.push("package.json must include audit:governance");
  }
  if (!packageJson.scripts?.["audit:governance:json"]) {
    errors.push("package.json must include audit:governance:json");
  }
  if (!packageJson.scripts?.["test:research"]) {
    errors.push("package.json must include test:research");
  }
  if (!packageJson.scripts?.["test:visual-docs"]) {
    errors.push("package.json must include test:visual-docs");
  }
  if (!packageJson.scripts?.["test:kube-reference:strict"]?.includes("KUBE_STRICT_INTERACTIVE=1")) {
    errors.push("package.json test:kube-reference:strict must enable strict Kube interactions");
  }
  if (!packageJson.scripts?.["test:kube-reference:exact"]?.includes("KUBE_MAX_DIFF_RATIO=0")) {
    errors.push("package.json test:kube-reference:exact must set zero pixel diff tolerance");
  }
  if (
    !packageJson.scripts?.["test:kube-reference:exact"]?.includes("KUBE_PIXEL_DELTA_THRESHOLD=0")
  ) {
    errors.push("package.json test:kube-reference:exact must set zero per-pixel delta tolerance");
  }
  if (!packageJson.scripts?.["test:kube-reference:exact"]?.includes("KUBE_EXACT_PARITY=1")) {
    errors.push("package.json test:kube-reference:exact must mark exact parity mode");
  }
  if (
    !packageJson.scripts?.["test:release-readiness"]?.includes(
      "scripts/check-release-readiness.mjs"
    )
  ) {
    errors.push("package.json test:release-readiness must run the release readiness gate");
  }
  if (
    !packageJson.scripts?.["test:governance"]?.includes("scripts/audit-open-source-governance.mjs")
  ) {
    errors.push("package.json test:governance must run the governance audit");
  }
  if (!packageJson.scripts?.ci?.includes("pnpm test:governance")) {
    errors.push("package.json scripts.ci must include pnpm test:governance");
  }
  if (!packageJson.scripts?.ci?.includes("pnpm test:visual-docs")) {
    errors.push("package.json scripts.ci must include pnpm test:visual-docs");
  }
  if (
    !packageJson.scripts?.["test:research"]?.includes("scripts/validate-reference-provenance.mjs")
  ) {
    errors.push("package.json test:research must run the reference provenance gate");
  }
  if (
    !packageJson.scripts?.["test:visual-docs"]?.includes(
      "scripts/validate-visual-state-coverage.mjs"
    )
  ) {
    errors.push("package.json test:visual-docs must run the visual state coverage gate");
  }
  if (!packageJson.scripts?.["test:e2e"]?.includes("verify-liquid-behavior.mjs")) {
    errors.push("package.json test:e2e must run the real Storybook interaction gate");
  }
  if (!packageJson.scripts?.["test:a11y"]?.includes("verify-storybook-a11y.mjs")) {
    errors.push("package.json test:a11y must run the Storybook axe gate");
  }
  if (packageJson.publishConfig?.access !== "public") {
    errors.push("package.json publishConfig.access must be public");
  }
  if (packageJson.scripts?.release !== "pnpm changeset publish") {
    errors.push("package.json scripts.release must publish through Changesets");
  }
  for (const file of [
    "CHANGELOG.md",
    "CODE_OF_CONDUCT.md",
    "CONTRIBUTING.md",
    "ROADMAP.md",
    "SECURITY.md",
    "SUPPORT.md"
  ]) {
    if (!packageJson.files?.includes(file)) {
      errors.push(`package.json files must include ${file}`);
    }
  }
}

if (
  fs.existsSync(path.join(root, "liquid-glass.json")) &&
  fs.existsSync(path.join(root, "registry/liquid-glass.json"))
) {
  const flatItem = JSON.parse(read("liquid-glass.json"));
  const nestedItem = JSON.parse(read("registry/liquid-glass.json"));
  const flat = JSON.stringify(flatItem);
  const nested = JSON.stringify(nestedItem);
  if (flat !== nested) {
    errors.push("liquid-glass.json and registry/liquid-glass.json must stay equivalent");
  }
}

const packageJson = JSON.parse(read("package.json"));
for (const script of [
  "registry:build",
  "shadcn:sync",
  "test:docs",
  "test:inventory",
  "test:component-coverage",
  "test:registry",
  "test:research",
  "test:shadcn-parity",
  "test:release-readiness",
  "test:kube-reference",
  "test:kube-reference:strict",
  "test:kube-reference:exact",
  "test:storybook",
  "test:package",
  "release"
]) {
  if (!packageJson.scripts?.[script]) {
    errors.push(`package.json is missing script: ${script}`);
  }
}

if (!packageJson.files?.includes("liquid-glass.json")) {
  errors.push("package.json files must include liquid-glass.json");
}

if (errors.length > 0) {
  throw new Error(`Documentation gate failed:\n${errors.map((error) => `- ${error}`).join("\n")}`);
}

console.log(`Validated ${requiredFiles.length} open-source documentation and GitHub files.`);
