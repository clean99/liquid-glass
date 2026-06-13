import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const errors = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function mustExist(relativePath) {
  if (!exists(relativePath)) {
    errors.push(`Missing required release file: ${relativePath}`);
  }
}

function mustInclude(relativePath, snippet) {
  if (!exists(relativePath)) {
    errors.push(`Missing required release file: ${relativePath}`);
    return;
  }

  if (!read(relativePath).includes(snippet)) {
    errors.push(`${relativePath} must include ${JSON.stringify(snippet)}`);
  }
}

function mustScript(packageJson, name, snippets = []) {
  const script = packageJson.scripts?.[name];
  if (!script) {
    errors.push(`package.json is missing script ${name}`);
    return;
  }

  for (const snippet of snippets) {
    if (!script.includes(snippet)) {
      errors.push(`package.json script ${name} must include ${JSON.stringify(snippet)}`);
    }
  }
}

const packageJson = readJson("package.json");
const changesetConfig = readJson(".changeset/config.json");
const isStandaloneRepository = exists(".github");

if (packageJson.name !== "@clean99/liquid-glass") {
  errors.push("package.json name must stay @clean99/liquid-glass");
}
if (packageJson.private === true) {
  errors.push("package.json must not be private for the open-source package");
}
if (packageJson.publishConfig?.access !== "public") {
  errors.push("package.json publishConfig.access must be public");
}
if (!packageJson.repository?.url?.includes("github.com/clean99/liquid-glass")) {
  errors.push("package.json repository must point at clean99/liquid-glass");
}
if (packageJson.license !== "MIT") {
  errors.push("package.json license must be MIT");
}
if (packageJson.engines?.node !== ">=22.13.0") {
  errors.push("package.json engines.node must stay aligned with pnpm 11: >=22.13.0");
}
if (packageJson.engines?.pnpm !== ">=11") {
  errors.push("package.json engines.pnpm must stay >=11");
}

for (const script of [
  "build",
  "format",
  "lint",
  "typecheck",
  "test:docs",
  "test:governance",
  "test:inventory",
  "test:component-coverage",
  "test:visual-docs",
  "test:registry",
  "test:research",
  "test:shadcn-parity",
  "test:unit",
  "test:components",
  "test:physics",
  "test:storybook",
  "test:e2e",
  "test:a11y",
  "test:visual",
  "test:kube-assets",
  "test:kube-reference",
  "test:kube-reference:strict",
  "test:kube-reference:exact",
  "test:release-readiness",
  "test:package",
  "audit:governance",
  "audit:governance:json",
  "ci",
  "verify",
  "release"
]) {
  mustScript(packageJson, script);
}

mustScript(packageJson, "test:release-readiness", ["scripts/check-release-readiness.mjs"]);
mustScript(packageJson, "test:governance", ["scripts/audit-open-source-governance.mjs"]);
mustScript(packageJson, "test:research", ["scripts/validate-reference-provenance.mjs"]);
mustScript(packageJson, "test:component-coverage", [
  "scripts/validate-component-test-coverage.mjs"
]);
mustScript(packageJson, "test:visual-docs", ["scripts/validate-visual-state-coverage.mjs"]);
mustScript(packageJson, "test:kube-assets", ["scripts/verify-kube-demo-assets.mjs"]);
mustScript(packageJson, "test:kube-reference", ["pnpm test:kube-assets"]);
mustScript(packageJson, "test:kube-reference:strict", ["KUBE_STRICT_INTERACTIVE=1"]);
mustScript(packageJson, "test:kube-reference:exact", [
  "KUBE_EXACT_PARITY=1",
  "KUBE_MAX_DIFF_RATIO=0",
  "KUBE_PIXEL_DELTA_THRESHOLD=0",
  "KUBE_STRICT_INTERACTIVE=1"
]);
mustScript(packageJson, "test:a11y", ["verify-storybook-a11y.mjs"]);
mustScript(packageJson, "test:e2e", ["verify-liquid-behavior.mjs"]);
mustScript(packageJson, "test:storybook", ["verify-enhanced-storybook.mjs"]);
mustScript(packageJson, "test:package", ["tests/package-exports.mjs"]);
mustScript(packageJson, "ci", [
  "pnpm test:research",
  "pnpm test:governance",
  "pnpm test:component-coverage",
  "pnpm test:visual-docs",
  "pnpm test:release-readiness"
]);
mustScript(packageJson, "verify", [
  "pnpm run ci",
  "pnpm test:visual",
  "pnpm test:kube-reference:strict",
  "pnpm pack --dry-run"
]);
mustScript(packageJson, "release", ["pnpm changeset publish"]);

