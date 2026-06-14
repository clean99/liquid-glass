import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { chromium } from "playwright";

/* global createImageBitmap, document, getComputedStyle, location */

const root = process.cwd();
const targetUrl = "https://kube.io/blog/liquid-glass-css-svg/";
const manifestPath = path.join(root, "stories/assets/kube/manifest.json");
const artifactDir = path.join(root, "test-results/kube-assets");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const remoteTextCache = new Map();
const targetNavigationRetries = Number(process.env.KUBE_NAVIGATION_RETRIES ?? 3);
const targetNavigationTimeoutMs = Number(process.env.KUBE_NAVIGATION_TIMEOUT_MS ?? 60_000);

const requiredDemoAssets = [
  "searchboxDemoBackground",
  "lensDemoBackground",
  "lensDemoInlineImage",
  "lensDemoImage"
];
const requiredCssOnlyBackgroundAssets = ["controlGridBackground"];

const expectedUrls = new Map();
const expectedFontUrls = new Map();
const expectedCssOnlyBackgroundUrls = new Map();
for (const name of requiredDemoAssets) {
  expectedUrls.set(name, manifest.assets[name]?.sourceUrl);
}

for (const name of requiredCssOnlyBackgroundAssets) {
  expectedCssOnlyBackgroundUrls.set(name, manifest.cssOnlyBackgroundAssets?.[name]?.sourceUrl);
}

for (const [index, asset] of manifest.musicAlbumArtAssets.entries()) {
  expectedUrls.set(`musicAlbumArtAssets[${index}]`, asset.sourceUrl);
}

for (const [name, asset] of Object.entries(manifest.filterMapAssets ?? {})) {
  expectedUrls.set(`filterMapAssets.${name}`, asset.sourceUrl);
}

for (const [name, asset] of Object.entries(manifest.fontAssets ?? {})) {
  expectedFontUrls.set(`fontAssets.${name}`, asset.sourceUrl);
}

const missingManifestEntries = [
  ...expectedUrls,
  ...expectedFontUrls,
  ...expectedCssOnlyBackgroundUrls
]
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

const localFontAssetChecks = Object.entries(manifest.fontAssets ?? {}).map(([name, asset]) =>
  validateLocalFontAsset({ asset, name: `fontAssets.${name}` })
);
const cssOnlyBackgroundAssetChecks = Object.entries(manifest.cssOnlyBackgroundAssets ?? {}).map(
  ([name, asset]) => validateLocalAsset({ asset, name: `cssOnlyBackgroundAssets.${name}` })
);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1280, height: 760 }
});
const cdpResponseUrls = [];
const cdpSession = await page.context().newCDPSession(page);
await cdpSession.send("Network.enable");
cdpSession.on("Network.responseReceived", (event) => {
  const url = event.response?.url;

  if (typeof url === "string" && url.length > 0) {
    cdpResponseUrls.push(url);
  }
});

