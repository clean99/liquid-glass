import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { chromium } from "playwright";

/* global FileReader, HTMLInputElement, OffscreenCanvas, createImageBitmap, document, getComputedStyle, window */

process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY = "1";

const staticDir = path.resolve(process.env.STORYBOOK_STATIC_DIR ?? "storybook-static-test");
const artifactDir = path.resolve("test-results/kube-reference");
const targetUrl = "https://kube.io/blog/liquid-glass-css-svg/";
const targetNavigationRetries = Number(process.env.KUBE_NAVIGATION_RETRIES ?? 3);
const targetNavigationTimeoutMs = Number(process.env.KUBE_NAVIGATION_TIMEOUT_MS ?? 60_000);
const globalMaxDiffRatio = process.env.KUBE_MAX_DIFF_RATIO
  ? Number(process.env.KUBE_MAX_DIFF_RATIO)
  : undefined;
const exactPixelParity = process.env.KUBE_EXACT_PARITY === "1" || globalMaxDiffRatio === 0;
const pixelDeltaThreshold = process.env.KUBE_PIXEL_DELTA_THRESHOLD
  ? Number(process.env.KUBE_PIXEL_DELTA_THRESHOLD)
  : exactPixelParity
    ? 0
    : 24;
const phaseMaxOffset = Number(process.env.KUBE_PHASE_MAX_OFFSET ?? 12);
const phaseSampleStride = Number(process.env.KUBE_PHASE_SAMPLE_STRIDE ?? 2);
const strictInteractivePixels = process.env.KUBE_STRICT_INTERACTIVE === "1";
const pointerActionScrollSlackId = "lg-kube-pointer-action-scroll-slack";

if (!Number.isFinite(pixelDeltaThreshold) || pixelDeltaThreshold < 0) {
  throw new Error(`Invalid KUBE_PIXEL_DELTA_THRESHOLD: ${process.env.KUBE_PIXEL_DELTA_THRESHOLD}`);
}

if (!Number.isInteger(phaseMaxOffset) || phaseMaxOffset < 0) {
  throw new Error(`Invalid KUBE_PHASE_MAX_OFFSET: ${process.env.KUBE_PHASE_MAX_OFFSET}`);
}

if (!Number.isInteger(phaseSampleStride) || phaseSampleStride < 1) {
  throw new Error(`Invalid KUBE_PHASE_SAMPLE_STRIDE: ${process.env.KUBE_PHASE_SAMPLE_STRIDE}`);
}

const references = [
  {
    name: "magnifying-glass",
    storyId: "liquid-glass-liquidlens--kube-reference",
    targetId: "magnifying-glass",
    compareRegion: { x: 14, y: 26, width: 216, height: 128 },
    maxDiffRatio: 0.24
  },
  {
    name: "magnifying-glass-pressed",
    storyId: "liquid-glass-liquidlens--draggable-precision-lens",
    targetId: "magnifying-glass",
    candidateFrame: "magnifying-glass-interactive",
    action: {
      kind: "press",
      point: { x: 0.42, y: 0.54 },
      pressMs: 220
    },
    capture: "handle",
    metricTolerances: {
      deltaX: 4,
      deltaY: 4,
      heightDelta: 7,
      widthDelta: 7
    },
    maxDiffRatio: 0.405,
    reportOnly: false
  },
  {
    name: "magnifying-glass-dragged",
    storyId: "liquid-glass-liquidlens--draggable-precision-lens",
    targetId: "magnifying-glass",
    candidateFrame: "magnifying-glass-interactive",
    action: {
      delta: { x: 132, y: 76 },
      kind: "drag",
      point: { x: 0.42, y: 0.54 },
      pressMs: 180,
      settleMs: 160
    },
    capture: "handle",
    metricTolerances: {
      deltaX: 8,
      deltaY: 8,
      heightDelta: 8,
      widthDelta: 10
    },
    maxDiffRatio: 0.455,
    reportOnly: false
  },
  {
    name: "searchbox",
    storyId: "liquid-glass-liquidsearchbox--kube-reference",
    targetId: "searchbox",
    maxDiffRatio: 0.02
  },
  {
    name: "searchbox-image-background",
    storyId: "liquid-glass-liquidsearchbox--kube-reference",
    targetId: "searchbox",
    candidateFrame: "searchbox",
    controlContract: "searchbox",
    action: {
      backgroundIncludes: ["photo-1497250681960-ef046c08a56e", "searchbox-demo-background.jpg"],
      checked: true,
      kind: "checkbox",
      selector: 'input[type="checkbox"]',
      settleMs: 300
    },
    maxDiffRatio: 0.13
  },
  {
    name: "switch",
    storyId: "liquid-glass-liquidswitch--kube-reference",
    targetId: "switch",
    maxDiffRatio: 0.02
  },
  {
    name: "slider",
    storyId: "liquid-glass-liquidslider--kube-reference",
    targetId: "slider",
    maxDiffRatio: 0.02
  }
];