if (changesetConfig.access !== "public") {
  errors.push(".changeset/config.json access must be public");
}
if (changesetConfig.baseBranch !== "main") {
  errors.push(".changeset/config.json baseBranch must be main");
}

const packageRequiredFiles = [
  "README.md",
  "llms.txt",
  "LICENSE",
  "ATTRIBUTIONS.md",
  "CONTRIBUTING.md",
  "MAINTAINERS.md",
  "SECURITY.md",
  "CODE_OF_CONDUCT.md",
  "CHANGELOG.md",
  "ROADMAP.md",
  "SUPPORT.md",
  "docs/accessibility.md",
  "docs/github-repository-settings.md",
  "docs/governance-scorecard.md",
  "docs/maintainer-runbook.md",
  "docs/open-source-governance.md",
  "docs/open-source-release.md",
  "docs/release-evidence.md",
  "docs/shadcn-registry.md",
  "docs/testing.md",
  "docs/ui-library-benchmark.md",
  "docs/visual-documentation.md",
  "docs/visual-state-coverage.json",
  "docs/component-documentation.md",
  "docs/component-inventory.md",
  "docs/components/index.md",
  "docs/components/map.md",
  "examples/README.md",
  "registry.json",
  "liquid-glass.json",
  "schema/visual-state-coverage.schema.json",
  "scripts/verify-kube-demo-assets.mjs",
  "scripts/validate-visual-state-coverage.mjs"
];

const standaloneRequiredFiles = [
  ".github/workflows/ci.yml",
  ".github/workflows/visual.yml",
  ".github/workflows/pages.yml",
  ".github/workflows/release.yml",
  ".github/rulesets/main-release-gate.json",
  ".github/ISSUE_TEMPLATE/bug_report.yml",
  ".github/ISSUE_TEMPLATE/docs_report.yml",
  ".github/ISSUE_TEMPLATE/feature_request.yml",
  ".github/ISSUE_TEMPLATE/registry_report.yml",
  ".github/PULL_REQUEST_TEMPLATE.md",
  ".github/dependabot.yml",
  ".github/CODEOWNERS"
];

for (const file of packageRequiredFiles) {
  mustExist(file);
}

if (isStandaloneRepository) {
  for (const file of standaloneRequiredFiles) {
    mustExist(file);
  }
}

