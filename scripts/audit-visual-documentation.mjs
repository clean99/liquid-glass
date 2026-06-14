import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const jsonOutput = process.argv.includes("--json");
const minPercent = Number(readArgValue("--min-percent") ?? 0);
const coverage = readJson("docs/visual-state-coverage.json");
const inventory = readJson("docs/component-inventory.json");
const requiredGroups = ["material-mode", "environment"];
const requiredEnvironments = ["light", "dark", "high contrast", "reduced motion", "mobile"];
const implemented = inventory.components.filter((component) => component.status === "implemented");
const implementedByName = new Map(implemented.map((component) => [component.name, component]));
const coveredNames = new Set(Object.values(coverage.componentsByProfile ?? {}).flat());
const coveredImplemented = implemented.filter((component) => coveredNames.has(component.name));
const missingComponents = implemented
  .filter((component) => !coveredNames.has(component.name))
  .map((component) => component.name);
const duplicateComponents = findDuplicates(
  Object.values(coverage.componentsByProfile ?? {}).flat()
);
const profileResults = Object.entries(coverage.profiles ?? {}).map(([name, profile]) => {
  const missingGroups = requiredGroups.filter((group) => !profile.stateGroups?.includes(group));
  const missingEnvironments = requiredEnvironments.filter(
    (environment) => !profile.environments?.includes(environment)
  );
  return {
    complete: missingGroups.length === 0 && missingEnvironments.length === 0,
    componentCount: coverage.componentsByProfile?.[name]?.length ?? 0,
    missingEnvironments,
    missingGroups,
    name,
    reviewStateCount: profile.reviewStates?.length ?? 0
  };
});
const storyEvidence = coverage.storyEvidence ?? [];
const storyResults = storyEvidence.map((entry) => {
  const storyExists = fs.existsSync(path.join(root, entry.story ?? ""));
  const component = entry.component ? implementedByName.get(entry.component) : null;
  return {
    componentKnown: !entry.component || Boolean(component),
    name: entry.name,
    profile: entry.profile,
    referenceEvidence: entry.stateTags?.includes("Kube reference") ?? false,
    story: entry.story,
    storyExists,
    tagCount: entry.stateTags?.length ?? 0
  };
});
const validStoryEvidence = storyResults.filter(
  (entry) => entry.storyExists && entry.componentKnown && entry.tagCount > 0
);
const referenceEvidence = storyResults.filter((entry) => entry.referenceEvidence);
const profileContractCount = profileResults.filter((profile) => profile.complete).length;
const referenceDocsReady =
  referenceEvidence.length >= 5 &&
  fileIncludes("docs/kube-parity-gate.md", "pnpm test:kube-reference:exact") &&
  fileIncludes("docs/visual-documentation.md", "Kube reference");

const scoreItems = [
  {
    earned: proportional(coveredImplemented.length, implemented.length, 20),
    label: "implemented-component-coverage",
    total: 20
  },
  {
    earned: proportional(profileContractCount, profileResults.length, 15),
    label: "state-profile-contract",
    total: 15
  },
  {
    earned: proportional(validStoryEvidence.length, storyEvidence.length, 10),
    label: "story-evidence",
    total: 10
  },
  {
    earned: referenceDocsReady ? 5 : 0,
    label: "reference-honesty",
    total: 5
  }
];

const score = scoreItems.reduce((sum, item) => sum + item.earned, 0);
const maxScore = scoreItems.reduce((sum, item) => sum + item.total, 0);
const percent = Math.round((score / maxScore) * 100);
const blockers = [
  ...missingComponents.map((component) => `${component}: missing visual state profile`),
  ...duplicateComponents.map((component) => `${component}: duplicate visual state profile`),
  ...profileResults
    .filter((profile) => !profile.complete)
    .map((profile) => {
      const missing = [...profile.missingGroups, ...profile.missingEnvironments].join(", ");
      return `${profile.name}: missing ${missing}`;
    }),
  ...storyResults
    .filter((entry) => !entry.storyExists)
    .map((entry) => `${entry.name}: missing story file ${entry.story}`),
  ...storyResults
    .filter((entry) => !entry.componentKnown)
    .map((entry) => `${entry.name}: unknown component`),
  ...(referenceDocsReady ? [] : ["reference evidence is not ready for Kube honesty claims"])
];

const report = {
  blockers,
  componentCoverage: {
    covered: coveredImplemented.length,
    implemented: implemented.length,
    missing: missingComponents
  },
  profileCoverage: {
    complete: profileContractCount,
    profiles: profileResults.length,
    rows: profileResults
  },
  referenceEvidence: {
    ready: referenceDocsReady,
    rows: referenceEvidence.map((entry) => entry.name),
    total: referenceEvidence.length
  },
  score,
  scoreItems,
  storyEvidence: {
    valid: validStoryEvidence.length,
    rows: storyResults,
    total: storyEvidence.length
  },
  visualDocsScore: `${score}/${maxScore} (${percent}%)`
};

if (jsonOutput) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`visual-docs-component-coverage: ${coveredImplemented.length}/${implemented.length}`);
  console.log(`visual-docs-profile-contract: ${profileContractCount}/${profileResults.length}`);
  console.log(`visual-docs-story-evidence: ${validStoryEvidence.length}/${storyEvidence.length}`);
  console.log(`visual-docs-reference-evidence: ${referenceEvidence.length} rows`);
  for (const item of scoreItems) {
    console.log(`${item.label}: ${item.earned}/${item.total}`);
  }
  for (const blocker of blockers) {
    console.log(`  blocker: ${blocker}`);
  }
  console.log(`visual-docs-score: ${score}/${maxScore} (${percent}%)`);
}

if (minPercent > 0 && percent < minPercent) {
  throw new Error(`Visual documentation score ${percent}% is below required ${minPercent}%`);
}

function proportional(value, total, points) {
  if (total === 0) {
    return 0;
  }
  return Math.round((value / total) * points);
}

function fileIncludes(relativePath, snippet) {
  const target = path.join(root, relativePath);
  return fs.existsSync(target) && fs.readFileSync(target, "utf8").includes(snippet);
}

function findDuplicates(values) {
  const seen = new Set();
  const duplicates = new Set();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    }
    seen.add(value);
  }

  return [...duplicates];
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