await fs.mkdir(artifactDir, { recursive: true });

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
  const pathname = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;
  const filePath = path.join(staticDir, pathname);

  if (!filePath.startsWith(staticDir)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const body = await fs.readFile(filePath);
    response.writeHead(200, { "content-type": contentType(filePath) });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

const address = server.address();
const port = typeof address === "object" && address ? address.port : 0;
const browser = await chromium.launch({ headless: true });
const results = [];
let githubFailureAnnotated = false;
let runError = null;

try {
  const referencePage = await browser.newPage({ viewport: { width: 1100, height: 760 } });
  await gotoTargetReference(referencePage);
  await referencePage.waitForLoadState("load", { timeout: 20_000 }).catch(() => undefined);

  for (const reference of references) {
    let candidatePage = null;

    try {
      await referencePage.mouse.move(0, 0).catch(() => undefined);
      const targetElement = await findTargetDemo(referencePage, reference.targetId);
      const targetPath = path.join(artifactDir, `${reference.name}-target.png`);
      const targetAction = reference.action
        ? await applyTargetAction(referencePage, targetElement, reference.action)
        : null;
      const targetControlContract = reference.controlContract
        ? await readControlContract(targetElement, "kube", reference.controlContract)
        : null;
      const targetScreenshotSubject =
        reference.capture === "handle" ? (targetAction?.subject ?? targetElement) : targetElement;
      await captureReferenceScreenshot(
        referencePage,
        targetScreenshotSubject,
        targetAction,
        reference.capture,
        targetPath
      );
      await targetAction?.cleanup();

      candidatePage = await browser.newPage({ viewport: { width: 900, height: 560 } });
      await candidatePage.goto(
        `http://127.0.0.1:${port}/iframe.html?id=${reference.storyId}&viewMode=story`,
        { waitUntil: "networkidle", timeout: 20_000 }
      );
      await candidatePage.mouse.move(0, 0).catch(() => undefined);

      const candidateElement = candidatePage.locator(
        `[data-lg-reference-frame="${reference.candidateFrame ?? reference.name}"]`
      );
      await candidateElement.waitFor({ state: "visible", timeout: 10_000 });
      if (reference.targetId === "magnifying-glass") {
        await waitForFilterContract(candidateElement, 2);
      }

      const candidatePath = path.join(artifactDir, `${reference.name}-candidate.png`);
      const candidateAction = reference.action
        ? await applyCandidateAction(candidatePage, candidateElement, reference.action)
        : null;
      const candidateControlContract = reference.controlContract
        ? await readControlContract(candidateElement, "local", reference.controlContract)
        : null;
      const candidateScreenshotSubject =
        reference.capture === "handle"
          ? (candidateAction?.subject ?? candidateElement)
          : candidateElement;
      await captureReferenceScreenshot(
        candidatePage,
        candidateScreenshotSubject,
        candidateAction,
        reference.capture,
        candidatePath
      );
      if (targetControlContract && candidateControlContract) {
        await fs.writeFile(
          path.join(artifactDir, `${reference.name}-control-contract.json`),
          `${JSON.stringify(
            {
              summary: summarizeControlContract(targetControlContract, candidateControlContract),
              target: targetControlContract,
              candidate: candidateControlContract
            },
            null,
            2
          )}\n`
        );
      }
      await candidateAction?.cleanup();

      if (reference.targetId === "magnifying-glass") {
        const [targetContract, candidateContract] = await Promise.all([
          readFilterContract(targetElement, "kube"),
          readFilterContract(candidateElement, "local")
        ]);
        const filterSummary = summarizeFilterContract(targetContract, candidateContract);
        await fs.writeFile(
          path.join(artifactDir, `${reference.name}-filter-contract.json`),
          `${JSON.stringify(
            {
              summary: filterSummary,
              target: targetContract,
              candidate: candidateContract
            },
            null,
            2
          )}\n`
        );
        assertFilterContractParity(reference, filterSummary);
      }

      const diffPath = path.join(artifactDir, `${reference.name}-diff.png`);
      const diff = await compareImagesInBrowser(
        browser,
        targetPath,
        candidatePath,
        reference.compareRegion,
        diffPath,
        pixelDeltaThreshold,
        phaseMaxOffset,
        phaseSampleStride
      );
      assertActionMetricParity(reference, targetAction?.metrics, candidateAction?.metrics);
      const reportOnly = Boolean(reference.reportOnly) && !strictInteractivePixels;

      results.push({
        ...reference,
        ...diff,
        candidateActionClip: candidateAction?.clip,
        candidateActionMetrics: candidateAction?.metrics,
        diffArtifact: path.relative(process.cwd(), diffPath),
        gateDiffRatio: exactPixelParity
          ? diff.diffRatio
          : Math.min(diff.diffRatio, diff.bestPhaseOffset.diffRatio),
        pixelDeltaThreshold,
        maxDiffRatio: globalMaxDiffRatio ?? reference.maxDiffRatio,
        exactPixelParity,
        reportOnly,
        strictInteractivePixels,
        targetActionClip: targetAction?.clip,
        targetActionMetrics: targetAction?.metrics
      });
    } catch (error) {
      emitGithubError("Kube reference capture failed", `${reference.name}: ${formatError(error)}`);
      throw error;
    } finally {
      await candidatePage?.close().catch(() => undefined);
    }
  }
} catch (error) {
  runError = error;
  if (!githubFailureAnnotated) {
    emitGithubError("Kube reference run failed", formatError(error));
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

await fs.writeFile(
  path.join(artifactDir, "kube-reference-results.json"),
  `${JSON.stringify(results, null, 2)}\n`
);

if (runError) {
  await writeGithubStepSummary(results, [], runError);
  throw runError;
}

const failures = results.filter(
  (result) => !result.reportOnly && result.gateDiffRatio > result.maxDiffRatio
);
if (failures.length > 0 && process.env.GITHUB_ACTIONS === "true") {
  emitGithubError(
    "Kube reference parity failed",
    failures
      .map(
        (failure) => `${failure.name} ${failure.gateDiffRatio.toFixed(4)} > ${failure.maxDiffRatio}`
      )
      .join(", ")
  );
}
console.table(
  results.map((result) => ({
    name: result.name,
    target: `${result.targetImageSize.width}x${result.targetImageSize.height}`,
    candidate: `${result.candidateImageSize.width}x${result.candidateImageSize.height}`,
    width: result.width,
    height: result.height,
    diffRatio: result.diffRatio.toFixed(4),
    gateDiffRatio: result.gateDiffRatio.toFixed(4),
    meanDelta: result.meanDelta.toFixed(2),
    phase: `${result.bestPhaseOffset.candidateDx},${result.bestPhaseOffset.candidateDy}`,
    phaseDiffRatio: result.bestPhaseOffset.diffRatio.toFixed(4),
    rmsDelta: result.rmsDelta.toFixed(2),
    maxDiffRatio: result.maxDiffRatio,
    pixelDeltaThreshold: result.pixelDeltaThreshold,
    mode: result.reportOnly ? "report" : "gate"
  }))
);
await writeGithubStepSummary(results, failures);

if (failures.length > 0) {
  throw new Error(
    `Kube reference diff exceeded threshold for: ${failures
      .map((failure) => `${failure.name} (${failure.gateDiffRatio.toFixed(4)})`)
      .join(", ")}`
  );
}

function emitGithubError(title, message) {
  githubFailureAnnotated = true;

  if (process.env.GITHUB_ACTIONS === "true") {
    console.error(`::error title=${title}::${message}`);
  }
}

function formatError(error) {
  return error instanceof Error ? error.message : String(error);
}

async function writeGithubStepSummary(results, failures, error) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;

  if (!summaryPath) {
    return;
  }

  const status = error
    ? `Run failed before all references completed: ${formatError(error)}`
    : failures.length > 0
      ? `Failed rows: ${failures.map((failure) => failure.name).join(", ")}`
      : "All gated rows passed.";
  const rows =
    results.length > 0
      ? results.map(
          (result) =>
            `| ${result.name} | ${result.gateDiffRatio.toFixed(4)} | ${result.diffRatio.toFixed(
              4
            )} | ${result.maxDiffRatio} | ${result.reportOnly ? "report" : "gate"} |`
        )
      : ["| _none completed_ | n/a | n/a | n/a | n/a |"];

  await fs.appendFile(
    summaryPath,
    [
      "## Kube Reference Parity",
      "",
      status,
      "",
      "| Reference | Gate diff ratio | Raw diff ratio | Threshold | Mode |",
      "| --- | ---: | ---: | ---: | --- |",
      ...rows,
      ""
    ].join("\n")
  );
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
        `Kube reference navigation failed on attempt ${attempt}; retrying before visual comparison.`
      );
      await page.waitForTimeout(1_000 * attempt);
    }
  }

  throw lastError;
}