try {
  await gotoTargetReference(page);
  await page.waitForLoadState("load", { timeout: 20_000 }).catch(() => undefined);
  await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => undefined);
  await page
    .waitForFunction(() => !("fonts" in document) || document.fonts.status === "loaded", {
      timeout: 5_000
    })
    .catch(() => undefined);
  const cssOnlyBackgroundChecks = await validateRenderedCssOnlyBackgroundAssets(
    page,
    manifest.cssOnlyBackgroundAssets ?? {}
  );
  await page.getByText("Use image background", { exact: true }).click({ timeout: 15_000 });
  await page.waitForTimeout(250);
  await page
    .waitForFunction(() => !("fonts" in document) || document.fonts.status === "loaded", {
      timeout: 5_000
    })
    .catch(() => undefined);

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
    const fontFaces = [];
    const imageUrls = [];
    const resourceUrls = [];
    const stylesheetUrls = [];
    const svgImageUrls = [];

    for (const entry of performance.getEntriesByType("resource")) {
      resourceUrls.push(absolute(entry.name));
    }

    for (const link of Array.from(document.querySelectorAll('link[rel~="stylesheet"]'))) {
      const href = link.getAttribute("href");
      if (href) {
        stylesheetUrls.push(absolute(href));
      }
    }

    if ("fonts" in document) {
      for (const font of Array.from(document.fonts)) {
        fontFaces.push({
          display: font.display,
          family: font.family,
          status: font.status,
          style: font.style,
          weight: font.weight
        });
      }
    }

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
      fontFaces,
      imageUrls,
      pageUrl: location.href,
      resourceUrls,
      stylesheetUrls,
      svgImageUrls
    };
  });

  observed.cdpResponseUrls = [...new Set(cdpResponseUrls)];

  const observedUrls = new Set([
    ...observed.cssBackgrounds.flatMap((background) => background.urls),
    ...observed.cdpResponseUrls,
    ...observed.imageUrls.map((image) => image.src),
    ...observed.resourceUrls,
    ...observed.stylesheetUrls,
    ...observed.svgImageUrls.map((image) => image.href)
  ]);
  const renderedFontAssetChecks = await Promise.all(
    Object.entries(manifest.fontAssets ?? {}).map(([name, asset]) =>
      validateRenderedFontAsset({ asset, name: `fontAssets.${name}`, observed })
    )
  );
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
  const fontFailures = renderedFontAssetChecks.filter((check) => check.errors.length > 0);
  const cssOnlyBackgroundFailures = cssOnlyBackgroundChecks.filter(
    (check) => check.errors.length > 0
  );

  fs.mkdirSync(artifactDir, { recursive: true });
  fs.writeFileSync(
    path.join(artifactDir, "observed-kube-demo-assets.json"),
    JSON.stringify(
      {
        expected: Object.fromEntries(expectedUrls),
        generatedFallbackAssets,
        cssOnlyBackgroundAssets: cssOnlyBackgroundAssetChecks,
        cssOnlyBackgrounds: cssOnlyBackgroundChecks,
        missing: missing.map(([name, url]) => ({ name, url })),
        localFontAssets: localFontAssetChecks,
        localAssets: localAssetChecks,
        observed,
        observedCssBackgrounds: observedCssBackgroundUrls,
        observedAt: new Date().toISOString(),
        renderedFontAssets: renderedFontAssetChecks,
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

  if (fontFailures.length > 0) {
    throw new Error(
      `Kube demo font asset verification failed:\n${fontFailures
        .map((failure) => `- ${failure.name}: ${failure.errors.join(", ")}`)
        .join("\n")}`
    );
  }

  if (cssOnlyBackgroundFailures.length > 0) {
    throw new Error(
      `Kube CSS-only background verification failed:\n${cssOnlyBackgroundFailures
        .map((failure) => `- ${failure.name}: ${failure.errors.join(", ")}`)
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
    `Verified ${expectedUrls.size} Kube demo asset URLs from the rendered public page, ${localAssetChecks.length} local raster fixture locks, ${cssOnlyBackgroundAssetChecks.length} CSS-only background captures, and ${localFontAssetChecks.length} local font fixture locks.`
  );
} finally {
  await cdpSession.detach().catch(() => undefined);
  await browser.close();
}

async function gotoTargetReference(page) {
  let lastError;

  for (let attempt = 1; attempt <= targetNavigationRetries; attempt += 1) {
    try {
      await page.goto(targetUrl, {
        timeout: targetNavigationTimeoutMs,
        waitUntil: "domcontentloaded"
      });
      return;
    } catch (error) {
      lastError = error;

      if (attempt >= targetNavigationRetries) {
        break;
      }

      console.warn(
        `Kube asset verifier navigation failed on attempt ${attempt}; retrying before asset sampling.`
      );
      await page.waitForTimeout(1_000 * attempt);
    }
  }

  throw lastError;
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

async function validateRenderedFontAsset({ asset, name, observed }) {
  const stylesheetUrl = "https://rsms.me/inter/inter.css";
  const errors = [];
  const cssSourceTail = new URL(asset.sourceUrl).href.replace("https://rsms.me/inter/", "");
  const fontCss = await readRemoteText(stylesheetUrl).catch((error) => {
    errors.push(error instanceof Error ? error.message : String(error));
    return "";
  });

  if (!observed.stylesheetUrls.includes(stylesheetUrl)) {
    errors.push(`${stylesheetUrl} was not loaded by the rendered Kube page`);
  }

  if (!fontCss.includes(cssSourceTail)) {
    errors.push(`${stylesheetUrl} does not reference ${cssSourceTail}`);
  }

  if (
    !observed.fontFaces.some(
      (font) =>
        font.family === "InterVariable" &&
        font.style === "normal" &&
        font.weight === "100 900" &&
        font.status === "loaded"
    )
  ) {
    errors.push("InterVariable normal 100 900 font face was not loaded");
  }

  return {
    errors,
    name,
    sourceUrl: asset.sourceUrl,
    stylesheetUrl
  };
}

async function validateRenderedCssOnlyBackgroundAssets(page, assets) {
  const checks = [];

  for (const [name, asset] of Object.entries(assets)) {
    const targetIds = Array.isArray(asset.targetIds) ? asset.targetIds : [];
    const errors = [];
    const samples = [];

    if (targetIds.length === 0) {
      errors.push("missing targetIds");
    }

    for (const targetId of targetIds) {
      const sample = await readTargetCssOnlyDemoBackground(page, targetId);
      samples.push(sample);

      if (sample.backgroundImage.includes("url(")) {
        errors.push(`${targetId} background unexpectedly uses url(): ${sample.backgroundImage}`);
      }

      for (const needle of asset.backgroundIncludes ?? []) {
        if (!sample.backgroundImage.includes(needle)) {
          errors.push(`${targetId} background is missing ${needle}`);
        }
      }

      if (sample.backgroundPosition !== asset.backgroundPosition) {
        errors.push(
          `${targetId} backgroundPosition ${sample.backgroundPosition} !== ${asset.backgroundPosition}`
        );
      }

      if (sample.backgroundSize !== asset.backgroundSize) {
        errors.push(
          `${targetId} backgroundSize ${sample.backgroundSize} !== ${asset.backgroundSize}`
        );
      }

      if (Math.abs(sample.rect.width - asset.width) > 1) {
        errors.push(`${targetId} width ${sample.rect.width} !== ${asset.width}`);
      }

      if (Math.abs(sample.rect.height - asset.height) > 2) {
        errors.push(`${targetId} height ${sample.rect.height} differs from ${asset.height}`);
      }

      const capture = await captureTargetCssOnlyDemoBackground(page, targetId, name, asset);
      sample.capture = {
        ...capture,
        shaMatchesFixture: capture.sha256 === asset.sha256
      };

      if (capture.width !== asset.width || capture.height !== asset.height) {
        errors.push(
          `${targetId} capture dimensions ${capture.width}x${capture.height} !== ${asset.width}x${asset.height}`
        );
      }
    }

    checks.push({
      errors,
      file: asset.file,
      name,
      samples,
      sourceUrl: asset.sourceUrl
    });
  }

  return checks;
}

async function captureTargetCssOnlyDemoBackground(page, targetId, assetName, asset) {
  const captureId = `lg-kube-css-bg-${assetName}-${targetId}`;
  const captureDir = path.join(artifactDir, "css-only-backgrounds");
  const capturePath = path.join(captureDir, `${assetName}-${targetId}.png`);
  const fixturePath = path.join(root, "stories/assets/kube", asset.file);

  fs.mkdirSync(captureDir, { recursive: true });

  const selector = await page.evaluate(
    ({ captureId, targetId }) => {
      const heading = document.getElementById(targetId);
      if (!heading) {
        throw new Error(`Missing target heading: ${targetId}`);
      }

      let current = heading.nextElementSibling;
      while (current) {
        const rect = current.getBoundingClientRect();
        const style = getComputedStyle(current);
        const isDemo =
          rect.width >= 650 &&
          rect.width <= 730 &&
          rect.height >= 300 &&
          rect.height <= 500 &&
          style.position === "relative";

        if (isDemo) {
          const styleElement = document.createElement("style");
          styleElement.id = `${captureId}-style`;
          styleElement.textContent = `[data-lg-kube-css-background-capture="${captureId}"] > * { visibility: hidden !important; }`;
          document.head.append(styleElement);
          current.setAttribute("data-lg-kube-css-background-capture", captureId);
          return `[data-lg-kube-css-background-capture="${captureId}"]`;
        }

        current = current.nextElementSibling;
      }

      throw new Error(`Missing target demo after heading: ${targetId}`);
    },
    { captureId, targetId }
  );

  try {
    await page.locator(selector).screenshot({ animations: "disabled", path: capturePath });
  } finally {
    await page.evaluate((captureId) => {
      document.getElementById(`${captureId}-style`)?.remove();
      document
        .querySelector(`[data-lg-kube-css-background-capture="${captureId}"]`)
        ?.removeAttribute("data-lg-kube-css-background-capture");
    }, captureId);
  }

  const bytes = fs.readFileSync(capturePath);
  const dimensions = readRasterSize(bytes);
  const comparison = await compareRasterFilesInBrowser(
    page,
    fixturePath,
    capturePath,
    asset.pixelDeltaThreshold ?? 4
  );

  return {
    artifact: path.relative(root, capturePath),
    comparison,
    height: dimensions.height,
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
    width: dimensions.width
  };
}

async function compareRasterFilesInBrowser(page, expectedPath, actualPath, pixelDeltaThreshold) {
  const [expectedBytes, actualBytes] = [fs.readFileSync(expectedPath), fs.readFileSync(actualPath)];

  return page.evaluate(
    async ({ actualDataUrl, expectedDataUrl, pixelDeltaThreshold }) => {
      const loadBitmap = async (dataUrl) => {
        const response = await fetch(dataUrl);
        return createImageBitmap(await response.blob());
      };
      const [expected, actual] = await Promise.all([
        loadBitmap(expectedDataUrl),
        loadBitmap(actualDataUrl)
      ]);

      if (expected.width !== actual.width || expected.height !== actual.height) {
        return {
          differingPixels: expected.width * expected.height,
          diffRatio: 1,
          height: actual.height,
          pixelDeltaThreshold,
          width: actual.width
        };
      }

      const canvas = document.createElement("canvas");
      canvas.width = expected.width;
      canvas.height = expected.height;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.drawImage(expected, 0, 0);
      const expectedPixels = context.getImageData(0, 0, expected.width, expected.height).data;
      context.clearRect(0, 0, expected.width, expected.height);
      context.drawImage(actual, 0, 0);
      const actualPixels = context.getImageData(0, 0, actual.width, actual.height).data;
      let differingPixels = 0;

      for (let index = 0; index < expectedPixels.length; index += 4) {
        const delta = Math.max(
          Math.abs(expectedPixels[index] - actualPixels[index]),
          Math.abs(expectedPixels[index + 1] - actualPixels[index + 1]),
          Math.abs(expectedPixels[index + 2] - actualPixels[index + 2]),
          Math.abs(expectedPixels[index + 3] - actualPixels[index + 3])
        );

        if (delta > pixelDeltaThreshold) {
          differingPixels += 1;
        }
      }

      return {
        differingPixels,
        diffRatio: differingPixels / (expected.width * expected.height),
        height: actual.height,
        pixelDeltaThreshold,
        width: actual.width
      };
    },
    {
      actualDataUrl: `data:image/png;base64,${actualBytes.toString("base64")}`,
      expectedDataUrl: `data:image/png;base64,${expectedBytes.toString("base64")}`,
      pixelDeltaThreshold
    }
  );
}

async function readTargetCssOnlyDemoBackground(page, targetId) {
  await page.locator(`#${targetId}`).scrollIntoViewIfNeeded();
  await page.waitForTimeout(120);

  return page.evaluate((sectionId) => {
    const heading = document.getElementById(sectionId);
    if (!heading) {
      throw new Error(`Missing target heading: ${sectionId}`);
    }

    let current = heading.nextElementSibling;
    while (current) {
      const rect = current.getBoundingClientRect();
      const style = getComputedStyle(current);
      const isDemo =
        rect.width >= 650 &&
        rect.width <= 730 &&
        rect.height >= 300 &&
        rect.height <= 500 &&
        style.position === "relative";

      if (isDemo) {
        return {
          backgroundImage: style.backgroundImage,
          backgroundPosition: style.backgroundPosition,
          backgroundSize: style.backgroundSize,
          rect: {
            height: Math.round(rect.height),
            width: Math.round(rect.width)
          }
        };
      }

      current = current.nextElementSibling;
    }

    throw new Error(`Missing target demo after heading: ${sectionId}`);
  }, targetId);
}

async function readRemoteText(url) {
  if (remoteTextCache.has(url)) {
    return remoteTextCache.get(url);
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${url} returned HTTP ${response.status}`);
  }

  const text = await response.text();
  remoteTextCache.set(url, text);
  return text;
}

function validateLocalFontAsset({ asset, name }) {
  const localPath = path.join(root, "stories/assets/kube", asset.file);
  const bytes = fs.readFileSync(localPath);
  const sha256 = crypto.createHash("sha256").update(bytes).digest("hex");
  const errors = [];

  if (sha256 !== asset.sha256) {
    errors.push(`sha256 ${sha256} !== ${asset.sha256}`);
  }

  if (bytes.length !== asset.bytes) {
    errors.push(`bytes ${bytes.length} !== ${asset.bytes}`);
  }

  if (errors.length > 0) {
    throw new Error(
      `Kube local font asset verification failed for ${name} (${asset.file}): ${errors.join(", ")}`
    );
  }

  return {
    bytes: bytes.length,
    file: asset.file,
    name,
    sha256,
    sourceUrl: asset.sourceUrl
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
