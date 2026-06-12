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

const requiredFiles = [
  "README.md",
  "LICENSE",
  "ATTRIBUTIONS.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "CODE_OF_CONDUCT.md",
  "CHANGELOG.md",
  ".changeset/config.json",
  "docs/api-overview.md",
  "docs/browser-support.md",
  "docs/component-inventory.json",
  "docs/component-inventory.md",
  "docs/design-principles.md",
  "docs/installation.md",
  "docs/open-source-release.md",
  "docs/optics-architecture.md",
  "docs/reference-research.md",
  "docs/rdev-liquid-glass-react.md",
  "docs/shadcn-parity.json",
  "docs/testing.md",
  "examples/README.md",
  "registry.json",
  "liquid-glass.json",
  "registry/liquid-glass.json",
  "scripts/build-component-registry.mjs",
  "schema/component-inventory.schema.json",
  "schema/shadcn-parity.schema.json",
  ".github/workflows/ci.yml",
  ".github/workflows/visual.yml",
  ".github/workflows/pages.yml",
  ".github/workflows/release.yml",
  ".github/ISSUE_TEMPLATE/bug_report.yml",
  ".github/ISSUE_TEMPLATE/feature_request.yml",
  ".github/ISSUE_TEMPLATE/config.yml",
  ".github/PULL_REQUEST_TEMPLATE.md",
  ".github/dependabot.yml",
  ".github/CODEOWNERS"
];

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
  "test:registry",
  "test:kube-reference",
  "shadcn-style Registry"
]);

mustInclude("ATTRIBUTIONS.md", [
  "@hashintel/refractive",
  "kube.io/blog/liquid-glass-css-svg",
  "rdev/liquid-glass-react",
  "shuding/liquid-glass"
]);

mustInclude("docs/optics-architecture.md", [
  "LiquidSurface",
  "edge",
  "foreground content",
  "displacement-map.ts",
  "tests/displacement-map.test.ts",
  "test:physics",
  "test:kube-reference"
]);

mustInclude("docs/reference-research.md", [
  "edge mask",
  "clean center",
  "chromatic aberration",
  "rounded-rect SDF",
  "mouseContainer",
  "Pressed and dragged lens screenshots",
  "shadcn/ui Registry Pattern"
]);

mustInclude("docs/rdev-liquid-glass-react.md", [
  "MIT licensed",
  "sampleLiquidEdgeMask",
  "createLensFilterPixelMaps",
  "resolveLiquidElasticResponse",
  "Baked base64 displacement maps",
  "edge/center blend",
  "real pointer and drag actions"
]);

mustInclude("docs/testing.md", [
  "real pointer actions",
  "pressed and dragged magnifying-glass screenshots",
  "requestAnimationFrame",
  "test:kube-reference",
  "tests/displacement-map.test.ts",
  "tests/edge-mask.test.ts"
]);

mustInclude("CONTRIBUTING.md", ["pnpm verify", "pnpm test:docs", "pnpm test:inventory"]);
mustInclude("docs/open-source-release.md", [
  "pnpm verify",
  "pnpm pack --dry-run",
  "pnpm release",
  "NPM_TOKEN",
  "publishConfig.access"
]);
mustInclude(".github/workflows/release.yml", [
  "pnpm verify",
  "pnpm release",
  "NPM_TOKEN",
  "playwright install --with-deps chromium"
]);
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
  if (packageJson.publishConfig?.access !== "public") {
    errors.push("package.json publishConfig.access must be public");
  }
  if (packageJson.scripts?.release !== "pnpm changeset publish") {
    errors.push("package.json scripts.release must publish through Changesets");
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
  "test:docs",
  "test:inventory",
  "test:registry",
  "test:kube-reference",
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