async function findTargetDemo(page, id) {
  await page.locator(`#${id}`).scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  const handle = await page.evaluateHandle((sectionId) => {
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
        return current;
      }

      current = current.nextElementSibling;
    }

    throw new Error(`Missing target demo after heading: ${sectionId}`);
  }, id);

  return handle.asElement();
}

async function waitForFilterContract(locator, minDisplacementMaps) {
  const deadline = Date.now() + 5_000;
  let lastCount = 0;

  while (Date.now() < deadline) {
    lastCount = await locator.evaluate((root) => {
      const surface = findFilterSurface(root);
      const value = surface
        ? getComputedStyle(surface).backdropFilter || getComputedStyle(surface).webkitBackdropFilter
        : "";
      const filterId = extractFilterId(value);
      const filter = filterId ? document.getElementById(filterId) : null;

      return filter?.querySelectorAll("feDisplacementMap").length ?? 0;

      function findFilterSurface(base) {
        const candidates = [base, ...base.querySelectorAll("*")];
        return (
          candidates.find((candidate) => {
            const style = getComputedStyle(candidate);
            const filterValue = style.backdropFilter || style.webkitBackdropFilter;
            return filterValue && filterValue !== "none" && filterValue.includes("url(");
          }) ?? null
        );
      }

      function extractFilterId(value) {
        const match = value?.match(/url\((?:"|')?#?([^"')]+)(?:"|')?\)/);
        return match?.[1] ?? null;
      }
    });

    if (lastCount >= minDisplacementMaps) {
      return;
    }

    await delay(100);
  }

  throw new Error(
    `Timed out waiting for two-pass lens filter: expected at least ${minDisplacementMaps} feDisplacementMap nodes, got ${lastCount}`
  );
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function applyTargetAction(page, targetElement, action) {
  if (action.kind === "checkbox") {
    return applyCheckboxAction(page, targetElement, action);
  }

  const handle = await findTargetDragHandle(targetElement);

  return applyPointerAction(page, handle, action);
}

async function applyCandidateAction(page, candidateElement, action) {
  if (action.kind === "checkbox") {
    return applyCheckboxAction(page, candidateElement, action);
  }

  const handle = candidateElement.locator("[data-lg-draggable-lens]").first();
  await handle.waitFor({ state: "visible", timeout: 10_000 });

  return applyPointerAction(page, handle, action);
}

async function applyCheckboxAction(page, root, action) {
  const selector = action.selector ?? 'input[type="checkbox"]';
  let sample = await readCheckboxActionSample(root, selector);

  if (sample.checked !== action.checked) {
    await page.mouse.click(
      sample.box.x + sample.box.width / 2,
      sample.box.y + sample.box.height / 2
    );
    await page.waitForTimeout(action.settleMs ?? 180);
    sample = await waitForCheckboxActionEffect(root, selector, action);
  }

  if (sample.checked !== action.checked) {
    throw new Error(
      `Checkbox action failed for ${selector}: expected checked=${action.checked}, got ${sample.checked}`
    );
  }

  return {
    cleanup: async () => undefined,
    metrics: { checked: sample.checked ? 1 : 0 },
    subject: root
  };
}

async function waitForCheckboxActionEffect(root, selector, action) {
  const deadline = Date.now() + (action.effectTimeoutMs ?? 2_000);
  let sample = await readCheckboxActionSample(root, selector);

  while (Date.now() < deadline) {
    if (
      sample.checked === action.checked &&
      (!action.backgroundIncludes ||
        action.backgroundIncludes.some((needle) => sample.rootBackgroundImage.includes(needle)))
    ) {
      return sample;
    }

    await delay(50);
    sample = await readCheckboxActionSample(root, selector);
  }

  return sample;
}

async function readCheckboxActionSample(root, selector) {
  return root.evaluate((base, checkboxSelector) => {
    const input = base.querySelector(checkboxSelector);

    if (!(input instanceof HTMLInputElement)) {
      throw new Error(`Missing checkbox action target: ${checkboxSelector}`);
    }

    input.scrollIntoView({ behavior: "instant", block: "center", inline: "center" });

    const rect = input.getBoundingClientRect();
    const rootStyle = getComputedStyle(base);

    return {
      box: {
        height: rect.height,
        width: rect.width,
        x: rect.x,
        y: rect.y
      },
      checked: input.checked,
      rootBackgroundImage: rootStyle.backgroundImage
    };
  }, selector);
}

async function findTargetDragHandle(root) {
  const handle = await root.evaluateHandle((base) => {
    const candidates = [base, ...base.querySelectorAll("*")];

    return (
      candidates.find((candidate) => {
        const rect = candidate.getBoundingClientRect();
        const style = getComputedStyle(candidate);

        return (
          rect.width >= 180 &&
          rect.height >= 90 &&
          style.cursor.includes("grab") &&
          style.pointerEvents !== "none"
        );
      }) ?? null
    );
  });
  const element = handle.asElement();

  if (!element) {
    throw new Error("Missing draggable lens handle in Kube reference demo");
  }

  return element;
}

async function applyPointerAction(page, handle, action) {
  const attempts = action.attempts ?? 3;
  let addedScrollSlack = false;
  let lastMetrics = null;
  let lastRejection = null;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    await page.mouse.up().catch(() => undefined);
    await handle
      .evaluate((node) => node.scrollIntoView({ block: "center", inline: "center" }))
      .catch(() => undefined);
    await page.waitForTimeout(120);

    let before = await readPointerActionSample(page, handle);
    if (await scrollActionPointIntoViewport(page, before, action)) {
      await page.waitForTimeout(120);
      before = await readPointerActionSample(page, handle);
    }

    if (!isActionPointInViewport(before, action)) {
      addedScrollSlack =
        (await addPointerActionScrollSlack(page, before, action)) || addedScrollSlack;

      if (addedScrollSlack && (await scrollActionPointIntoViewport(page, before, action))) {
        await page.waitForTimeout(120);
        before = await readPointerActionSample(page, handle);
      }
    }

    const box = before.box;

    if (!isActionPointInViewport(before, action)) {
      lastRejection = `${action.kind} action point is outside the viewport after scrolling: ${JSON.stringify(
        before
      )}`;
      await page.waitForTimeout(220 * attempt);
      continue;
    }

    const startX = box.x + box.width * action.point.x;
    const startY = box.y + box.height * action.point.y;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.waitForTimeout(action.pressMs ?? 180);

    if (action.kind === "drag") {
      await page.mouse.move(startX + action.delta.x, startY + action.delta.y, { steps: 8 });
      await page.waitForTimeout(action.settleMs ?? 120);
    }

    const after = await waitForPointerActionEffect(page, handle, before, action);
    const metrics = summarizeActionMetrics(before, after, action);
    lastMetrics = metrics;
    const hasEffect = hasPointerActionEffect(metrics, action);
    const hasPlausibleMetrics = hasPlausiblePointerActionMetrics(metrics, action);

    if (hasEffect && hasPlausibleMetrics) {
      return {
        cleanup: async () => {
          await page.mouse.up().catch(() => undefined);
          await page.mouse.move(0, 0).catch(() => undefined);
          if (addedScrollSlack) {
            await removePointerActionScrollSlack(page);
          }
          await page.waitForTimeout(160);
        },
        clip: screenshotClipFromBox(after.box),
        metrics,
        subject: handle
      };
    }

    if (hasEffect && !hasPlausibleMetrics) {
      lastRejection = describeImplausiblePointerAction(action, metrics);
    }

    await page.mouse.up().catch(() => undefined);
    await page.mouse.move(0, 0).catch(() => undefined);
    await page.waitForTimeout(220 * attempt);
  }

  if (addedScrollSlack) {
    await removePointerActionScrollSlack(page);
  }

  throw new Error(lastRejection ?? describePointerActionFailure(action, lastMetrics));
}

