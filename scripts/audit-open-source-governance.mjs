import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const minScore = Number(readArgValue("--min-score") ?? 0);
const checkRemote = process.env.CHECK_REMOTE_GOVERNANCE === "1";
const jsonOutput = process.argv.includes("--json");
const packageJson = readJson("package.json");

const categoryChecks = [
  {
    name: "repository-first-screen",
    checks: [
      fileIncludes("README.md", "Project Status"),
      fileIncludes("README.md", "Start Here"),
      fileIncludes("README.md", "not published to npm yet"),
      fileIncludes("README.md", "shadcn-style Registry"),
      valueIncludes(
        packageJson.description,
        "Liquid Glass",
        "package description positions package"
      ),
      arrayIncludes(
        packageJson.keywords,
        "accessibility",
        "package keywords include accessibility"
      ),
      arrayIncludes(packageJson.keywords, "shadcn-ui", "package keywords include shadcn-ui")
    ]
  },
  {
    name: "documentation-structure",
    checks: [
      exists("docs/installation.md"),
      exists("docs/api-overview.md"),
      exists("docs/testing.md"),
      exists("docs/open-source-governance.md"),
      exists("docs/governance-scorecard.md"),
      exists("docs/open-source-release.md"),
      exists("ROADMAP.md"),
      fileIncludes("docs/open-source-governance.md", "```mermaid"),
      fileIncludes("ROADMAP.md", "```mermaid")
    ]
  },
  {
    name: "contribution-workflow",
    checks: [
      exists("CONTRIBUTING.md"),
      fileIncludes("CONTRIBUTING.md", "pnpm test:inventory"),
      fileIncludes("CONTRIBUTING.md", "pnpm verify"),
      exists(".github/PULL_REQUEST_TEMPLATE.md"),
      exists(".github/ISSUE_TEMPLATE/bug_report.yml"),
      exists(".github/ISSUE_TEMPLATE/feature_request.yml"),
      exists(".github/ISSUE_TEMPLATE/registry_report.yml"),
      exists(".github/CODEOWNERS")
    ]
  },
  {
    name: "release-ci",
    checks: [
      scriptIncludes("ci", "pnpm test:governance"),
      scriptIncludes("ci", "pnpm test:release-readiness"),
      scriptIncludes("verify", "pnpm test:kube-reference:strict"),
      workflowIncludes("ci.yml", 'node-version: "24"'),
      workflowIncludes("ci.yml", "FORCE_JAVASCRIPT_ACTIONS_TO_NODE24"),
      workflowIncludes("release.yml", "pnpm verify"),
      workflowIncludes("release.yml", "NPM_CONFIG_PROVENANCE"),
      workflowIncludes("release.yml", "id-token: write")
    ]
  },
  {
    name: "registry-distribution",
    checks: [
      exists("registry.json"),
      exists("liquid-glass.json"),
      exists("registry/liquid-glass.json"),
      scriptIncludes("test:registry", "build-component-registry"),
      fileIncludes("docs/shadcn-registry.md", "requires the npm package"),
      fileIncludes("docs/shadcn-registry.md", "npx shadcn@latest add")
    ]
  },
  {
    name: "storybook-pages",
    checks: [
      workflowIncludes("pages.yml", "actions/configure-pages"),
      workflowIncludes("pages.yml", "actions/deploy-pages"),
      workflowIncludes("pages.yml", "pnpm test:a11y"),
      scriptIncludes("storybook:build", "storybook build"),
      fileIncludes("docs/github-repository-settings.md", "Pages source")
    ]
  },
  {
    name: "dependency-governance",
    checks: [
      exists(".github/dependabot.yml"),
      fileIncludes(".github/dependabot.yml", "component-engines"),
      fileIncludes(".github/dependabot.yml", "storybook"),
      fileIncludes(".github/dependabot.yml", "test-tooling"),
      fileIncludes(".github/dependabot.yml", "github-actions"),
      valueEquals(packageJson.engines?.node, ">=22.13.0", "Node engine matches pnpm 11 floor"),
      valueEquals(packageJson.engines?.pnpm, ">=11", "pnpm engine is >=11")
    ]
  },
  {
    name: "security-attribution",
    checks: [
      exists("LICENSE"),
      exists("SECURITY.md"),
      fileIncludes("SECURITY.md", "Supported Versions"),
      exists("ATTRIBUTIONS.md"),
      exists("docs/reference-provenance.json"),
      fileIncludes("ATTRIBUTIONS.md", "No source code has been copied"),
      scriptIncludes("test:research", "validate-reference-provenance")
    ]
  },
  {
    name: "publish-readiness",
    checks: [
      valueEquals(packageJson.publishConfig?.access, "public", "publish access is public"),
      valueEquals(packageJson.private, undefined, "package is not private"),
      scriptIncludes("release", "changeset publish"),
      exists(".changeset/config.json"),
      arrayIncludes(packageJson.files, "dist", "package files include dist"),
      arrayIncludes(packageJson.files, "README.md", "package files include README"),
      arrayIncludes(packageJson.files, "ROADMAP.md", "package files include ROADMAP"),
      fileIncludes("docs/open-source-release.md", "not published to npm yet")
    ]
  },
  {
    name: "discoverability",
    checks: [
      valueIncludes(packageJson.homepage, "github.com/clean99/liquid-glass", "package homepage"),
      valueIncludes(
        packageJson.repository?.url,
        "github.com/clean99/liquid-glass",
        "repository URL"
      ),
      valueIncludes(packageJson.bugs?.url, "github.com/clean99/liquid-glass/issues", "bugs URL"),
      arrayIncludes(packageJson.keywords, "react", "keyword react"),
      arrayIncludes(packageJson.keywords, "design-system", "keyword design-system"),
      arrayIncludes(packageJson.keywords, "liquid-glass", "keyword liquid-glass"),
      arrayIncludes(packageJson.keywords, "svg-filter", "keyword svg-filter")
    ]
  }
];