if (isStandaloneRepository) {
  for (const workflow of [
    ".github/workflows/ci.yml",
    ".github/workflows/visual.yml",
    ".github/workflows/pages.yml",
    ".github/workflows/release.yml"
  ]) {
    mustInclude(workflow, 'node-version: "24"');
  }
  mustInclude(".github/PULL_REQUEST_TEMPLATE.md", "pnpm test:governance");
  mustInclude(".github/PULL_REQUEST_TEMPLATE.md", "pnpm test:research");
  mustInclude(".github/PULL_REQUEST_TEMPLATE.md", "pnpm test:component-coverage");
  mustInclude(".github/PULL_REQUEST_TEMPLATE.md", "pnpm test:visual-docs");
  mustInclude(".github/PULL_REQUEST_TEMPLATE.md", "pnpm test:a11y");
  mustInclude(".github/ISSUE_TEMPLATE/docs_report.yml", "Documentation or Storybook issue");
  mustInclude(".github/ISSUE_TEMPLATE/docs_report.yml", "docs/components/map.md");
  mustInclude(
    ".github/PULL_REQUEST_TEMPLATE.md",
    "npm publish, Pages, and exact Kube parity are not claimed unless they have succeeded"
  );
  mustInclude(".github/workflows/ci.yml", "pnpm test:release-readiness");
  mustInclude(".github/workflows/ci.yml", "pnpm test:governance");
  mustInclude(".github/workflows/ci.yml", "pnpm test:research");
  mustInclude(".github/workflows/ci.yml", "pnpm test:component-coverage");
  mustInclude(".github/workflows/ci.yml", "pnpm test:visual-docs");
  mustInclude(".github/workflows/ci.yml", "pnpm test:a11y");
  mustInclude(".github/workflows/ci.yml", "pnpm test:e2e");
  mustInclude(".github/workflows/ci.yml", "FORCE_JAVASCRIPT_ACTIONS_TO_NODE24");
  mustInclude(".github/workflows/ci.yml", "timeout-minutes: 60");
  mustInclude(".github/workflows/visual.yml", "branches:");
  mustInclude(".github/workflows/visual.yml", "- main");
  mustInclude(".github/workflows/visual.yml", "pnpm test:visual");
  mustInclude(".github/workflows/visual.yml", "pnpm test:kube-reference:strict");
  mustInclude(".github/workflows/visual.yml", "timeout-minutes: 45");
  mustInclude(".github/workflows/release.yml", "pnpm verify");
  mustInclude(".github/workflows/release.yml", "NPM_TOKEN");
  mustInclude(".github/workflows/release.yml", "NPM_CONFIG_PROVENANCE");
  mustInclude(".github/workflows/release.yml", "id-token: write");
  mustInclude(".github/workflows/release.yml", "timeout-minutes: 75");
  mustInclude(".github/workflows/pages.yml", "actions/deploy-pages");
  mustInclude(".github/workflows/pages.yml", "pages-settings");
  mustInclude(".github/workflows/pages.yml", "Storybook deploy is skipped");
  mustInclude(".github/workflows/pages.yml", "needs.build.outputs.pages-enabled");
  mustInclude(".github/workflows/pages.yml", "timeout-minutes: 35");
  mustInclude(".github/workflows/pages.yml", "timeout-minutes: 10");
  mustInclude(".github/rulesets/main-release-gate.json", "main release gate");
  mustInclude(".github/rulesets/main-release-gate.json", "required_status_checks");
  mustInclude(".github/rulesets/main-release-gate.json", '"context": "ci"');
  mustInclude(".github/rulesets/main-release-gate.json", '"context": "visual"');
}
mustInclude("docs/open-source-release.md", "pnpm test:release-readiness");
mustInclude("docs/open-source-release.md", "docs/accessibility.md");
mustInclude("docs/accessibility.md", "Accessibility");
mustInclude("docs/accessibility.md", "pnpm test:a11y");
mustInclude("docs/accessibility.md", "WCAG certification");
mustInclude("docs/open-source-release.md", "llms.txt");
mustInclude("docs/open-source-release.md", "docs/maintainer-runbook.md");
mustInclude("docs/open-source-release.md", "docs/release-evidence.md");
mustInclude("docs/open-source-release.md", ".github/rulesets/main-release-gate.json");
mustInclude("MAINTAINERS.md", "docs/maintainer-runbook.md");
mustInclude("MAINTAINERS.md", "pnpm test:kube-reference:exact");
mustInclude("docs/maintainer-runbook.md", "Release Procedure");
mustInclude("docs/maintainer-runbook.md", "Pages Procedure");
mustInclude("docs/maintainer-runbook.md", "Rollback Procedure");
mustInclude("docs/maintainer-runbook.md", "pnpm verify");
mustInclude("docs/maintainer-runbook.md", "not published to npm yet");
mustInclude("llms.txt", "Assistant Rules");
mustInclude("llms.txt", "not published to npm yet");
mustInclude("llms.txt", "pnpm test:kube-assets");
mustInclude("llms.txt", "pnpm test:kube-reference:exact");
mustInclude("llms.txt", "docs/components/map.md");
mustInclude("docs/open-source-release.md", "pnpm test:governance");
mustInclude("docs/open-source-release.md", "pnpm test:component-coverage");
mustInclude("docs/open-source-release.md", "pnpm test:visual-docs");
mustInclude("docs/open-source-release.md", "pnpm test:e2e");
mustInclude("docs/ui-library-benchmark.md", "Public Benchmark Surface");
mustInclude("docs/ui-library-benchmark.md", "Public launch score");
mustInclude("docs/ui-library-benchmark.md", "not published");
mustInclude("docs/ui-library-benchmark.md", "docs/components/map.md");
mustInclude("docs/ui-library-benchmark.md", "docs/release-evidence.md");
mustInclude("docs/ui-library-benchmark.md", ".github/rulesets/main-release-gate.json");
mustInclude("docs/release-evidence.md", "Release Evidence Dashboard");
mustInclude("docs/release-evidence.md", "Do Not Claim Until Proven");
mustInclude("docs/release-evidence.md", "pnpm test:kube-reference:exact");
mustInclude(
  "docs/release-evidence.md",
  "CHECK_REMOTE_GOVERNANCE=1 pnpm --silent audit:governance:json"
);
mustInclude("docs/components/map.md", "Implemented public components: 60");
mustInclude("docs/components/map.md", "registry/components/liquid-accordion.json");
mustInclude("docs/governance-scorecard.md", "CHECK_REMOTE_GOVERNANCE=1");
mustInclude("docs/governance-scorecard.md", "pnpm --silent audit:governance:json");
mustInclude("docs/governance-scorecard.md", "remoteStatus.checked");
mustInclude("docs/visual-documentation.md", "Visual Documentation Contract");
mustInclude("docs/visual-documentation.md", "Storybook Pages");
mustInclude("docs/visual-documentation.md", "Kube reference");
mustInclude("docs/visual-documentation.md", "parameters.visualState");
mustInclude("docs/visual-documentation.md", "visual-state-coverage.json");
mustInclude("docs/visual-state-coverage.json", "componentsByProfile");
mustInclude("docs/visual-state-coverage.json", "storyEvidence");
mustInclude("docs/testing.md", "pnpm test:visual-docs");
mustInclude("docs/github-repository-settings.md", "build_type=workflow");
mustInclude("docs/open-source-release.md", "pnpm test:kube-reference:strict");
mustInclude("docs/testing.md", "pnpm test:kube-assets");
mustInclude("docs/testing.md", "observed-kube-demo-assets.json");
mustInclude("docs/open-source-release.md", "pnpm pack --dry-run");
mustInclude("docs/open-source-release.md", "NPM_CONFIG_PROVENANCE");
mustInclude("docs/open-source-release.md", "id-token: write");
mustInclude("docs/open-source-release.md", "not published to npm yet");
mustInclude("docs/open-source-governance.md", "Release Flow");
mustInclude("SUPPORT.md", "not published yet");
mustInclude("SUPPORT.md", "private security advisory");
mustInclude("SUPPORT.md", "pnpm test:kube-reference:exact");
mustInclude("docs/github-repository-settings.md", "git push -u origin main");
mustInclude("docs/github-repository-settings.md", "Branch Protection");
mustInclude("docs/github-repository-settings.md", "NPM_TOKEN");
mustInclude("docs/shadcn-registry.md", "npx shadcn@latest add");
mustInclude("docs/shadcn-registry.md", "test:shadcn-parity");

if (errors.length > 0) {
  throw new Error(
    `Release readiness check failed:\n${errors.map((error) => `- ${error}`).join("\n")}`
  );
}

console.log("Validated release readiness gates, workflows, docs, registry, and publish metadata.");