async function scrollActionPointIntoViewport(page, sample, action) {
  const margin = 48;
  const bounds = actionPathBounds(sample, action);
  const scrollX =
    bounds.minX < margin
      ? bounds.minX - margin
      : bounds.maxX > sample.viewport.width - margin
        ? bounds.maxX - (sample.viewport.width - margin)
        : 0;
  const scrollY =
    bounds.minY < margin
      ? bounds.minY - margin
      : bounds.maxY > sample.viewport.height - margin
        ? bounds.maxY - (sample.viewport.height - margin)
        : 0;

  if (scrollX === 0 && scrollY === 0) {
    return false;
  }

  await page.evaluate(
    ({ left, top }) => {
      window.scrollBy({ behavior: "instant", left, top });
    },
    { left: scrollX, top: scrollY }
  );
  return true;
}

async function addPointerActionScrollSlack(page, sample, action) {
  const bounds = actionPathBounds(sample, action);
  const verticalOverflow = Math.max(0, bounds.maxY - sample.viewport.height, -bounds.minY);
  const horizontalOverflow = Math.max(0, bounds.maxX - sample.viewport.width, -bounds.minX);

  if (verticalOverflow === 0 && horizontalOverflow === 0) {
    return false;
  }

  const height = Math.ceil(Math.max(160, verticalOverflow + Math.abs(action.delta?.y ?? 0) + 96));

  await page.evaluate(
    ({ height, id }) => {
      let spacer = document.getElementById(id);

      if (!spacer) {
        spacer = document.createElement("div");
        spacer.id = id;
        spacer.setAttribute("aria-hidden", "true");
        spacer.setAttribute("data-lg-transient", "pointer-action-scroll-slack");
        document.body.append(spacer);
      }

      Object.assign(spacer.style, {
        flex: "0 0 auto",
        height: `${height}px`,
        pointerEvents: "none",
        width: "1px"
      });
    },
    { height, id: pointerActionScrollSlackId }
  );

  return true;
}

async function removePointerActionScrollSlack(page) {
  await page
    .evaluate((id) => {
      document.getElementById(id)?.remove();
    }, pointerActionScrollSlackId)
    .catch(() => undefined);
}

async function captureReferenceScreenshot(page, subject, action, captureMode, screenshotPath) {
  if (captureMode === "handle" && action?.clip) {
    await page.screenshot({ clip: action.clip, path: screenshotPath });
    return;
  }

  await subject.screenshot({ path: screenshotPath });
}

function screenshotClipFromBox(box) {
  return {
    height: Math.ceil(box.height),
    width: Math.ceil(box.width),
    x: Math.floor(box.x),
    y: Math.floor(box.y)
  };
}

async function waitForPointerActionEffect(page, handle, before, action) {
  const deadline = Date.now() + (action.effectTimeoutMs ?? 1_000);
  let lastSample = await readPointerActionSample(page, handle);

  while (Date.now() < deadline) {
    const metrics = summarizeActionMetrics(before, lastSample, action);

    if (
      hasPointerActionEffect(metrics, action) &&
      hasPlausiblePointerActionMetrics(metrics, action)
    ) {
      return lastSample;
    }

    await delay(50);
    lastSample = await readPointerActionSample(page, handle);
  }

  return lastSample;
}

async function readPointerActionSample(page, handle) {
  const box = await handle.boundingBox();

  if (!box) {
    throw new Error("Missing pointer action bounding box");
  }

  const viewport = await page.evaluate(() => ({
    height: window.innerHeight,
    scrollX: window.scrollX,
    scrollY: window.scrollY,
    width: window.innerWidth
  }));

  return {
    box,
    documentBox: {
      height: box.height,
      width: box.width,
      x: box.x + viewport.scrollX,
      y: box.y + viewport.scrollY
    },
    viewport
  };
}

function isActionPointInViewport(sample, action) {
  const bounds = actionPathBounds(sample, action);

  return (
    bounds.minX >= 0 &&
    bounds.minY >= 0 &&
    bounds.maxX <= sample.viewport.width &&
    bounds.maxY <= sample.viewport.height
  );
}

function actionPathBounds(sample, action) {
  const startX = sample.box.x + sample.box.width * action.point.x;
  const startY = sample.box.y + sample.box.height * action.point.y;
  const endX = startX + (action.delta?.x ?? 0);
  const endY = startY + (action.delta?.y ?? 0);

  return {
    maxX: Math.max(startX, endX),
    maxY: Math.max(startY, endY),
    minX: Math.min(startX, endX),
    minY: Math.min(startY, endY)
  };
}

function summarizeActionMetrics(before, after, action) {
  const beforeBox = before.documentBox;
  const afterBox = after.documentBox;

  return {
    deltaX: round(afterBox.x - beforeBox.x),
    deltaY: round(afterBox.y - beforeBox.y),
    height: round(after.box.height),
    heightDelta: round(after.box.height - before.box.height),
    kind: action.kind,
    width: round(after.box.width),
    widthDelta: round(after.box.width - before.box.width)
  };
}

