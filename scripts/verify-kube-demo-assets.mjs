import fs from "node:fs";
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

const missingManifestEntries = [...expectedUrls]
  .filter(([, url]) => typeof url !== "string" || url.length === 0)
  .map(([name]) => name);

if (missingManifestEntries.length > 0) {
  throw new Error(
    `Kube asset manifest is missing source URLs for ${missingManifestEntries.join(", ")}`
  );
}

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

    for (const image of Array.from(document.querySelectorAll("svg image, image"))) {
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

  const missing = [...expectedUrls].filter(([, url]) => !observedUrls.has(url));

  fs.mkdirSync(artifactDir, { recursive: true });
  fs.writeFileSync(
    path.join(artifactDir, "observed-kube-demo-assets.json"),
    JSON.stringify(
      {
        expected: Object.fromEntries(expectedUrls),
        missing: missing.map(([name, url]) => ({ name, url })),
        observed,
        observedAt: new Date().toISOString(),
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

  console.log(`Verified ${expectedUrls.size} Kube demo asset URLs from the rendered public page.`);
} finally {
  await browser.close();
}
