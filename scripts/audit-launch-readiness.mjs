import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const jsonOutput = process.argv.includes("--json");
const minPercent = Number(readArgValue("--min-percent") ?? 0);
const checkRemote = process.env.CHECK_REMOTE_LAUNCH === "1";
const inventory = readJson("docs/component-inventory.json");
const componentDocs = fs
  .readdirSync(path.join(root, "docs", "components"))
  .filter((file) => file.endsWith(".md") && !["index.md", "map.md"].includes(file));
const implementedComponents = inventory.components.filter(
  (component) => component.status === "implemented"
);
const writtenImplementedComponentDocs = implementedComponents.filter((component) =>
  fs.existsSync(path.join(root, "docs", "components", `${component.name}.md`))
);
const foundationComponentDocs = componentDocs.filter((file) =>
  ["provider.md", "surface.md"].includes(file)
);
const documentationStructureComplete =
  fileIncludes("README.md", "docs/progress-checkpoints.md") &&
  fileIncludes("docs/index.md", "docs/progress-checkpoints.md") &&
  fileIncludes("stories/Introduction.mdx", "docs/progress-checkpoints.md") &&
  fileIncludes("docs/site-navigation.md", "docs/progress-checkpoints.md") &&
  fileIncludes("docs/index.md", "docs/release-evidence.md") &&
  fileIncludes("stories/Introduction.mdx", "docs/release-evidence.md") &&
  fileIncludes("docs/index.md", "docs/components/index.md");
const remoteStatus = checkRemote ? await fetchRemoteStatus() : { checked: false, requested: false };

const areas = [
  {
    name: "repository-first-screen",
    score: remoteStatus.homepage?.live ? 10 : 9,
    evidence: ["README.md", "docs/index.md", "package.json"],
    blocker: remoteStatus.homepage?.live
      ? null
      : "Repository homepage does not point to live Pages."
  },
  {
    name: "documentation-structure",
    score: documentationStructureComplete ? 10 : 9,
    evidence: ["README.md", "docs/index.md", "stories/Introduction.mdx", "docs/site-navigation.md"],
    blocker: documentationStructureComplete
      ? null
      : "Keep checkpoint docs linked from README, Storybook, and docs index."
  },
  {
    name: "component-documentation",
    score: Math.min(
      10,
      Math.round((writtenImplementedComponentDocs.length / implementedComponents.length) * 10)
    ),
    evidence: [
      `${writtenImplementedComponentDocs.length} package-backed component docs`,
      `${foundationComponentDocs.length} foundation docs`,
      `${implementedComponents.length} implemented inventory entries`
    ],
    blocker:
      writtenImplementedComponentDocs.length === implementedComponents.length
        ? null
        : "Finish remaining package-backed component pages."
  },
  {
    name: "contribution-workflow",
    score: remoteStatus.branchProtection?.applied ? 10 : 9,
    evidence: ["CONTRIBUTING.md", ".github/PULL_REQUEST_TEMPLATE.md", ".github/CODEOWNERS"],
    blocker: remoteStatus.branchProtection?.applied
      ? null
      : "Apply main branch protection remotely."
  },
  {
    name: "release-and-ci-gates",
    score: remoteStatus.latestRuns?.allGreen ? 9 : 8,
    evidence: [
      ".github/workflows/ci.yml",
      ".github/workflows/visual.yml",
      "package.json#scripts.verify"
    ],
    blocker: remoteStatus.latestRuns?.allGreen
      ? "Keep latest main workflows green before release."
      : "Latest main workflow state must be checked before release."
  },
  {
    name: "registry-distribution",
    score: remoteStatus.npm?.published ? 10 : 8,
    evidence: ["registry.json", "liquid-glass.json", "registry/components/*.json"],
    blocker: remoteStatus.npm?.published
      ? null
      : "npm package must exist before live registry claims."
  },
  {
    name: "github-pages-docs-site",
    score: remoteStatus.pages?.live ? 10 : 5,
    evidence: [".github/workflows/pages.yml", "stories/Introduction.mdx"],
    blocker: remoteStatus.pages?.live
      ? null
      : "Enable Pages with GitHub Actions and verify HTTP 200."
  },
  {
    name: "dependency-governance",
    score: 8,
    evidence: [".github/dependabot.yml", "package.json#engines"],
    blocker: "Monitor grouped dependency PRs after first public release."
  },
  {
    name: "security-and-attribution",
    score: 9,
    evidence: ["SECURITY.md", "ATTRIBUTIONS.md", "docs/reference-provenance.json"],
    blocker: "Keep every new external reference recorded before use."
  },
  {
    name: "npm-publish-preparation",
    score: remoteStatus.npm?.published ? 10 : 7,
    evidence: [
      ".changeset/config.json",
      ".github/workflows/release.yml",
      "package.json#publishConfig"
    ],
    blocker: remoteStatus.npm?.published
      ? null
      : "Configure release secret and complete first npm publish with provenance."
  },
  {
    name: "repository-discoverability",
    score: remoteStatus.homepage?.live ? 10 : 8,
    evidence: ["package.json#keywords", "llms.txt", "docs/github-repository-settings.md"],
    blocker: remoteStatus.homepage?.live
      ? null
      : "Homepage and public docs URL are blocked by Pages."
  }
];

