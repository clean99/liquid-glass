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
  "docs/api-overview.md",
  "docs/browser-support.md",
  "docs/component-inventory.json",
  "docs/component-inventory.md",
  "docs/design-principles.md",
  "docs/installation.md",
  "docs/open-source-release.md",
  "docs/optics-architecture.md",
  "docs/reference-research.md",
  "docs/testing.md",
  "examples/README.md",
  "registry.json",
  "liquid-glass.json",
  "registry/liquid-glass.json",
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
  "test:inventory",
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
  "test:physics",
  "test:kube-reference"
]);

mustInclude("docs/reference-research.md", [
  "edge mask",
  "clean center",
  "chromatic aberration",
  "rounded-rect SDF",
  "mouseContainer",
  "shadcn/ui Registry Pattern"
]);

mustInclude("docs/testing.md", [
  "real pointer actions",
  "requestAnimationFrame",
  "test:kube-reference"
]);

mustInclude("CONTRIBUTING.md", ["pnpm test:docs", "pnpm test:inventory"]);

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
  "test:docs",
  "test:inventory",
  "test:kube-reference",
  "test:storybook",
  "test:package"
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
