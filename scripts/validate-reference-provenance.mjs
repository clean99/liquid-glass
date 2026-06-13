import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const provenancePath = path.join(root, "docs/reference-provenance.json");
const errors = [];
const provenance = JSON.parse(fs.readFileSync(provenancePath, "utf8"));
const checkRemoteRefs = process.env.CHECK_REMOTE_REFS === "1";

if (!Array.isArray(provenance.references) || provenance.references.length === 0) {
  errors.push("docs/reference-provenance.json must contain at least one reference");
}

const seenNames = new Set();
const provenanceUrls = new Set(
  (provenance.references ?? []).map((reference) => normalizeReferenceUrl(reference.url))
);

for (const reference of provenance.references ?? []) {
  if (seenNames.has(reference.name)) {
    errors.push(`Duplicate reference: ${reference.name}`);
  }
  seenNames.add(reference.name);

  if (!reference.url?.startsWith("https://")) {
    errors.push(`${reference.name}: url must be an https URL`);
  }

  if (reference.copiedSource !== false) {
    errors.push(`${reference.name}: copiedSource must stay false`);
  }

  if (reference.commit !== null && !/^[0-9a-f]{40}$/.test(reference.commit)) {
    errors.push(`${reference.name}: commit must be a 40-character SHA or null`);
  }

  if (!Array.isArray(reference.usedFor) || reference.usedFor.length === 0) {
    errors.push(`${reference.name}: usedFor must describe the research purpose`);
  }

  for (const doc of reference.requiredDocs ?? []) {
    const docPath = path.join(root, doc);
    if (!fs.existsSync(docPath)) {
      errors.push(`${reference.name}: missing required doc ${doc}`);
      continue;
    }

    const source = fs.readFileSync(docPath, "utf8").toLowerCase();
    const normalizedName = reference.name.toLowerCase();
    const normalizedUrl = reference.url.toLowerCase();
    const includesName =
      source.includes(normalizedName) ||
      normalizedName
        .split(/[/@\s-]+/)
        .filter(Boolean)
        .some((part) => part.length > 3 && source.includes(part));
    const includesUrl = source.includes(normalizedUrl);

    if (!includesName && !includesUrl) {
      errors.push(`${reference.name}: ${doc} must mention the reference name or URL`);
    }

    if (reference.commit && !source.includes(reference.commit)) {
      errors.push(`${reference.name}: ${doc} must mention inspected commit ${reference.commit}`);
    }

    if (reference.license !== "article reference only" && doc === "ATTRIBUTIONS.md") {
      const licenseWords = reference.license.toLowerCase().split(/\s+or\s+|\s+/);
      if (!licenseWords.some((word) => word.length > 1 && source.includes(word))) {
        errors.push(`${reference.name}: ${doc} must mention license ${reference.license}`);
      }
    }
  }

  if (reference.commit && checkRemoteRefs) {
    assertRemoteContainsCommit(reference);
  }
}

const attribution = fs.readFileSync(path.join(root, "ATTRIBUTIONS.md"), "utf8").toLowerCase();
if (!attribution.includes("no source code has been copied")) {
  errors.push("ATTRIBUTIONS.md must explicitly state that referenced source code was not copied");
}

for (const url of extractUnsplashImageUrls(attribution)) {
  if (!provenanceUrls.has(normalizeReferenceUrl(url))) {
    errors.push(`ATTRIBUTIONS.md mentions untracked Unsplash image ${url}`);
  }
}

for (const file of collectFiles(path.join(root, "stories"), (filePath) =>
  /\.(?:ts|tsx)$/.test(filePath)
)) {
  const source = fs.readFileSync(file, "utf8");
  const relativePath = path.relative(root, file);
  for (const url of extractUnsplashImageUrls(source)) {
    if (!provenanceUrls.has(normalizeReferenceUrl(url))) {
      errors.push(`${relativePath} uses untracked Unsplash image ${url}`);
    }
  }
}

if (errors.length > 0) {
  throw new Error(
    `Reference provenance is invalid:\n${errors.map((error) => `- ${error}`).join("\n")}`
  );
}

console.log(
  `Validated ${provenance.references.length} external research references${
    checkRemoteRefs ? " with remote commit checks" : ""
  }.`
);

function assertRemoteContainsCommit(reference) {
  const output = execFileSync("git", ["ls-remote", reference.url], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
  const commits = new Set(
    output
      .split("\n")
      .map((line) => line.split(/\s+/)[0])
      .filter(Boolean)
  );

  if (!commits.has(reference.commit)) {
    errors.push(
      `${reference.name}: remote ${reference.url} does not advertise ${reference.commit}`
    );
  }
}

function extractUnsplashImageUrls(source) {
  return [...source.matchAll(/https:\/\/images\.unsplash\.com\/photo-[^"'\s)`]+/g)].map(([url]) =>
    normalizeReferenceUrl(url)
  );
}

function normalizeReferenceUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return url;
  }
}

function collectFiles(directory, predicate) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(entryPath, predicate));
    } else if (predicate(entryPath)) {
      files.push(entryPath);
    }
  }
  return files;
}