function hasPointerActionEffect(metrics, action) {
  if (action.kind === "press") {
    const changedSize = Math.abs(metrics.widthDelta) + Math.abs(metrics.heightDelta);

    return changedSize >= 10;
  }

  return (
    Math.abs(metrics.deltaX) >= Math.abs(action.delta.x) * 0.45 &&
    Math.abs(metrics.deltaY) >= Math.abs(action.delta.y) * 0.45
  );
}

function hasPlausiblePointerActionMetrics(metrics, action) {
  if (action.kind !== "drag") {
    return true;
  }

  const maxX = Math.abs(action.delta.x) + Math.max(32, Math.abs(action.delta.x) * 0.35);
  const maxY = Math.abs(action.delta.y) + Math.max(32, Math.abs(action.delta.y) * 0.35);
  const maxWidthDelta = Math.max(24, Math.abs(metrics.heightDelta) * 1.25);
  const minHeightDelta = Math.max(12, Math.abs(action.delta.y) * 0.16);
  const plausibleMovement = Math.abs(metrics.deltaX) <= maxX && Math.abs(metrics.deltaY) <= maxY;
  const plausibleDragShape =
    metrics.heightDelta >= minHeightDelta && Math.abs(metrics.widthDelta) <= maxWidthDelta;

  return plausibleMovement && plausibleDragShape;
}

function describeImplausiblePointerAction(action, metrics) {
  if (action.kind !== "drag") {
    return describePointerActionFailure(action, metrics);
  }

  return `Drag action produced an implausible movement or deformation sample: ${JSON.stringify(metrics)}`;
}

function describePointerActionFailure(action, metrics) {
  if (action.kind === "press") {
    return `Press action did not deform the lens enough: ${JSON.stringify(metrics)}`;
  }

  const minX = Math.abs(action.delta.x) * 0.45;
  const minY = Math.abs(action.delta.y) * 0.45;
  return `Drag action did not move the lens enough: expected at least ${round(
    minX
  )}px x and ${round(minY)}px y, got ${JSON.stringify(metrics)}`;
}

function assertActionMetricParity(reference, targetMetrics, candidateMetrics) {
  const tolerances = reference.metricTolerances;
  if (!tolerances) {
    return;
  }

  if (!targetMetrics || !candidateMetrics) {
    throw new Error(`Missing action metrics for ${reference.name}`);
  }

  const failures = Object.entries(tolerances)
    .map(([metricName, tolerance]) => {
      const targetValue = targetMetrics[metricName];
      const candidateValue = candidateMetrics[metricName];

      if (!Number.isFinite(targetValue) || !Number.isFinite(candidateValue)) {
        return `${metricName}: target=${targetValue}, candidate=${candidateValue}`;
      }

      const delta = Math.abs(candidateValue - targetValue);
      return delta > tolerance
        ? `${metricName}: target=${targetValue}, candidate=${candidateValue}, delta=${round(delta)}, tolerance=${tolerance}`
        : null;
    })
    .filter(Boolean);

  if (failures.length > 0) {
    throw new Error(`Kube action metrics diverged for ${reference.name}: ${failures.join("; ")}`);
  }
}

async function readControlContract(element, label, kind) {
  return element.evaluate(
    (root, options) => {
      const rootRect = root.getBoundingClientRect();
      const searchInput = findSearchInput(root);
      const surface = searchInput ? findSearchSurface(root, searchInput) : null;
      const icon = surface?.querySelector("svg, [class*='icon']") ?? null;
      const credit = findTextElement(root, /photo|teemu|unsplash/i, {
        maxHeight: 90,
        maxWidth: 260,
        maxY: 96
      });
      const labelElement = findTextElement(root, /use image background/i, {
        maxHeight: 60,
        maxWidth: 260,
        minY: rootRect.height - 96
      });
      const rootStyle = getComputedStyle(root);

      return {
        kind: options.kind,
        label: options.label,
        rootRect: toRect(rootRect),
        rootStyle: {
          backgroundImage: truncate(rootStyle.backgroundImage),
          backgroundPosition: rootStyle.backgroundPosition,
          backgroundSize: rootStyle.backgroundSize
        },
        surface: surface ? readElement(surface, rootRect) : null,
        input: searchInput ? readElement(searchInput, rootRect) : null,
        icon: icon ? readElement(icon, rootRect) : null,
        credit: credit ? readElement(credit, rootRect) : null,
        imageBackgroundLabel: labelElement ? readElement(labelElement, rootRect) : null
      };

      function findSearchInput(base) {
        return (
          Array.from(base.querySelectorAll("input")).find((input) => {
            const type = input.getAttribute("type") ?? "";
            const placeholder = input.getAttribute("placeholder") ?? "";
            return type === "search" || placeholder.toLowerCase().includes("search");
          }) ?? null
        );
      }

      function findSearchSurface(base, input) {
        let current = input.parentElement;

        while (current && current !== base.parentElement) {
          const rect = current.getBoundingClientRect();
          const style = getComputedStyle(current);
          const backdropFilter = style.backdropFilter || style.webkitBackdropFilter;
          const looksLikeSearchbox =
            rect.width >= 250 &&
            rect.width <= 500 &&
            rect.height >= 32 &&
            rect.height <= 80 &&
            (style.borderRadius !== "0px" ||
              style.overflow === "hidden" ||
              (backdropFilter && backdropFilter !== "none"));

          if (looksLikeSearchbox) {
            return current;
          }

          if (current === base) {
            break;
          }

          current = current.parentElement;
        }

        return null;
      }

      function findTextElement(base, pattern, bounds) {
        const candidates = Array.from(base.querySelectorAll("*"))
          .map((node) => {
            const text = (node.textContent ?? "").replace(/\s+/g, " ").trim();
            const rect = node.getBoundingClientRect();
            const relativeY = rect.y - rootRect.y;

            return { node, rect, relativeY, text };
          })
          .filter(({ rect, relativeY, text }) => {
            if (!pattern.test(text) || rect.width <= 0 || rect.height <= 0) {
              return false;
            }

            if (bounds.maxWidth !== undefined && rect.width > bounds.maxWidth) {
              return false;
            }

            if (bounds.maxHeight !== undefined && rect.height > bounds.maxHeight) {
              return false;
            }

            if (bounds.minY !== undefined && relativeY < bounds.minY) {
              return false;
            }

            if (bounds.maxY !== undefined && relativeY > bounds.maxY) {
              return false;
            }

            return true;
          })
          .sort(
            (a, b) =>
              a.relativeY - b.relativeY || a.rect.x - b.rect.x || a.text.length - b.text.length
          );

        return candidates[0]?.node ?? null;
      }

      function readElement(node, rootBounds) {
        const rect = node.getBoundingClientRect();
        const style = getComputedStyle(node);

        return {
          rect: toRelativeRect(rect, rootBounds),
          text: truncate((node.textContent ?? "").replace(/\s+/g, " ").trim()),
          style: {
            backdropFilter: style.backdropFilter || style.webkitBackdropFilter,
            backgroundColor: style.backgroundColor,
            borderRadius: style.borderRadius,
            boxShadow: truncate(style.boxShadow),
            color: style.color,
            fontSize: style.fontSize,
            fontWeight: style.fontWeight,
            letterSpacing: style.letterSpacing,
            lineHeight: style.lineHeight,
            opacity: style.opacity,
            textShadow: truncate(style.textShadow),
            transform: style.transform
          }
        };
      }

      function toRelativeRect(rect, rootBounds) {
        return {
          height: round(rect.height),
          width: round(rect.width),
          x: round(rect.x - rootBounds.x),
          y: round(rect.y - rootBounds.y)
        };
      }

      function toRect(rect) {
        return {
          height: round(rect.height),
          width: round(rect.width),
          x: round(rect.x),
          y: round(rect.y)
        };
      }

      function round(value) {
        return Math.round(value * 100) / 100;
      }

      function truncate(value) {
        return value.length > 240 ? `${value.slice(0, 240)}...` : value;
      }
    },
    { kind, label }
  );
}

