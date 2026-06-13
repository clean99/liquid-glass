import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { chromium } from "playwright";

/* global document, getComputedStyle, location */

const root = process.cwd();
const targetUrl = "https://kube.io/blog/liquid-glass-css-svg/";
const manifestPath = path.join(root, "stories/assets/kube/manifest.json");
const artifactDir = path.join(root, "test-results/kube-assets");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const requiredDemoAssets = [
  "searchboxDemoBackground",
  "lensDemoBackground",
  "lensDemoInlineImage",
  "lensDemoImage"
];

const expectedUrls = new Map();
for (const name of requiredDemoAssets) {
  expectedUrls.set(name, manifest.assets[name]?.sourceUrl);
}

for (const [index, asset] of manifest.musicAlbumArtAssets.entries()) {
  expectedUrls.set(`musicAlbumArtAssets[${index}]`, asset.sourceUrl);
}

for (const [name, asset] of Object.entries(manifest.filterMapAssets ?? {})) {
  expectedUrls.set(`filterMapAssets.${name}`, asset.sourceUrl);
}

const missingManifestEntries = [...expectedUrls]
  .filter(([, url]) => typeof url !== "string" || url.length === 0)
  .map(([name]) => name);

if (missingManifestEntries.length > 0) {
  throw new Error(
    `Kube asset manifest is missing source URLs for ${missingManifestEntries.join(", ")}`
  );
}

const localAssetChecks = [
  ...Object.entries(manifest.assets ?? {}).map(([name, asset]) => ({
    asset,
    name: `assets.${name}`
  })),
  ...(manifest.musicAlbumArtAssets ?? []).map((asset, index) => ({
    asset,
    name: `musicAlbumArtAssets[${index}]`
  })),
  ...Object.entries(manifest.filterMapAssets ?? {}).map(([name, asset]) => ({
    asset,
    name: `filterMapAssets.${name}`
  }))
].map(validateLocalAsset);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1280, height: 760 }
});

try {
  await page.goto(targetUrl, { waitUntil: "networkidle", timeout: 60_000 });
  await page.getByText("Use image background", { exact: true }).click({ timeout: 15_000 });
  await page.waitForTimeout(250);

  const observed = await page.evaluate(() => {
    const parseCssUrls = (value) =>
      Array.from(String(value || "").matchAll(/url\((?:"|')?([^"')]+)(?:"|')?\)/g)).map(
        (match) => match[1]
      );
    const absolute = (url) => {
      try {
        return new URL(url, location.href).toString();
      } catch {
        return url;
      }
    };
    const cssBackgrounds = [];
    const imageUrls = [];
    const svgImageUrls = [];

    for (const element of Array.from(document.querySelectorAll("body *"))) {
      const style = getComputedStyle(element);
      const urls = parseCssUrls(style.backgroundImage);
      if (urls.length === 0) {
        continue;
      }

      const rect = element.getBoundingClientRect();
      if (rect.width < 40 || rect.height < 40) {
        continue;
      }

      cssBackgrounds.push({
        backgroundPosition: style.backgroundPosition,
        backgroundSize: style.backgroundSize,
        rect: {
          height: Math.round(rect.height),
          width: Math.round(rect.width),
          x: Math.round(rect.x),
          y: Math.round(rect.y)
        },
        text: element.textContent?.replace(/\s+/g, " ").trim().slice(0, 160) ?? "",
        urls: urls.map(absolute)
      });
    }

    for (const image of Array.from(document.images)) {
      const src = image.currentSrc || image.getAttribute("src");
      if (src) {
        imageUrls.push({
          alt: image.alt,
          src: absolute(src)
        });
      }
    }

    for (const image of Array.from(
      document.querySelectorAll("svg image, image, svg feImage, feImage")
    )) {
      const href = image.getAttribute("href") || image.getAttribute("xlink:href");
      if (href) {
        svgImageUrls.push({
          height: image.getAttribute("height"),
          href: absolute(href),
          width: image.getAttribute("width")
        });
      }
    }

    return {
      cssBackgrounds,
      imageUrls,
      pageUrl: location.href,
      svgImageUrls
    };
  });

  const observedUrls = new Set([
    ...observed.cssBackgrounds.flatMap((background) => background.urls),
    ...observed.imageUrls.map((image) => image.src),
    ...observed.svgImageUrls.map((image) => image.href)
  ]);
  const expectedUrlValues = new Set(expectedUrls.values());
  const observedCssBackgroundUrls = [
    ...new Set(observed.cssBackgrounds.flatMap((background) => background.urls))
  ];
  const generatedFallbackAssets = manifest.generatedFallbackAssets ?? [];
  const coveredFallbackSourceUrls = new Set(
    generatedFallbackAssets
      .map((asset) => asset?.sourceUrl)
      .filter((sourceUrl) => typeof sourceUrl === "string" && sourceUrl.length > 0)
  );
  const uncoveredCssBackgrounds = observedCssBackgroundUrls.filter(
    (url) => !expectedUrlValues.has(url) && !coveredFallbackSourceUrls.has(url)
  );

  const missing = [...expectedUrls].filter(([, url]) => !observedUrls.has(url));

  fs.mkdirSync(artifactDir, { recursive: true });
  fs.writeFileSync(
    path.join(artifactDir, "observed-kube-demo-assets.json"),
    JSON.stringify(
      {
        expected: Object.fromEntries(expectedUrls),
        generatedFallbackAssets,
        missing: missing.map(([name, url]) => ({ name, url })),
        localAssets: localAssetChecks,
        observed,
        observedCssBackgrounds: observedCssBackgroundUrls,
        observedAt: new Date().toISOString(),
        uncoveredCssBackgrounds,
        sourcePage: targetUrl
      },
      null,
      2
    )
  );

  if (missing.length > 0) {
    throw new Error(
      `Kube demo asset verification failed:\n${missing
        .map(([name, url]) => `- ${name}: ${url}`)
        .join("\n")}`
    );
  }

  if (uncoveredCssBackgrounds.length > 0) {
    throw new Error(
      `Kube demo background asset verification failed. Add these rendered CSS backgrounds to stories/assets/kube/manifest.json or record a generated fallback:\n${uncoveredCssBackgrounds
        .map((url) => `- ${url}`)
        .join("\n")}`
    );
  }

  console.log(
    `Verified ${expectedUrls.size} Kube demo asset URLs from the rendered public page and ${localAssetChecks.length} local fixture locks.`
  );
} finally {
  await browser.close();
}

