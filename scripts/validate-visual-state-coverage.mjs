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

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}