function summarizeControlContract(target, candidate) {
  return {
    kind: target.kind,
    rectDeltas: {
      credit: summarizeRectDelta(target.credit?.rect, candidate.credit?.rect),
      imageBackgroundLabel: summarizeRectDelta(
        target.imageBackgroundLabel?.rect,
        candidate.imageBackgroundLabel?.rect
      ),
      input: summarizeRectDelta(target.input?.rect, candidate.input?.rect),
      surface: summarizeRectDelta(target.surface?.rect, candidate.surface?.rect)
    },
    rootBackgroundSize: {
      candidate: candidate.rootStyle.backgroundSize,
      target: target.rootStyle.backgroundSize
    },
    surfaceMaterial: {
      candidate: pickStyle(candidate.surface?.style),
      target: pickStyle(target.surface?.style)
    }
  };
}

function summarizeRectDelta(target, candidate) {
  if (!target || !candidate) {
    return { candidate: candidate ?? null, delta: null, target: target ?? null };
  }

  return {
    candidate,
    delta: {
      height: round(candidate.height - target.height),
      width: round(candidate.width - target.width),
      x: round(candidate.x - target.x),
      y: round(candidate.y - target.y)
    },
    target
  };
}

function pickStyle(style) {
  if (!style) {
    return null;
  }

  return {
    backdropFilter: style.backdropFilter,
    backgroundColor: style.backgroundColor,
    borderRadius: style.borderRadius,
    boxShadow: style.boxShadow,
    color: style.color,
    transform: style.transform
  };
}

async function readFilterContract(element, label) {
  return element.evaluate((root, contractLabel) => {
    const rootRect = toRect(root.getBoundingClientRect());
    const surface = findFilterSurface(root);
    const surfaceStyle = getComputedStyle(surface);
    const backdropFilter = surfaceStyle.backdropFilter || surfaceStyle.webkitBackdropFilter;
    const filterId = extractFilterId(backdropFilter);
    const filter = filterId ? document.getElementById(filterId) : null;
    const primitives = filter
      ? Array.from(filter.querySelectorAll("*")).map((node) => ({
          attributes: Object.fromEntries(
            node
              .getAttributeNames()
              .map((name) => [name, truncateAttribute(node.getAttribute(name) ?? "")])
          ),
          tag: node.tagName
        }))
      : [];

    return {
      label: contractLabel,
      rootRect,
      surfaceRect: toRect(surface.getBoundingClientRect()),
      computed: {
        backdropFilter,
        backgroundColor: surfaceStyle.backgroundColor,
        borderRadius: surfaceStyle.borderRadius,
        boxShadow: surfaceStyle.boxShadow,
        webkitBackdropFilter: surfaceStyle.webkitBackdropFilter
      },
      counts: countPrimitives(primitives),
      displacementScales: primitives
        .filter((primitive) => primitive.tag === "feDisplacementMap")
        .map((primitive) => Number(primitive.attributes.scale ?? 0)),
      filterId,
      imageSources: primitives
        .filter((primitive) => primitive.tag === "feImage")
        .map((primitive) => ({
          height: primitive.attributes.height,
          href: primitive.attributes.href ?? primitive.attributes["xlink:href"],
          result: primitive.attributes.result,
          width: primitive.attributes.width
        })),
      primitives
    };

    function findFilterSurface(base) {
      const candidates = [base, ...base.querySelectorAll("*")];
      return (
        candidates.find((candidate) => {
          const style = getComputedStyle(candidate);
          const value = style.backdropFilter || style.webkitBackdropFilter;
          return value && value !== "none" && value.includes("url(");
        }) ?? base
      );
    }

    function countPrimitives(primitivesToCount) {
      return primitivesToCount.reduce((counts, primitive) => {
        counts[primitive.tag] = (counts[primitive.tag] ?? 0) + 1;
        return counts;
      }, {});
    }

    function extractFilterId(value) {
      const match = value?.match(/url\((?:"|')?#?([^"')]+)(?:"|')?\)/);
      return match?.[1] ?? null;
    }

    function toRect(rect) {
      return {
        height: round(rect.height),
        width: round(rect.width),
        x: round(rect.x),
        y: round(rect.y)
      };
    }

    function round(value) {
      return Math.round(value * 100) / 100;
    }

    function truncateAttribute(value) {
      if (value.startsWith("data:") && value.length > 96) {
        return `${value.slice(0, 96)}...`;
      }

      if (value.length > 180) {
        return `${value.slice(0, 180)}...`;
      }

      return value;
    }
  }, label);
}

function summarizeFilterContract(target, candidate) {
  return {
    candidateDisplacementMapCount: candidate.counts.feDisplacementMap ?? 0,
    candidateDisplacementScales: candidate.displacementScales,
    candidateFilterId: candidate.filterId,
    candidateImageCount: candidate.counts.feImage ?? 0,
    candidateLooksOnePass: (candidate.counts.feDisplacementMap ?? 0) === 1,
    candidateLooksTwoPass: (candidate.counts.feDisplacementMap ?? 0) >= 2,
    targetDisplacementMapCount: target.counts.feDisplacementMap ?? 0,
    targetDisplacementScales: target.displacementScales,
    targetFilterId: target.filterId,
    targetImageCount: target.counts.feImage ?? 0,
    targetLooksTwoPass: (target.counts.feDisplacementMap ?? 0) >= 2
  };
}

