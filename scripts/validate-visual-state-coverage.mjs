import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const coverage = readJson("docs/visual-state-coverage.json");
const inventory = readJson("docs/component-inventory.json");
const errors = [];
const profileNames = Object.keys(coverage.profiles ?? {});
const implemented = inventory.components.filter((component) => component.status === "implemented");
const implementedByName = new Map(implemented.map((component) => [component.name, component]));
const coveredByName = new Map();
const requiredGroups = ["material-mode", "environment"];
const requiredEnvironments = ["light", "dark", "high contrast", "reduced motion", "mobile"];

if (coverage.$schema !== "../schema/visual-state-coverage.schema.json") {
  errors.push("docs/visual-state-coverage.json must point at the local schema");
}

for (const profileName of profileNames) {
  const profile = coverage.profiles[profileName];
  validateStringArray(profile.stateGroups, `${profileName}.stateGroups`);
  validateStringArray(profile.reviewStates, `${profileName}.reviewStates`);
  validateStringArray(profile.environments, `${profileName}.environments`);
  validateStringArray(profile.evidence, `${profileName}.evidence`);

  for (const group of requiredGroups) {
    if (!profile.stateGroups?.includes(group)) {
      errors.push(`${profileName}: stateGroups must include ${group}`);
    }
  }

  for (const environment of requiredEnvironments) {
    if (!profile.environments?.includes(environment)) {
      errors.push(`${profileName}: environments must include ${environment}`);
    }
  }
}

for (const [profileName, componentNames] of Object.entries(coverage.componentsByProfile ?? {})) {
  if (!coverage.profiles?.[profileName]) {
    errors.push(`${profileName}: componentsByProfile references a missing profile`);
    continue;
  }

  validateStringArray(componentNames, `${profileName}.components`);

  for (const componentName of componentNames ?? []) {
    const component = implementedByName.get(componentName);
    if (!component) {
      errors.push(`${profileName}: unknown or unimplemented component ${componentName}`);
      continue;
    }

    if (component.category !== profileName) {
      errors.push(
        `${componentName}: profile ${profileName} must match inventory category ${component.category}`
      );
    }

    if (coveredByName.has(componentName)) {
      errors.push(
        `${componentName}: duplicate coverage in ${profileName} and ${coveredByName.get(componentName)}`
      );
    }
    coveredByName.set(componentName, profileName);

    if (!component.story) {
      errors.push(`${componentName}: inventory is missing story coverage`);
      continue;
    }

    if (!fs.existsSync(path.join(root, component.story))) {
      errors.push(`${componentName}: story file is missing at ${component.story}`);
    }
  }
}

for (const component of implemented) {
  if (!coveredByName.has(component.name)) {
    errors.push(`${component.name}: missing visual state coverage profile`);
  }
}

validateStoryEvidence(coverage.storyEvidence ?? []);
validateComponentStoryMetadata();

if (errors.length > 0) {
  throw new Error(
    `Visual state coverage is invalid:\n${errors.map((error) => `- ${error}`).join("\n")}`
  );
}

console.log(
  `Validated visual state coverage for ${implemented.length} implemented components across ${profileNames.length} profiles.`
);

function validateStringArray(value, label) {
  if (!Array.isArray(value) || value.length === 0) {
    errors.push(`${label} must be a non-empty array`);
    return;
  }

  for (const item of value) {
    if (typeof item !== "string" || item.trim().length === 0) {
      errors.push(`${label} must contain only non-empty strings`);
    }
  }
}

function validateStoryEvidence(entries) {
  if (!Array.isArray(entries) || entries.length === 0) {
    errors.push("storyEvidence must be a non-empty array");
    return;
  }

  for (const entry of entries) {
    validateString(entry.name, "storyEvidence.name");
    validateString(entry.profile, `${entry.name}.profile`);
    validateString(entry.story, `${entry.name}.story`);
    validateString(entry.exportName, `${entry.name}.exportName`);
    validateStringArray(entry.stateTags, `${entry.name}.stateTags`);
    validateStringArray(entry.evidence, `${entry.name}.evidence`);

    if (!coverage.profiles?.[entry.profile]) {
      errors.push(`${entry.name}: references missing profile ${entry.profile}`);
    }

    const storyPath = path.join(root, entry.story ?? "");
    if (!fs.existsSync(storyPath)) {
      errors.push(`${entry.name}: story file is missing at ${entry.story}`);
      continue;
    }

    if (entry.component) {
      const component = implementedByName.get(entry.component);
      if (!component) {
        errors.push(`${entry.name}: unknown or unimplemented component ${entry.component}`);
      } else {
        if (component.story !== entry.story) {
          errors.push(
            `${entry.name}: component ${entry.component} story must be ${component.story}`
          );
        }
        if (component.category !== entry.profile) {
          errors.push(
            `${entry.name}: component ${entry.component} profile ${entry.profile} must match ${component.category}`
          );
        }
      }
    }

    const storySource = fs.readFileSync(storyPath, "utf8");
    if (!storySource.includes(`export const ${entry.exportName}`)) {
      errors.push(`${entry.name}: missing Storybook export ${entry.exportName}`);
    }
    if (!storySource.includes("visualState")) {
      errors.push(`${entry.name}: story file must include visualState metadata`);
    }
    if (!storySource.includes(`profile: "${entry.profile}"`)) {
      errors.push(`${entry.name}: visualState metadata must include profile ${entry.profile}`);
    }

    for (const stateTag of entry.stateTags ?? []) {
      if (!storySource.includes(`"${stateTag}"`)) {
        errors.push(`${entry.name}: visualState metadata must include state tag ${stateTag}`);
      }
    }
  }
}

function validateComponentStoryMetadata() {
  const componentsByStory = new Map();

  for (const component of implemented) {
    if (!component.story) {
      continue;
    }

    const storyCoverage = componentsByStory.get(component.story) ?? {
      components: [],
      profiles: new Set()
    };

    storyCoverage.components.push(component.name);
    storyCoverage.profiles.add(component.category);
    componentsByStory.set(component.story, storyCoverage);
  }

  for (const [story, storyCoverage] of componentsByStory.entries()) {
    const storyPath = path.join(root, story);

    if (!fs.existsSync(storyPath)) {
      errors.push(`${story}: component story file is missing`);
      continue;
    }

    const storySource = fs.readFileSync(storyPath, "utf8");

    if (!storySource.includes("visualState")) {
      errors.push(`${story}: missing component-wide visualState metadata`);
    }

    if (!storySource.includes("storyVisualState")) {
      errors.push(`${story}: visualState metadata must use storyVisualState`);
    }

    for (const componentName of storyCoverage.components) {
      if (!storySource.includes(`"${componentName}"`)) {
        errors.push(`${story}: visualState metadata must list component ${componentName}`);
      }
    }

    for (const profileName of storyCoverage.profiles) {
      if (!storySource.includes(`"${profileName}"`)) {
        errors.push(`${story}: visualState metadata must list profile ${profileName}`);
      }
    }
  }
}

function validateString(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) {
    errors.push(`${label} must be a non-empty string`);
  }
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}