const total = areas.reduce((sum, area) => sum + area.score, 0);
const max = areas.length * 10;
const percent = Math.round((total / max) * 100);
const report = {
  areas,
  generatedAt: new Date().toISOString(),
  max,
  percent,
  remoteStatus,
  total
};

if (jsonOutput) {
  console.log(JSON.stringify(report, null, 2));
} else {
  for (const area of areas) {
    console.log(`${area.name}: ${area.score}/10`);
    console.log(`  evidence: ${area.evidence.join(", ")}`);
    if (area.blocker) {
      console.log(`  blocker: ${area.blocker}`);
    }
  }
  console.log(`launch-progress-score: ${total}/${max} (${percent}%)`);
  if (checkRemote && !remoteStatus.checked) {
    console.log(`remote-status: skipped (${remoteStatus.error})`);
  }
}

if (minPercent > 0 && percent < minPercent) {
  throw new Error(`Launch readiness ${percent}% is below required ${minPercent}%`);
}

function readArgValue(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) {
    return null;
  }
  return process.argv[index + 1] ?? null;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function fileIncludes(relativePath, snippet) {
  const target = path.join(root, relativePath);
  return fs.existsSync(target) && fs.readFileSync(target, "utf8").includes(snippet);
}

async function fetchRemoteStatus() {
  try {
    const [repository, pages, npmPackage, pagesUrl, latestRuns] = await Promise.all([
      fetchJson("https://api.github.com/repos/clean99/liquid-glass"),
      fetchJson("https://api.github.com/repos/clean99/liquid-glass/pages", {
        tolerateNotFound: true
      }),
      fetchJson("https://registry.npmjs.org/@clean99%2fliquid-glass", {
        tolerateNotFound: true
      }),
      fetchUrlStatus("https://clean99.github.io/liquid-glass/"),
      fetchLatestRuns()
    ]);

    return {
      branchProtection: { applied: false },
      checked: true,
      error: null,
      homepage: {
        live: String(repository.homepage ?? "").includes("https://clean99.github.io/liquid-glass/")
      },
      latestRuns,
      npm: { published: Boolean(npmPackage.name) },
      pages: {
        apiEnabled: Boolean(pages.html_url),
        live: pagesUrl.status === 200,
        status: pagesUrl.status
      },
      requested: true,
      repository: {
        defaultBranch: repository.default_branch,
        hasPages: repository.has_pages,
        hasWiki: repository.has_wiki,
        private: repository.private,
        topics: repository.topics ?? []
      }
    };
  } catch (error) {
    return {
      checked: false,
      error: error instanceof Error ? error.message : String(error),
      requested: true
    };
  }
}

async function fetchLatestRuns() {
  const sha = currentGitSha();
  if (!sha) {
    return { allGreen: false, checked: false, runs: [] };
  }

  const data = await fetchJson(
    `https://api.github.com/repos/clean99/liquid-glass/actions/runs?head_sha=${sha}&per_page=20`
  );
  const required = new Map([
    ["CI", false],
    ["Storybook Pages", false],
    ["Visual Regression", false]
  ]);

  for (const run of data.workflow_runs ?? []) {
    if (required.has(run.name)) {
      required.set(run.name, run.status === "completed" && run.conclusion === "success");
    }
  }

  return {
    allGreen: [...required.values()].every(Boolean),
    checked: true,
    runs: [...required.entries()].map(([name, passed]) => ({ name, passed }))
  };
}

function currentGitSha() {
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      accept: "application/vnd.github+json",
      "user-agent": "clean99-liquid-glass-launch-audit"
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

async function fetchUrlStatus(url) {
  const response = await fetch(url, { redirect: "manual" });
  return { status: response.status };
}