function validateLocalAsset({ asset, name }) {
  const localPath = path.join(root, "stories/assets/kube", asset.file);
  const bytes = fs.readFileSync(localPath);
  const sha256 = crypto.createHash("sha256").update(bytes).digest("hex");
  const dimensions = readRasterSize(bytes);
  const errors = [];

  if (sha256 !== asset.sha256) {
    errors.push(`sha256 ${sha256} !== ${asset.sha256}`);
  }

  if (dimensions.width !== asset.width || dimensions.height !== asset.height) {
    errors.push(
      `dimensions ${dimensions.width}x${dimensions.height} !== ${asset.width}x${asset.height}`
    );
  }

  if (errors.length > 0) {
    throw new Error(
      `Kube local asset verification failed for ${name} (${asset.file}): ${errors.join(", ")}`
    );
  }

  return {
    file: asset.file,
    height: dimensions.height,
    name,
    sha256,
    sourceUrl: asset.sourceUrl,
    width: dimensions.width
  };
}

function readRasterSize(bytes) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    return readJpegSize(bytes);
  }

  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return { height: bytes.readUInt32BE(20), width: bytes.readUInt32BE(16) };
  }

  throw new Error("Unsupported Kube reference raster format");
}

function readJpegSize(bytes) {
  let offset = 2;

  while (offset < bytes.length - 1) {
    if (bytes[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = bytes[offset + 1];
    offset += 2;

    if (
      marker === 0x01 ||
      marker === 0xd8 ||
      marker === 0xd9 ||
      (marker >= 0xd0 && marker <= 0xd7)
    ) {
      continue;
    }

    if (offset + 2 > bytes.length) {
      break;
    }

    const length = bytes.readUInt16BE(offset);

    if (isJpegStartOfFrame(marker)) {
      return {
        height: bytes.readUInt16BE(offset + 3),
        width: bytes.readUInt16BE(offset + 5)
      };
    }

    offset += length;
  }

  throw new Error("Unable to read Kube reference JPEG dimensions");
}

function isJpegStartOfFrame(marker) {
  return marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
}