function assertFilterContractParity(reference, summary) {
  if (reference.targetId !== "magnifying-glass") {
    return;
  }

  if (summary.targetLooksTwoPass && !summary.candidateLooksTwoPass) {
    throw new Error(
      `Kube filter contract mismatch for ${reference.name}: target is two-pass but candidate is not (${JSON.stringify(summary)})`
    );
  }

  if (summary.candidateDisplacementMapCount !== summary.targetDisplacementMapCount) {
    throw new Error(
      `Kube displacement map count mismatch for ${reference.name}: target=${summary.targetDisplacementMapCount}, candidate=${summary.candidateDisplacementMapCount} (${JSON.stringify(summary)})`
    );
  }

  if (summary.candidateImageCount !== summary.targetImageCount) {
    throw new Error(
      `Kube filter image count mismatch for ${reference.name}: target=${summary.targetImageCount}, candidate=${summary.candidateImageCount} (${JSON.stringify(summary)})`
    );
  }

  if (summary.candidateDisplacementScales.length !== summary.targetDisplacementScales.length) {
    throw new Error(
      `Kube displacement scale count mismatch for ${reference.name}: target=${summary.targetDisplacementScales.length}, candidate=${summary.candidateDisplacementScales.length} (${JSON.stringify(summary)})`
    );
  }

  const scaleFailures = summary.targetDisplacementScales
    .map((targetScale, index) => {
      const candidateScale = summary.candidateDisplacementScales[index];
      const delta = Math.abs(candidateScale - targetScale);

      return delta > 1
        ? `scale[${index}]: target=${round(targetScale)}, candidate=${round(candidateScale)}, delta=${round(delta)}`
        : null;
    })
    .filter(Boolean);

  if (scaleFailures.length > 0) {
    throw new Error(
      `Kube displacement scales diverged for ${reference.name}: ${scaleFailures.join("; ")}`
    );
  }
}