if (checkRemote) {
  const repository = await fetchJson("https://api.github.com/repos/clean99/liquid-glass");
  const pages = await fetchJson("https://api.github.com/repos/clean99/liquid-glass/pages", {
    tolerateNotFound: true
  });

  categoryChecks.push({
    name: "remote-repository-state",
    checks: [
      valueEquals(repository.private, false, "repository is public"),
      valueEquals(repository.default_branch, "main", "default branch is main"),
      valueEquals(repository.has_pages, true, "GitHub Pages is enabled"),
      valueIncludes(repository.homepage, "http", "repository homepage is set"),
      valueEquals(repository.has_wiki, false, "wiki is disabled when docs are canonical"),
      arrayIncludes(repository.topics, "react", "topic react"),
      arrayIncludes(repository.topics, "liquid-glass", "topic liquid-glass"),
      arrayIncludes(repository.topics, "accessibility", "topic accessibility"),
      valueIncludes(pages.html_url, "github.io", "Pages URL exists")
    ]
  });
}

const results = categoryChecks.map((category) => {
  const passed = category.checks.filter((check) => check.passed).length;
  const score = Math.round((passed / category.checks.length) * 10);
  return { ...category, passed, score, total: category.checks.length };
});
const overall =
  Math.round((results.reduce((sum, result) => sum + result.score, 0) / results.length) * 10) / 10;

const report = {
  categories: results.map((result) => ({
    failed: result.checks.filter((check) => !check.passed).map((check) => check.label),
    name: result.name,
    passed: result.passed,
    score: result.score,
    total: result.total
  })),
  minScore: minScore > 0 ? minScore / 10 : null,
  overall,
  remote: checkRemote
};

if (jsonOutput) {
  console.log(JSON.stringify(report, null, 2));
} else {
  for (const result of results) {
    console.log(`${result.name}: ${result.score}/10 (${result.passed}/${result.total})`);
    for (const check of result.checks.filter((item) => !item.passed)) {
      console.log(`  - ${check.label}`);
    }
  }
  console.log(`overall-governance-score: ${overall}/10`);
}

if (minScore > 0 && overall < minScore / 10) {
  throw new Error(`Governance score ${overall}/10 is below required ${minScore / 10}/10`);
}

function readArgValue(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) {
    return null;
  }
  return process.argv[index + 1] ?? null;
}

function exists(relativePath) {
  return {
    label: `${relativePath} exists`,
    passed: fs.existsSync(path.join(root, relativePath))
  };
}

function fileIncludes(relativePath, snippet) {
  const target = path.join(root, relativePath);
  return {
    label: `${relativePath} includes ${JSON.stringify(snippet)}`,
    passed: fs.existsSync(target) && fs.readFileSync(target, "utf8").includes(snippet)
  };
}

function workflowIncludes(name, snippet) {
  return fileIncludes(path.join(".github", "workflows", name), snippet);
}

function scriptIncludes(name, snippet) {
  return {
    label: `package script ${name} includes ${JSON.stringify(snippet)}`,
    passed: String(packageJson.scripts?.[name] ?? "").includes(snippet)
  };
}

function valueEquals(actual, expected, label) {
  return { label, passed: actual === expected };
}

function valueIncludes(actual, expected, label) {
  return { label, passed: String(actual ?? "").includes(expected) };
}

function arrayIncludes(actual, expected, label) {
  return { label, passed: Array.isArray(actual) && actual.includes(expected) };
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      accept: "application/vnd.github+json",
      "user-agent": "clean99-liquid-glass-governance-audit"
    }
  });

  if (options.tolerateNotFound && response.status === 404) {
    return {};
  }

  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }

  return response.json();
}