async function compareImagesInBrowser(
  browser,
  targetPath,
  candidatePath,
  compareRegion,
  diffPath,
  threshold,
  maxPhaseOffset,
  phaseStride
) {
  const [target, candidate] = await Promise.all([
    fs.readFile(targetPath),
    fs.readFile(candidatePath)
  ]);
  const page = await browser.newPage();
  const result = await page.evaluate(
    async ({ targetBase64, candidateBase64, maxOffset, pixelThreshold, region, sampleStride }) => {
      const targetImage = await loadImage(targetBase64);
      const candidateImage = await loadImage(candidateBase64);
      const targetImageSize = { height: targetImage.height, width: targetImage.width };
      const candidateImageSize = { height: candidateImage.height, width: candidateImage.width };
      const source = region ?? {
        x: 0,
        y: 0,
        width: Math.min(targetImage.width, candidateImage.width),
        height: Math.min(targetImage.height, candidateImage.height)
      };
      const width = Math.min(
        source.width,
        targetImage.width - source.x,
        candidateImage.width - source.x
      );
      const height = Math.min(
        source.height,
        targetImage.height - source.y,
        candidateImage.height - source.y
      );
      const canvas = new OffscreenCanvas(width, height);
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) {
        throw new Error("Missing canvas context");
      }

      context.drawImage(targetImage, source.x, source.y, width, height, 0, 0, width, height);
      const targetPixels = context.getImageData(0, 0, width, height).data;
      context.clearRect(0, 0, width, height);
      context.drawImage(candidateImage, source.x, source.y, width, height, 0, 0, width, height);
      const candidatePixels = context.getImageData(0, 0, width, height).data;
      const diffImage = context.createImageData(width, height);
      let different = 0;
      let totalDelta = 0;
      let totalSquaredDelta = 0;
      for (let index = 0; index < targetPixels.length; index += 4) {
        const delta =
          Math.abs(targetPixels[index] - candidatePixels[index]) +
          Math.abs(targetPixels[index + 1] - candidatePixels[index + 1]) +
          Math.abs(targetPixels[index + 2] - candidatePixels[index + 2]) +
          Math.abs(targetPixels[index + 3] - candidatePixels[index + 3]);
        totalDelta += delta;
        totalSquaredDelta += delta * delta;
        if (delta > pixelThreshold) {
          different += 1;
        }

        const intensity = Math.min(255, Math.round(delta / 3));
        diffImage.data[index] = 255;
        diffImage.data[index + 1] = Math.max(0, 255 - intensity);
        diffImage.data[index + 2] = Math.max(0, 255 - intensity);
        diffImage.data[index + 3] = delta > pixelThreshold ? 255 : 96;
      }

      const bestPhaseOffset = findBestPhaseOffset(
        targetPixels,
        candidatePixels,
        width,
        height,
        pixelThreshold,
        maxOffset,
        sampleStride
      );
      const diffDiagnostics = computeDiffDiagnostics(
        targetPixels,
        candidatePixels,
        width,
        height,
        pixelThreshold
      );

      context.putImageData(diffImage, 0, 0);
      const diffBlob = await canvas.convertToBlob({ type: "image/png" });
      const diffPngBase64 = await blobToBase64(diffBlob);

      const pixelCount = width * height;
      return {
        bestPhaseOffset,
        candidateImageSize,
        compareRegion: source,
        diffDiagnostics,
        diffRatio: different / pixelCount,
        diffPngBase64,
        height,
        meanDelta: totalDelta / pixelCount,
        rmsDelta: Math.sqrt(totalSquaredDelta / pixelCount),
        targetImageSize,
        width
      };

      function findBestPhaseOffset(
        targetPixelsToCompare,
        candidatePixelsToCompare,
        imageWidth,
        imageHeight,
        differenceThreshold,
        maxCandidateOffset,
        stride
      ) {
        let best = null;

        for (
          let candidateDy = -maxCandidateOffset;
          candidateDy <= maxCandidateOffset;
          candidateDy += 1
        ) {
          for (
            let candidateDx = -maxCandidateOffset;
            candidateDx <= maxCandidateOffset;
            candidateDx += 1
          ) {
            const startX = Math.max(0, -candidateDx);
            const endX = Math.min(imageWidth, imageWidth - candidateDx);
            const startY = Math.max(0, -candidateDy);
            const endY = Math.min(imageHeight, imageHeight - candidateDy);
            let compared = 0;
            let differentPixels = 0;
            let totalOffsetDelta = 0;
            let totalOffsetSquaredDelta = 0;

            for (let y = startY; y < endY; y += stride) {
              const candidateY = y + candidateDy;

              for (let x = startX; x < endX; x += stride) {
                const candidateX = x + candidateDx;
                const targetIndex = (y * imageWidth + x) * 4;
                const candidateIndex = (candidateY * imageWidth + candidateX) * 4;
                const delta =
                  Math.abs(
                    targetPixelsToCompare[targetIndex] - candidatePixelsToCompare[candidateIndex]
                  ) +
                  Math.abs(
                    targetPixelsToCompare[targetIndex + 1] -
                      candidatePixelsToCompare[candidateIndex + 1]
                  ) +
                  Math.abs(
                    targetPixelsToCompare[targetIndex + 2] -
                      candidatePixelsToCompare[candidateIndex + 2]
                  ) +
                  Math.abs(
                    targetPixelsToCompare[targetIndex + 3] -
                      candidatePixelsToCompare[candidateIndex + 3]
                  );

                compared += 1;
                totalOffsetDelta += delta;
                totalOffsetSquaredDelta += delta * delta;
                if (delta > differenceThreshold) {
                  differentPixels += 1;
                }
              }
            }

            if (compared === 0) {
              continue;
            }

            const candidate = {
              candidateDx,
              candidateDy,
              comparedPixels: compared,
              diffRatio: differentPixels / compared,
              meanDelta: totalOffsetDelta / compared,
              overlapHeight: endY - startY,
              overlapWidth: endX - startX,
              rmsDelta: Math.sqrt(totalOffsetSquaredDelta / compared),
              sampleStride: stride
            };

            if (!best || candidate.diffRatio < best.diffRatio) {
              best = candidate;
            }
          }
        }

        return best;
      }

      function computeDiffDiagnostics(
        targetPixelsToCompare,
        candidatePixelsToCompare,
        imageWidth,
        imageHeight,
        differenceThreshold
      ) {
        const verticalBands = [
          { name: "top", yMin: 0, yMax: 0.2 },
          { name: "upperMid", yMin: 0.2, yMax: 0.4 },
          { name: "center", yMin: 0.4, yMax: 0.6 },
          { name: "lowerMid", yMin: 0.6, yMax: 0.8 },
          { name: "bottom", yMin: 0.8, yMax: 1 }
        ].map((band) =>
          summarizeRegion(
            imageWidth,
            imageHeight,
            (x, y) => {
              const normalizedY = (y + 0.5) / imageHeight;
              return normalizedY >= band.yMin && normalizedY < band.yMax;
            },
            band.name
          )
        );

        const horizontalBands = [
          { name: "left", xMin: 0, xMax: 1 / 3 },
          { name: "middle", xMin: 1 / 3, xMax: 2 / 3 },
          { name: "right", xMin: 2 / 3, xMax: 1 }
        ].map((band) =>
          summarizeRegion(
            imageWidth,
            imageHeight,
            (x) => {
              const normalizedX = (x + 0.5) / imageWidth;
              return normalizedX >= band.xMin && normalizedX < band.xMax;
            },
            band.name
          )
        );

        const radialRegions = [
          { maxDistance: 0.45, minDistance: 0, name: "centerCore" },
          { maxDistance: 0.8, minDistance: 0.45, name: "midGlass" },
          { maxDistance: Number.POSITIVE_INFINITY, minDistance: 0.8, name: "outerRim" }
        ].map((region) =>
          summarizeRegion(
            imageWidth,
            imageHeight,
            (x, y) => {
              const normalizedX = ((x + 0.5) / imageWidth) * 2 - 1;
              const normalizedY = ((y + 0.5) / imageHeight) * 2 - 1;
              const distance = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY);
              return distance >= region.minDistance && distance < region.maxDistance;
            },
            region.name
          )
        );

        return {
          horizontalBands,
          radialRegions,
          verticalBands,
          worstRegion: [...verticalBands, ...horizontalBands, ...radialRegions].reduce(
            (worst, region) => (!worst || region.diffRatio > worst.diffRatio ? region : worst),
            null
          )
        };

        function summarizeRegion(imageWidthToCompare, imageHeightToCompare, includesPixel, name) {
          let compared = 0;
          let differentPixels = 0;
          let totalRegionDelta = 0;
          let totalRegionSquaredDelta = 0;

          for (let y = 0; y < imageHeightToCompare; y += 1) {
            for (let x = 0; x < imageWidthToCompare; x += 1) {
              if (!includesPixel(x, y)) {
                continue;
              }

              const index = (y * imageWidthToCompare + x) * 4;
              const delta =
                Math.abs(targetPixelsToCompare[index] - candidatePixelsToCompare[index]) +
                Math.abs(targetPixelsToCompare[index + 1] - candidatePixelsToCompare[index + 1]) +
                Math.abs(targetPixelsToCompare[index + 2] - candidatePixelsToCompare[index + 2]) +
                Math.abs(targetPixelsToCompare[index + 3] - candidatePixelsToCompare[index + 3]);

              compared += 1;
              totalRegionDelta += delta;
              totalRegionSquaredDelta += delta * delta;
              if (delta > differenceThreshold) {
                differentPixels += 1;
              }
            }
          }

          return {
            diffRatio: compared > 0 ? differentPixels / compared : 0,
            meanDelta: compared > 0 ? totalRegionDelta / compared : 0,
            name,
            pixelCount: compared,
            rmsDelta: compared > 0 ? Math.sqrt(totalRegionSquaredDelta / compared) : 0
          };
        }
      }

      async function loadImage(base64) {
        const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
        return createImageBitmap(new Blob([bytes], { type: "image/png" }));
      }

      function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onerror = () => reject(reader.error);
          reader.onload = () => {
            const value = String(reader.result);
            resolve(value.slice(value.indexOf(",") + 1));
          };
          reader.readAsDataURL(blob);
        });
      }
    },
    {
      candidateBase64: candidate.toString("base64"),
      maxOffset: maxPhaseOffset,
      pixelThreshold: threshold,
      region: compareRegion,
      sampleStride: phaseStride,
      targetBase64: target.toString("base64")
    }
  );

  await fs.writeFile(diffPath, Buffer.from(result.diffPngBase64, "base64"));
  await page.close();
  const summary = { ...result };
  delete summary.diffPngBase64;
  return summary;
}

function contentType(filePath) {
  if (filePath.endsWith(".html")) {
    return "text/html; charset=utf-8";
  }

  if (filePath.endsWith(".js")) {
    return "text/javascript; charset=utf-8";
  }

  if (filePath.endsWith(".css")) {
    return "text/css";
  }

  if (filePath.endsWith(".svg")) {
    return "image/svg+xml";
  }

  if (filePath.endsWith(".png")) {
    return "image/png";
  }

  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
    return "image/jpeg";
  }

  if (filePath.endsWith(".webp")) {
    return "image/webp";
  }

  return "application/octet-stream";
}

function round(value) {
  return Math.round(value * 100) / 100;
}
