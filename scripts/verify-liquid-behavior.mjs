/* global createImageBitmap, document, getComputedStyle, requestAnimationFrame */

import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { chromium } from "playwright";

const kubeAssetSource = await fs.readFile(
  new URL("../stories/kube-reference-assets.ts", import.meta.url),
  "utf8"
);
const staticDir = path.resolve(process.env.STORYBOOK_STATIC_DIR ?? "storybook-static-test");
const behaviorArtifactDir = path.resolve("test-results/liquid-behavior");
const focusScreenshotDir = path.join(behaviorArtifactDir, "focus");
const kubeLensImageId = "lens-demo-image.jpg";
const kubeSearchboxImageId = "searchbox-demo-background.jpg";
const kubeLensDemoImage = readKubeReferenceAsset("lensDemoImage");
const kubeSearchboxDemoBackground = readKubeReferenceAsset("searchboxDemoBackground");

await fs.mkdir(behaviorArtifactDir, { recursive: true });
await fs.mkdir(focusScreenshotDir, { recursive: true });

const behaviorStories = {
  breadcrumb: {
    id: "liquid-glass-foundation-primitives--component-set",
    selector: ".lg-breadcrumb__link"
  },
  checkbox: {
    id: "liquid-glass-foundation-primitives--component-set",
    selector: ".lg-checkbox__surface"
  },
  radioGroup: {
    focusSelector: ".lg-radio-group__input",
    id: "liquid-glass-foundation-primitives--component-set",
    selector: ".lg-radio-group__item:not([data-disabled])"
  },
  nativeSelect: {
    focusSelector: ".lg-native-select",
    id: "liquid-glass-foundation-primitives--component-set",
    selector: ".lg-native-select-surface"
  },
  select: {
    focusSelector: ".lg-select",
    id: "liquid-glass-liquidfield--select-and-otp",
    selector: ".lg-select-surface"
  },
  pagination: {
    id: "liquid-glass-foundation-primitives--component-set",
    selector: ".lg-pagination__link:not([data-disabled]):not([data-active])"
  },
  scrollArea: {
    id: "liquid-glass-foundation-primitives--component-set",
    selector: ".lg-scroll-area__viewport"
  },
  dataTableSort: {
    id: "liquid-glass-data-table--product-release-table",
    selector: ".lg-data-table__sort"
  },
  sidebarMenuButton: {
    id: "liquid-glass-sidebar--app-shell",
    selector: ".lg-sidebar-menu__button:not([data-active])"
  },
  sidebarMenuAction: {
    id: "liquid-glass-sidebar--app-shell",
    selector: ".lg-sidebar-menu__action"
  },
  sidebarRail: {
    id: "liquid-glass-sidebar--app-shell",
    selector: ".lg-sidebar-rail"
  },
  calendarNav: {
    id: "liquid-glass-liquidcalendar--single-selection",
    selector: ".lg-calendar__nav-button"
  },
  calendarDay: {
    id: "liquid-glass-liquidcalendar--single-selection",
    selector: '.lg-calendar__day-button[tabindex="0"]'
  },
  datePickerTrigger: {
    id: "liquid-glass-liquiddatepicker--single",
    selector: ".lg-date-picker__trigger"
  },
  resizableHandle: {
    id: "liquid-glass-liquidresizable--horizontal",
    selector: ".lg-resizable__handle"
  },
  toggle: {
    id: "liquid-glass-liquidtoggle--interactive",
    selector: ".lg-surface--toggle"
  },
  tooltipTrigger: {
    id: "liquid-glass-overlay-primitives--light",
    selector: ".lg-tooltip__trigger"
  },
  segmentedControl: {
    id: "liquid-glass-liquidsegmentedcontrol--modes",
    selector: ".lg-segmented-control__item"
  },
  toolbar: {
    id: "liquid-glass-liquidtoolbar--article-toolbar",
    selector: ".lg-toolbar .lg-surface--button"
  },
  button: {
    id: "liquid-glass-liquidbutton--focus-visible",
    selector: ".lg-surface--button"
  },
  field: {
    id: "liquid-glass-liquidfield--light-mode",
    focusSelector: ".lg-input",
    selector: ".lg-field-control"
  },
  accordion: {
    id: "liquid-glass-liquidaccordion--focus-visible",
    selector: ".lg-accordion__trigger"
  },
  command: {
    focusSelector: ".lg-command__input",
    id: "liquid-glass-liquidcommand--command-palette",
    selector: ".lg-command__item[data-selected]"
  },
  contextMenuTrigger: {
    id: "liquid-glass-overlay-primitives--light",
    selector: ".lg-context-menu__trigger"
  },
  popoverTrigger: {
    id: "liquid-glass-overlay-primitives--light",
    selector: '.lg-surface--button[aria-haspopup="dialog"]'
  },
  dialogTrigger: {
    id: "liquid-glass-liquiddialog--light-mode",
    selector: '.lg-surface--button[aria-haspopup="dialog"]'
  },
  comboboxTrigger: {
    id: "liquid-glass-liquidcommand--combobox",
    selector: ".lg-combobox__trigger"
  },
  carouselNext: {
    id: "liquid-glass-liquidcarousel--horizontal-cards",
    selector: ".lg-carousel__control--next:not(:disabled)"
  },
  hoverCardTrigger: {
    id: "liquid-glass-overlay-primitives--light",
    selector: ".lg-hover-card__trigger"
  },
  menubarTrigger: {
    id: "liquid-glass-overlay-primitives--light",
    selector: ".lg-menubar__trigger"
  },
  otp: {
    id: "liquid-glass-liquidfield--select-and-otp",
    selector: ".lg-input-otp__field"
  },
  tabs: {
    id: "liquid-glass-liquidtabs--light-mode",
    selector: ".lg-tabs__tab"
  },
  nav: {
    id: "liquid-glass-liquidnav--apple-like-tabs",
    selector: '.lg-nav .lg-surface--button:not([aria-current="page"])'
  },
  switch: {
    focusSelector: ".lg-switch",
    id: "liquid-glass-liquidswitch--kube-reference",
    selector: ".lg-switch"
  },
  slider: {
    focusSelector: ".lg-slider__input",
    id: "liquid-glass-liquidslider--kube-reference",
    selector: ".lg-slider"
  },
  searchbox: {
    id: "liquid-glass-liquidsearchbox--focus-photo-reference",
    focusSelector: ".lg-searchbox__input",
    selector: ".lg-searchbox"
  },
  draggableLens: {
    id: "liquid-glass-liquidlens--draggable-precision-lens",
    selector: "[data-lg-draggable-lens]"
  },
  lensFocus: {
    id: "liquid-glass-liquidlens--draggable-precision-lens",
    selector: "[data-lg-draggable-lens]"
  }
};

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
const focusAuditResults = [];
const interactionAuditResults = [];
const focusAuditTargets = [
  {
    name: "breadcrumb",
    options: { minimumFocusedScale: 1.01, requireMaterialDeepening: true }
  },
  {
    name: "checkbox",
    options: {
      focusSelector: ".lg-checkbox__input",
      minimumFocusedScale: 1.01,
      requireMaterialDeepening: true
    }
  },
  {
    name: "radioGroup",
    options: {
      focusSelector: behaviorStories.radioGroup.focusSelector,
      minimumFocusedScale: 1.01,
      requireMaterialDeepening: true
    }
  },
  {
    name: "nativeSelect",
    options: {
      focusSelector: behaviorStories.nativeSelect.focusSelector,
      minimumFocusedScale: 1.012,
      requireMaterialDeepening: true
    }
  },
  {
    name: "select",
    options: {
      focusSelector: behaviorStories.select.focusSelector,
      maximumFocusedScreenshotLumaLoss: 24,
      minimumFocusedScreenshotLuma: 190,
      minimumFocusedScale: 1.012,
      requireMaterialDeepening: true
    }
  },
  {
    name: "pagination",
    options: { minimumFocusedScale: 1.02, requireMaterialDeepening: true }
  },
  {
    name: "scrollArea",
    options: { minimumFocusedScale: 1.008, requireMaterialDeepening: true }
  },
  {
    name: "dataTableSort",
    options: { minimumFocusedScale: 1.01, requireMaterialDeepening: true }
  },
  {
    name: "sidebarMenuButton",
    options: { minimumFocusedScale: 1.01, requireMaterialDeepening: true }
  },
  {
    name: "sidebarMenuAction",
    options: { minimumFocusedScale: 1.01, requireMaterialDeepening: true }
  },
  {
    name: "sidebarRail",
    options: { minimumFocusedScale: 1.01, requireMaterialDeepening: true }
  },
  {
    name: "calendarNav",
    options: { minimumFocusedScale: 1.05, requireMaterialDeepening: true }
  },
  {
    name: "calendarDay",
    options: {
      afterFocus: async (page) => {
        await page.keyboard.press("ArrowRight");
      },
      focusedSelector: ".lg-calendar__day-button:focus-visible",
      minimumFocusedScale: 1.05,
      requireMaterialDeepening: true
    }
  },
  {
    name: "datePickerTrigger",
    options: { minimumFocusedScale: 1.018, requireMaterialDeepening: true }
  },
  {
    name: "resizableHandle",
    options: { minimumFocusedScale: 1.03, requireMaterialDeepening: true }
  },
  {
    name: "toggle",
    options: {
      maximumFocusedScreenshotBlackPixelRatio: 0.22,
      maximumFocusedScreenshotDarkPixelRatio: 0.28,
      minimumFocusedScreenshotLuma: 155,
      minimumFocusedScale: 1.02,
      requireMaterialDeepening: true
    }
  },
  {
    name: "segmentedControl",
    options: {
      minimumFocusedScale: 1.02,
      requireMaterialDeepening: false,
      requireMaterialResponse: true
    }
  },
  {
    name: "toolbar",
    options: { minimumFocusedScale: 1.04, requireMaterialDeepening: true }
  },
  {
    name: "tabs",
    options: { minimumFocusedScale: 1.04, requireMaterialDeepening: true }
  },
  {
    name: "nav",
    options: {
      maximumFocusedScreenshotBlackPixelRatio: 0.18,
      maximumFocusedScreenshotDarkPixelRatio: 0.24,
      minimumFocusedScreenshotLuma: 165,
      minimumFocusedScale: 1.04,
      requireMaterialDeepening: true
    }
  },
  {
    name: "searchbox",
    options: {
      focusSelector: behaviorStories.searchbox.focusSelector,
      minimumFocusGrowthRatio: 1.2,
      minimumFocusedScale: 0.999,
      requireMaterialDeepening: true
    }
  },
  {
    name: "field",
    options: {
      focusSelector: behaviorStories.field.focusSelector,
      minimumFocusedScale: 1.012,
      requireMaterialDeepening: true
    }
  },
  {
    name: "accordion",
    options: { minimumFocusedScale: 1.01, requireMaterialDeepening: true }
  },
  {
    name: "contextMenuTrigger",
    options: { minimumFocusedScale: 1.018, requireMaterialDeepening: true }
  },
  {
    name: "popoverTrigger",
    options: { minimumFocusedScale: 1.018, requireMaterialDeepening: true }
  },
  {
    name: "dialogTrigger",
    options: { minimumFocusedScale: 1.018, requireMaterialDeepening: true }
  },
  {
    name: "comboboxTrigger",
    options: { minimumFocusedScale: 1.018, requireMaterialDeepening: true }
  },
  {
    name: "carouselNext",
    options: { minimumFocusedScale: 1.018, requireMaterialDeepening: true }
  },
  {
    name: "hoverCardTrigger",
    options: { minimumFocusedScale: 1.018, requireMaterialDeepening: true }
  },
  {
    name: "menubarTrigger",
    options: { minimumFocusedScale: 1.018, requireMaterialDeepening: true }
  },
  {
    name: "otp",
    options: {
      contextScreenshotSelector: ".lg-input-otp",
      maximumFocusedScreenshotDarkPixelRatio: 0.02,
      maximumFocusedContextScreenshotBlackPixelRatio: 0.01,
      maximumFocusedContextScreenshotDarkPixelRatio: 0.03,
      maximumFocusedMaterialLumaLoss: 8,
      minimumFocusedContextScreenshotLuma: 232,
      maximumFocusedScreenshotLumaLoss: 18,
      minimumFocusedMaterialLuma: 238,
      minimumFocusedScreenshotLuma: 214,
      minimumFocusedScale: 1.05,
      requireMaterialDeepening: true
    }
  },
  {
    name: "tooltipTrigger",
    options: { minimumFocusedScale: 1.018, requireMaterialDeepening: true }
  },
  {
    name: "button",
    options: {
      maximumFocusedScreenshotBlackPixelRatio: 0.14,
      maximumFocusedScreenshotDarkPixelRatio: 0.3,
      minimumFocusedScreenshotLuma: 168,
      minimumFocusedScale: 1.018,
      requireMaterialDeepening: true
    }
  },
  {
    name: "switch",
    options: {
      contextScreenshotSelector: ".lg-switch",
      focusSelector: behaviorStories.switch.focusSelector,
      materialSelector: ".lg-switch__track",
      maximumFocusedContextScreenshotBlackPixelRatio: 0.01,
      maximumFocusedContextScreenshotDarkPixelRatio: 0.02,
      maximumFocusedScreenshotLumaLoss: 18,
      minimumFocusedScreenshotLuma: 232,
      minimumFocusedScale: 1.02,
      requireFocusedElementShadow: false,
      requireMaterialDeepening: false,
      requireMaterialResponse: true,
      requireMaterialShadowLayerGrowth: true
    }
  },
  {
    name: "slider",
    options: {
      contextScreenshotSelector: ".lg-slider",
      focusSelector: behaviorStories.slider.focusSelector,
      materialSelector: ".lg-slider__track",
      maximumFocusedContextScreenshotBlackPixelRatio: 0.01,
      maximumFocusedContextScreenshotDarkPixelRatio: 0.03,
      maximumFocusedScreenshotLumaLoss: 22,
      minimumFocusedScreenshotLuma: 226,
      minimumFocusedScale: 1.015,
      requireFocusedElementShadow: false,
      requireMaterialDeepening: false,
      requireMaterialResponse: true,
      requireMaterialShadowLayerGrowth: true
    }
  },
  {
    name: "lensFocus",
    options: {
      minimumFocusedScale: 1.02,
      requireMaterialDeepening: false,
      requireShadowChange: true,
      requireShadowLayerGrowth: false
    }
  }
];
const interactionAuditTargets = [
  {
    activeScaleMaxFromHover: 0,
    materialSelector: behaviorStories.tabs.selector,
    name: "tabs",
    pointerSelector: behaviorStories.tabs.selector,
    stateSelector: behaviorStories.tabs.selector,
    targetIndex: 1
  },
  {
    materialSelector: behaviorStories.nav.selector,
    name: "nav",
    pointerSelector: behaviorStories.nav.selector,
    stateSelector: behaviorStories.nav.selector
  },
  {
    activeScaleMin: 0.99,
    materialSelector: behaviorStories.searchbox.selector,
    minimumHoverScale: 0.84,
    name: "searchbox",
    pointerSelector: behaviorStories.searchbox.selector,
    stateSelector: behaviorStories.searchbox.selector
  },
  {
    activeScaleDeltaFromHover: 0.025,
    materialSelector: ".lg-switch__track",
    minimumHoverScale: 0.68,
    name: "switch",
    pointerSelector: ".lg-switch",
    stateSelector: ".lg-switch__thumb"
  },
  {
    activeScaleDeltaFromHover: 0.025,
    dragOffset: { x: 140, y: 0 },
    materialSelector: ".lg-slider__track",
    minimumDragLeftDelta: 50,
    minimumHoverScale: 0.63,
    name: "slider",
    pointerSelector: ".lg-slider",
    stateSelector: ".lg-slider__thumb"
  }
];

try {
  for (const target of focusAuditTargets) {
    await verifyFocusMaterial(target.name, target.options);
  }

  await verifySearchboxKubeImageBackground();
  await verifyCommandRovingFocusMaterial();
  await verifyHoverAndActiveResponse();
  await verifyDraggableLensPlayground();
  await verifyReducedMotionRemovesElasticFocus();
  await writeFocusAuditResults();
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

async function verifyFocusMaterial(name, options) {
  const story = behaviorStories[name];
  const page = await openStory(story.id);
  const locator = page.locator(story.selector).first();
  await locator.waitFor({ state: "visible", timeout: 10_000 });
  const idle = await readState(locator);
  const materialLocator = options.materialSelector
    ? page.locator(options.materialSelector).first()
    : locator;
  await materialLocator.waitFor({ state: "visible", timeout: 10_000 });
  const idleMaterial = await readState(materialLocator);
  const idleScreenshot = path.join(focusScreenshotDir, `${safeFileSegment(name)}-idle.png`);
  const idleScreenshotEvidence = await captureFocusScreenshot(
    page,
    locator,
    idleScreenshot,
    `${name} idle`
  );

  const focusSelector = options.focusSelector ?? story.selector;
  if (options.focusSelector) {
    await page.locator(focusSelector).first().focus();
  } else {
    await keyboardFocusVisible(page, focusSelector);
  }
  await options.afterFocus?.(page);
  await page.waitForTimeout(420);
  const focusedLocator = page
    .locator(options.focusedSelector ?? `${story.selector}:focus-visible`)
    .first();
  const focusedCaptureLocator = (await focusedLocator.count()) > 0 ? focusedLocator : locator;
  const focused = await readState(focusedCaptureLocator);
  const focusedMaterialLocator = options.focusedMaterialSelector
    ? page.locator(options.focusedMaterialSelector).first()
    : materialLocator;
  const focusedMaterial = await readState(focusedMaterialLocator);
  const focusedScreenshot = path.join(focusScreenshotDir, `${safeFileSegment(name)}-focused.png`);
  const focusedScreenshotEvidence = await captureFocusScreenshot(
    page,
    focusedCaptureLocator,
    focusedScreenshot,
    `${name} focused`
  );
  let focusedContextScreenshotEvidence = null;
  if (options.contextScreenshotSelector) {
    const contextLocator = page.locator(options.contextScreenshotSelector).first();
    const focusedContextScreenshot = path.join(
      focusScreenshotDir,
      `${safeFileSegment(name)}-focused-context.png`
    );
    focusedContextScreenshotEvidence = await captureFocusScreenshot(
      page,
      contextLocator,
      focusedContextScreenshot,
      `${name} focused context`
    );
  }

  assertEqual(focused.outlineStyle, "none", `${name} focus outline style`);
  assertNoPlasticFocusChrome(focused, `${name} focus`);
  assertNoPlasticFocusChrome(focusedMaterial, `${name} focus material`);
  if (options.requireMaterialDeepening) {
    assertGreaterThan(
      focusedMaterial.backgroundAlpha,
      idleMaterial.backgroundAlpha + 0.04,
      `${name} focus material alpha`
    );
  }
  if (options.minimumFocusedMaterialLuma !== undefined) {
    assertGreaterOrEqual(
      focusedMaterial.backgroundLuma,
      options.minimumFocusedMaterialLuma,
      `${name} focus material luma`
    );
  }
  if (options.maximumFocusedMaterialLumaLoss !== undefined) {
    assertGreaterOrEqual(
      focusedMaterial.backgroundLuma,
      idleMaterial.backgroundLuma - options.maximumFocusedMaterialLumaLoss,
      `${name} focus material luma loss`
    );
  }
  if (options.requireMaterialResponse) {
    assertMaterialResponse(idleMaterial, focusedMaterial, `${name} focus material`);
  }
  if (options.requireMaterialShadowLayerGrowth) {
    assertGreaterThan(
      focusedMaterial.shadowLayerCount,
      idleMaterial.shadowLayerCount,
      `${name} focus material shadow layers`
    );
  }
  if (options.minimumFocusedScale !== undefined) {
    assertGreaterOrEqual(focused.scale, options.minimumFocusedScale, `${name} focus scale`);
  }
  if (options.minimumFocusedScreenshotLuma !== undefined) {
    assertGreaterOrEqual(
      focusedScreenshotEvidence.meanLuma ?? 0,
      options.minimumFocusedScreenshotLuma,
      `${name} focused screenshot mean luma`
    );
  }
  if (options.maximumFocusedScreenshotLumaLoss !== undefined) {
    assertGreaterOrEqual(
      focusedScreenshotEvidence.meanLuma ?? 0,
      (idleScreenshotEvidence.meanLuma ?? 0) - options.maximumFocusedScreenshotLumaLoss,
      `${name} focused screenshot luma loss`
    );
  }
  if (options.maximumFocusedScreenshotDarkPixelRatio !== undefined) {
    assertLessThanOrEqual(
      focusedScreenshotEvidence.darkPixelRatio ?? 1,
      options.maximumFocusedScreenshotDarkPixelRatio,
      `${name} focused screenshot dark pixel ratio`
    );
  }
  if (options.minimumFocusedContextScreenshotLuma !== undefined) {
    assertGreaterOrEqual(
      focusedContextScreenshotEvidence?.meanLuma ?? 0,
      options.minimumFocusedContextScreenshotLuma,
      `${name} focused context screenshot mean luma`
    );
  }
  if (options.maximumFocusedContextScreenshotDarkPixelRatio !== undefined) {
    assertLessThanOrEqual(
      focusedContextScreenshotEvidence?.darkPixelRatio ?? 1,
      options.maximumFocusedContextScreenshotDarkPixelRatio,
      `${name} focused context screenshot dark pixel ratio`
    );
  }
  if (options.maximumFocusedContextScreenshotBlackPixelRatio !== undefined) {
    assertLessThanOrEqual(
      focusedContextScreenshotEvidence?.blackPixelRatio ?? 1,
      options.maximumFocusedContextScreenshotBlackPixelRatio,
      `${name} focused context screenshot black pixel ratio`
    );
  }
  assertLessThanOrEqual(
    focusedScreenshotEvidence.blackPixelRatio ?? 1,
    options.maximumFocusedScreenshotBlackPixelRatio ?? 0.72,
    `${name} focused screenshot black pixel ratio`
  );
  if (options.requireShadowChange) {
    assertNotEqual(focused.boxShadow, idle.boxShadow, `${name} focus shadow`);
  }
  if (options.requireFocusedElementShadow !== false) {
    if (options.requireShadowLayerGrowth ?? true) {
      assertGreaterThan(
        focused.shadowLayerCount,
        idle.shadowLayerCount,
        `${name} focus shadow layers`
      );
    } else {
      assertGreaterThan(focused.shadowLayerCount, 0, `${name} focus shadow layers`);
    }
  }
  if (
    !focused.transitionProperty.split(",").some((property) => {
      const normalized = property.trim();
      return normalized === "all" || normalized === "transform";
    })
  ) {
    throw new Error(
      `${name} focus transition property: expected ${JSON.stringify(
        focused.transitionProperty
      )} to include transform or all`
    );
  }
  assertGreaterThan(focused.maxTransitionDurationMs, 0, `${name} focus transition duration`);
  if (options.minimumFocusGrowthRatio !== undefined) {
    assertGreaterOrEqual(
      focused.width / idle.width,
      options.minimumFocusGrowthRatio,
      `${name} focus visual width ratio`
    );
  } else {
    assertGreaterThan(focused.width, idle.width, `${name} focus visual width`);
  }

  assertEqual(focused.foregroundTextShadowCount, 0, `${name} focused foreground text shadows`);

  focusAuditResults.push({
    backgroundAlphaDelta: round(focused.backgroundAlpha - idle.backgroundAlpha),
    focusedContextScreenshotBlackPixelRatio: roundNullable(
      focusedContextScreenshotEvidence?.blackPixelRatio
    ),
    focusedContextScreenshotDarkPixelRatio: roundNullable(
      focusedContextScreenshotEvidence?.darkPixelRatio
    ),
    focusedContextScreenshotMeanLuma: roundNullable(focusedContextScreenshotEvidence?.meanLuma),
    focusedScreenshotBlackPixelRatio: roundNullable(focusedScreenshotEvidence.blackPixelRatio),
    focusedScreenshotDarkPixelRatio: roundNullable(focusedScreenshotEvidence.darkPixelRatio),
    focusedScreenshotMeanLuma: roundNullable(focusedScreenshotEvidence.meanLuma),
    focusedScale: round(focused.scale),
    focusedShadowLayerCount: focused.shadowLayerCount,
    idleScreenshotMeanLuma: roundNullable(idleScreenshotEvidence.meanLuma),
    idleScale: round(idle.scale),
    materialBackgroundAlphaDelta: round(
      focusedMaterial.backgroundAlpha - idleMaterial.backgroundAlpha
    ),
    materialFilterChanged: focusedMaterial.filter !== idleMaterial.filter,
    materialLumaDelta: round(focusedMaterial.backgroundLuma - idleMaterial.backgroundLuma),
    materialSelector: options.materialSelector ?? story.selector,
    materialShadowLayerDelta: focusedMaterial.shadowLayerCount - idleMaterial.shadowLayerCount,
    name,
    selector: story.selector,
    screenshots: {
      focusedContext: focusedContextScreenshotEvidence?.relativePath ?? null,
      focused: focusedScreenshotEvidence.relativePath,
      idle: idleScreenshotEvidence.relativePath
    },
    screenshotCaptureModes: {
      focusedContext: focusedContextScreenshotEvidence?.mode ?? null,
      focused: focusedScreenshotEvidence.mode,
      idle: idleScreenshotEvidence.mode
    },
    screenshotCaptureNotes: [
      idleScreenshotEvidence.note,
      focusedScreenshotEvidence.note,
      focusedContextScreenshotEvidence?.note
    ].filter(Boolean),
    storyId: story.id,
    transitionDurationMs: focused.maxTransitionDurationMs,
    widthDelta: round(focused.width - idle.width)
  });

  await page.close();
}

async function captureFocusScreenshot(page, locator, targetPath, label) {
  let mode = "element";
  let note;

  try {
    await locator.waitFor({ state: "visible", timeout: 10_000 });
    await locator.scrollIntoViewIfNeeded({ timeout: 5_000 });
    await page.waitForTimeout(80);
    await locator.screenshot({ path: targetPath, timeout: 10_000 });
  } catch (elementError) {
    try {
      await page.screenshot({ path: targetPath, fullPage: false, timeout: 10_000 });
      mode = "viewport-fallback";
      note = `${label} element screenshot failed: ${formatErrorMessage(elementError)}`;
    } catch (pageError) {
      return {
        maxLuma: null,
        meanLuma: null,
        minLuma: null,
        mode: "unavailable",
        note: `${label} element screenshot failed: ${formatErrorMessage(
          elementError
        )}; viewport screenshot failed: ${formatErrorMessage(pageError)}`,
        relativePath: null,
        sampledPixels: 0
      };
    }
  }

  const luma = await measureScreenshotLuma(page, targetPath);

  return {
    ...luma,
    mode,
    note,
    relativePath: path.relative(behaviorArtifactDir, targetPath)
  };
}

async function measureScreenshotLuma(page, targetPath) {
  const bytes = await fs.readFile(targetPath);
  const dataUrl = `data:image/png;base64,${bytes.toString("base64")}`;

  return page.evaluate(async (url) => {
    const response = await fetch(url);
    const bitmap = await createImageBitmap(await response.blob());
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
      bitmap.close?.();
      return { maxLuma: 0, meanLuma: 0, minLuma: 0, sampledPixels: 0 };
    }

    context.drawImage(bitmap, 0, 0);
    bitmap.close?.();

    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let blackPixels = 0;
    let darkPixels = 0;
    let maxLuma = 0;
    let minLuma = 255;
    let sampledPixels = 0;
    let totalLuma = 0;

    for (let index = 0; index < pixels.length; index += 4) {
      const alpha = pixels[index + 3] / 255;
      if (alpha < 0.2) {
        continue;
      }

      const luma = 0.2126 * pixels[index] + 0.7152 * pixels[index + 1] + 0.0722 * pixels[index + 2];
      if (luma < 118) {
        blackPixels += 1;
      }
      if (luma < 170) {
        darkPixels += 1;
      }
      maxLuma = Math.max(maxLuma, luma);
      minLuma = Math.min(minLuma, luma);
      sampledPixels += 1;
      totalLuma += luma;
    }

    if (sampledPixels === 0) {
      return { maxLuma: 0, meanLuma: 0, minLuma: 0, sampledPixels: 0 };
    }

    return {
      blackPixelRatio: blackPixels / sampledPixels,
      darkPixelRatio: darkPixels / sampledPixels,
      maxLuma,
      meanLuma: totalLuma / sampledPixels,
      minLuma,
      sampledPixels
    };
  }, dataUrl);
}

function safeFileSegment(value) {
  return String(value)
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function formatErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

async function writeFocusAuditResults() {
  const minimumFocusAuditCount = focusAuditTargets.length;

  if (focusAuditResults.length < minimumFocusAuditCount) {
    throw new Error(
      `focus audit coverage regressed: expected at least ${minimumFocusAuditCount} targets, got ${focusAuditResults.length}`
    );
  }

  await fs.writeFile(
    path.join(behaviorArtifactDir, "focus-material-audit.json"),
    `${JSON.stringify({ count: focusAuditResults.length, targets: focusAuditResults }, null, 2)}\n`
  );
}

async function verifyHoverAndActiveResponse() {
  for (const target of interactionAuditTargets) {
    await verifyPointerInteractionMaterial(target);
  }

  await fs.writeFile(
    path.join(behaviorArtifactDir, "pointer-interaction-audit.json"),
    `${JSON.stringify(
      { count: interactionAuditResults.length, targets: interactionAuditResults },
      null,
      2
    )}\n`
  );
}

async function verifyPointerInteractionMaterial(target) {
  const story = behaviorStories[target.name];
  const page = await openStory(story.id);
  const targetIndex = target.targetIndex ?? 0;
  const pointerLocator = page.locator(target.pointerSelector).nth(targetIndex);
  const stateLocator = page.locator(target.stateSelector).nth(target.stateIndex ?? targetIndex);
  const materialLocator = page
    .locator(target.materialSelector)
    .nth(
      target.materialIndex ?? (target.materialSelector === target.pointerSelector ? targetIndex : 0)
    );

  await pointerLocator.waitFor({ state: "visible", timeout: 10_000 });
  await stateLocator.waitFor({ state: "visible", timeout: 10_000 });
  await materialLocator.waitFor({ state: "visible", timeout: 10_000 });

  const idle = await readState(stateLocator);
  const idleMaterial = await readState(materialLocator);

  await pointerLocator.hover();
  await page.waitForTimeout(180);
  const hovered = await readState(stateLocator);
  const hoveredMaterial = await readState(materialLocator);
  assertNoPlasticInteractionChrome(hovered, `${target.name} hover`);
  assertNoPlasticInteractionChrome(hoveredMaterial, `${target.name} hover material`);
  assertMaterialResponse(idleMaterial, hoveredMaterial, `${target.name} hover material`);
  if (target.minimumHoverScale !== undefined) {
    assertGreaterOrEqual(hovered.scale, target.minimumHoverScale, `${target.name} hover scale`);
  }

  const box = await pointerLocator.boundingBox();
  if (!box) {
    throw new Error(`${target.name} active target is missing a bounding box`);
  }

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(220);
  const active = await readState(stateLocator);
  const activeMaterial = await readState(materialLocator);
  assertNoPlasticInteractionChrome(active, `${target.name} active`);
  assertNoPlasticInteractionChrome(activeMaterial, `${target.name} active material`);
  assertMaterialResponse(idleMaterial, activeMaterial, `${target.name} active material`);
  if (target.activeScaleMaxFromHover !== undefined) {
    assertLessThanOrEqual(
      active.scale,
      hovered.scale + target.activeScaleMaxFromHover,
      `${target.name} active scale relaxes`
    );
  }
  if (target.activeScaleDeltaFromHover !== undefined) {
    assertGreaterOrEqual(
      active.scale,
      hovered.scale + target.activeScaleDeltaFromHover,
      `${target.name} active scale grows from hover`
    );
  }
  if (target.activeScaleMin !== undefined) {
    assertGreaterOrEqual(active.scale, target.activeScaleMin, `${target.name} active scale`);
  }

  let dragged;
  let draggedMaterial;
  if (target.dragOffset) {
    await page.mouse.move(
      box.x + box.width / 2 + target.dragOffset.x,
      box.y + box.height / 2 + target.dragOffset.y,
      { steps: 8 }
    );
    await page.waitForTimeout(160);
    dragged = await readState(stateLocator);
    draggedMaterial = await readState(materialLocator);
    assertNoPlasticInteractionChrome(dragged, `${target.name} drag`);
    assertNoPlasticInteractionChrome(draggedMaterial, `${target.name} drag material`);
    assertMaterialResponse(idleMaterial, draggedMaterial, `${target.name} drag material`);
    if (target.minimumDragLeftDelta !== undefined) {
      assertGreaterThan(
        dragged.left,
        active.left + target.minimumDragLeftDelta,
        `${target.name} drag visual x movement`
      );
    }
  }

  await page.mouse.up();

  interactionAuditResults.push({
    activeMaterialAlphaDelta: round(activeMaterial.backgroundAlpha - idleMaterial.backgroundAlpha),
    activeMaterialFilterChanged: activeMaterial.filter !== idleMaterial.filter,
    activeMaterialShadowLayerDelta: activeMaterial.shadowLayerCount - idleMaterial.shadowLayerCount,
    activeScale: round(active.scale),
    dragLeftDelta: dragged ? round(dragged.left - active.left) : null,
    dragMaterialAlphaDelta: draggedMaterial
      ? round(draggedMaterial.backgroundAlpha - idleMaterial.backgroundAlpha)
      : null,
    dragMaterialFilterChanged: draggedMaterial
      ? draggedMaterial.filter !== idleMaterial.filter
      : null,
    dragMaterialShadowLayerDelta: draggedMaterial
      ? draggedMaterial.shadowLayerCount - idleMaterial.shadowLayerCount
      : null,
    hoverMaterialAlphaDelta: round(hoveredMaterial.backgroundAlpha - idleMaterial.backgroundAlpha),
    hoverMaterialFilterChanged: hoveredMaterial.filter !== idleMaterial.filter,
    hoverMaterialShadowLayerDelta: hoveredMaterial.shadowLayerCount - idleMaterial.shadowLayerCount,
    hoverScale: round(hovered.scale),
    idleScale: round(idle.scale),
    materialSelector: target.materialSelector,
    name: target.name,
    pointerSelector: target.pointerSelector,
    stateSelector: target.stateSelector,
    storyId: story.id
  });

  await page.close();
}

async function verifySearchboxKubeImageBackground() {
  const focusPage = await openStory(behaviorStories.searchbox.id);
  const focusFrame = focusPage.locator('[data-lg-reference-frame="searchbox-focus"]').first();
  await focusFrame.waitFor({ state: "visible", timeout: 10_000 });
  const focusBackground = await readBackgroundImage(focusFrame);
  assertIncludes(focusBackground, kubeSearchboxImageId, "searchbox focus photo background");
  assertIncludes(
    focusBackground,
    kubeSearchboxDemoBackground,
    "searchbox focus photo background URL"
  );
  await waitForImageRequest(focusPage, kubeSearchboxImageId);
  await focusFrame.screenshot({
    path: path.join(behaviorArtifactDir, "searchbox-kube-photo-focus.png")
  });
  await focusPage.close();

  const referencePage = await openStory("liquid-glass-liquidsearchbox--kube-reference");
  const referenceFrame = referencePage.locator('[data-lg-reference-frame="searchbox"]').first();
  await referenceFrame.waitFor({ state: "visible", timeout: 10_000 });
  const idleBackground = await readBackgroundImage(referenceFrame);
  if (idleBackground.includes(kubeSearchboxImageId)) {
    throw new Error("searchbox Kube reference should keep the grid background before opt-in");
  }

  await referencePage.getByRole("checkbox", { name: /Use image background/i }).check();
  await referencePage.waitForTimeout(240);
  const checkedBackground = await readBackgroundImage(referenceFrame);
  assertIncludes(
    checkedBackground,
    kubeSearchboxDemoBackground,
    "searchbox checked Kube image background URL"
  );
  await waitForImageRequest(referencePage, kubeSearchboxImageId);
  await referenceFrame.screenshot({
    path: path.join(behaviorArtifactDir, "searchbox-kube-photo-checked.png")
  });
  await referencePage.close();
}

async function verifyCommandRovingFocusMaterial() {
  const page = await openStory(behaviorStories.command.id);
  const input = page.locator(behaviorStories.command.focusSelector).first();
  await input.waitFor({ state: "visible", timeout: 10_000 });
  await input.focus();
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(180);

  const selected = page.locator(behaviorStories.command.selector).first();
  await selected.waitFor({ state: "visible", timeout: 10_000 });
  const focused = await readState(selected);

  assertNoPlasticFocusChrome(focused, "command roving focus");
  assertGreaterOrEqual(focused.backgroundLuma, 150, "command roving focus material luma");
  assertGreaterThan(focused.shadowLayerCount, 0, "command roving focus shadow layers");
  assertEqual(focused.textShadow, "none", "command roving focus text shadow");
  assertGreaterOrEqual(focused.scale, 1.01, "command roving focus scale");

  await page.close();
}

async function readBackgroundImage(locator) {
  return locator.evaluate((element) => getComputedStyle(element).backgroundImage);
}

async function waitForImageRequest(page, imageId) {
  await page
    .waitForFunction(
      (resourceId) =>
        performance.getEntriesByType("resource").some((entry) => entry.name.includes(resourceId)),
      imageId,
      { timeout: 5_000 }
    )
    .catch(() => undefined);
}

async function verifyDraggableLensPlayground() {
  const page = await openStory(behaviorStories.draggableLens.id, {}, { width: 900, height: 680 });
  const locator = page.locator(behaviorStories.draggableLens.selector).first();
  const boardLocator = page.locator("[data-lg-lens-board]").first();
  const lensImage = page.getByAltText("Green frog on a red post").first();
  let framesPromise;

  try {
    await boardLocator.waitFor({ state: "visible", timeout: 10_000 });
    await locator.waitFor({ state: "visible", timeout: 10_000 });
    await lensImage.waitFor({ state: "visible", timeout: 10_000 });
    assertIncludes(
      await lensImage.getAttribute("src"),
      kubeLensDemoImage,
      "draggable lens Kube image URL"
    );
    await waitForImageRequest(page, kubeLensImageId);
    await boardLocator.screenshot({
      path: path.join(behaviorArtifactDir, "draggable-lens-board-idle.png")
    });
    await locator.screenshot({
      path: path.join(behaviorArtifactDir, "draggable-lens-idle.png")
    });
    const idle = await readDraggableLensState(locator);
    const box = await locator.boundingBox();

    if (!box) {
      throw new Error("draggable lens target is missing a bounding box");
    }

    await page.mouse.move(box.x + box.width * 0.42, box.y + box.height * 0.54);
    framesPromise = recordAnimationFrames(page, behaviorStories.draggableLens.selector, 1_400);
    await page.mouse.down();
    await page.waitForTimeout(180);
    await boardLocator.screenshot({
      path: path.join(behaviorArtifactDir, "draggable-lens-board-pressed.png")
    });
    await locator.screenshot({
      path: path.join(behaviorArtifactDir, "draggable-lens-pressed.png")
    });
    const pressed = await readDraggableLensState(locator);

    assertEqual(pressed.dropletState, "pressed", "draggable lens pressed state");
    assertGreaterThan(pressed.scaleX, 1.04, "draggable lens water-drop scaleX");
    assertGreaterThan(pressed.scaleY, idle.scaleY + 0.12, "draggable lens water-drop scaleY");
    assertLessThan(pressed.scaleY, 1, "draggable lens pressed scaleY stays optically flattened");
    assertIncludes(pressed.dropletOriginX, "%", "draggable lens droplet origin x");
    assertIncludes(pressed.dropletOriginY, "%", "draggable lens droplet origin y");

    await page.mouse.move(box.x + box.width * 0.42 + 132, box.y + box.height * 0.54 + 76, {
      steps: 8
    });
    await page.waitForTimeout(80);
    await boardLocator.screenshot({
      path: path.join(behaviorArtifactDir, "draggable-lens-board-dragged.png")
    });
    await locator.screenshot({
      path: path.join(behaviorArtifactDir, "draggable-lens-dragged.png")
    });
    const dragged = await readDraggableLensState(locator);

    assertEqual(dragged.draggingState, "true", "draggable lens dragging state");
    assertGreaterThan(dragged.lensX, idle.lensX + 100, "draggable lens x movement");
    assertGreaterThan(dragged.lensY, idle.lensY + 56, "draggable lens y movement");
    assertGreaterThan(dragged.left, idle.left + 80, "draggable lens visual x movement");
    assertGreaterThan(dragged.top, idle.top + 40, "draggable lens visual y movement");
    assertLessThanOrEqual(dragged.scaleX, pressed.scaleX - 0.06, "dragged lens narrows vs press");
    assertGreaterThan(dragged.scaleY, pressed.scaleY + 0.03, "dragged lens grows taller vs press");
    assertGreaterThan(dragged.scaleY, idle.scaleY + 0.16, "dragged lens remains water-drop tall");

    await page.mouse.up();
    await page.waitForTimeout(320);
    await boardLocator.screenshot({
      path: path.join(behaviorArtifactDir, "draggable-lens-board-released.png")
    });
    await locator.screenshot({
      path: path.join(behaviorArtifactDir, "draggable-lens-released.png")
    });
    const frames = await framesPromise;
    framesPromise = undefined;
    const frameSummary = summarizeDraggableLensFrames(frames);
    await fs.writeFile(
      path.join(behaviorArtifactDir, "draggable-lens-frames.json"),
      `${JSON.stringify({ frames, summary: frameSummary }, null, 2)}\n`
    );

    assertGreaterOrEqual(frameSummary.frameCount, 12, "draggable lens animation frame count");
    assertGreaterThan(frameSummary.pressedFrameCount, 2, "draggable lens real pressed frames");
    assertGreaterThan(frameSummary.draggingFrameCount, 2, "draggable lens real dragging frames");
    assertGreaterThan(frameSummary.releasedFrameCount, 2, "draggable lens real release frames");
    assertGreaterThan(frameSummary.scaleXRange, 0.035, "draggable lens animated scaleX range");
    assertGreaterThan(frameSummary.scaleYRange, 0.025, "draggable lens animated scaleY range");
    assertGreaterThan(frameSummary.leftRange, 80, "draggable lens animated x travel");
    assertGreaterThan(frameSummary.topRange, 40, "draggable lens animated y travel");
    assertGreaterThan(frameSummary.transformVariantCount, 3, "draggable lens transform variants");
    assertApproxEqual(frameSummary.finalScaleX, 1, 0.012, "draggable lens final frame scaleX");
    assertApproxEqual(frameSummary.finalScaleY, 0.8, 0.012, "draggable lens final frame scaleY");

    const released = await readDraggableLensState(locator);
    assertEqual(released.dropletState, "idle", "draggable lens released state");
    assertApproxEqual(released.scaleX, 1, 0.01, "draggable lens released scaleX");
    assertApproxEqual(released.scaleY, 0.8, 0.01, "draggable lens released scaleY");
  } finally {
    await framesPromise?.catch(() => []);
    await page.close();
  }
}

function readKubeReferenceAsset(name) {
  const match = kubeAssetSource.match(new RegExp(`${name}:\\s*"([^"]+)"`));

  if (!match?.[1]) {
    throw new Error(`Missing Kube reference asset ${name}`);
  }

  return match[1];
}

async function recordAnimationFrames(page, selector, durationMs) {
  return page.evaluate(
    ({ frameSelector, recordDurationMs }) =>
      new Promise((resolve) => {
        const startedAt = performance.now();
        const frames = [];

        const sample = () => {
          const element = document.querySelector(frameSelector);
          if (!element) {
            resolve(frames);
            return;
          }

          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          const scale = matrixScaleAxes(style.transform);
          frames.push({
            draggingState: element.getAttribute("data-liquid-dragging") ?? "false",
            dropletState: element.getAttribute("data-liquid-droplet") ?? "idle",
            left: round(rect.left),
            scaleX: round(scale.scaleX),
            scaleY: round(scale.scaleY),
            time: round(performance.now() - startedAt),
            top: round(rect.top),
            transform: style.transform
          });

          if (performance.now() - startedAt >= recordDurationMs) {
            resolve(frames);
            return;
          }

          requestAnimationFrame(sample);
        };

        requestAnimationFrame(sample);

        function matrixScaleAxes(transform) {
          if (transform === "none") {
            return { scaleX: 1, scaleY: 1 };
          }

          const matrix = transform
            .match(/matrix\(([^)]+)\)/)?.[1]
            ?.split(/,\s*/)
            .map(Number);
          if (!matrix || matrix.length < 4) {
            return { scaleX: 1, scaleY: 1 };
          }

          return {
            scaleX: Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]),
            scaleY: Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3])
          };
        }

        function round(value) {
          return Math.round(value * 1000) / 1000;
        }
      }),
    { frameSelector: selector, recordDurationMs: durationMs }
  );
}

function summarizeDraggableLensFrames(frames) {
  const scaleXs = frames.map((frame) => frame.scaleX);
  const scaleYs = frames.map((frame) => frame.scaleY);
  const lefts = frames.map((frame) => frame.left);
  const tops = frames.map((frame) => frame.top);
  const transforms = new Set(frames.map((frame) => frame.transform));

  return {
    draggingFrameCount: frames.filter((frame) => frame.draggingState === "true").length,
    finalScaleX: frames.at(-1)?.scaleX ?? 1,
    finalScaleY: frames.at(-1)?.scaleY ?? 1,
    frameCount: frames.length,
    leftRange: range(lefts),
    pressedFrameCount: frames.filter((frame) => frame.dropletState === "pressed").length,
    releasedFrameCount: frames.filter((frame) => frame.dropletState === "idle").length,
    scaleXRange: range(scaleXs),
    scaleYRange: range(scaleYs),
    topRange: range(tops),
    transformVariantCount: transforms.size
  };
}

function range(values) {
  if (values.length === 0) {
    return 0;
  }

  return Math.max(...values) - Math.min(...values);
}

async function verifyReducedMotionRemovesElasticFocus() {
  const story = behaviorStories.tabs;
  const page = await openStory(story.id, { reducedMotion: "reduce" });
  const locator = page.locator(story.selector).first();
  await locator.waitFor({ state: "visible", timeout: 10_000 });
  await keyboardFocusVisible(page, story.selector);
  await page.waitForTimeout(120);
  const focused = await readState(locator);

  assertApproxEqual(focused.scale, 1, 0.001, "reduced motion focus scale");
  await page.close();
}

async function keyboardFocusVisible(page, selector) {
  for (let attempt = 0; attempt < 32; attempt += 1) {
    await page.keyboard.press("Tab");
    const isFocused = await page.evaluate((focusSelector) => {
      const activeElement = document.activeElement;
      return Boolean(
        activeElement?.matches(focusSelector) && activeElement.matches(":focus-visible")
      );
    }, selector);

    if (isFocused) {
      return;
    }
  }

  throw new Error(`${selector}: unable to reach focus-visible through keyboard navigation`);
}

async function openStory(id, media = {}, viewport = { width: 900, height: 520 }) {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const page = await browser.newPage({ viewport });
    await page.emulateMedia(media);

    try {
      await page.goto(`http://127.0.0.1:${port}/iframe.html?id=${id}&viewMode=story`, {
        waitUntil: "networkidle",
        timeout: 20_000
      });
      await waitForStoryReady(page, id);
      return page;
    } catch (error) {
      lastError = error;
      await page.close().catch(() => {});
    }
  }

  throw lastError;
}

async function waitForStoryReady(page, id) {
  try {
    await page.waitForFunction(
      () => {
        const root = document.querySelector("#storybook-root");
        const bodyText = document.body.textContent ?? "";
        return Boolean(root?.children.length && !bodyText.includes("Preparing story"));
      },
      undefined,
      { timeout: 20_000 }
    );
  } catch (error) {
    const diagnostic = await page.evaluate(() => {
      const root = document.querySelector("#storybook-root");
      return {
        bodyText: (document.body.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 240),
        rootChildCount: root?.children.length ?? 0,
        surfaceCount: document.querySelectorAll(".lg-surface").length,
        title: document.title
      };
    });

    throw new Error(
      `${id}: Storybook story did not become ready: ${JSON.stringify(diagnostic)} (${
        error instanceof Error ? error.message : String(error)
      })`
    );
  }
}

async function readDraggableLensState(locator) {
  return locator.evaluate((element) => {
    const view = element.ownerDocument.defaultView;
    if (!view) {
      throw new Error("Missing document view");
    }

    const rect = element.getBoundingClientRect();
    const style = view.getComputedStyle(element);
    const scale = matrixScaleAxes(style.transform);

    return {
      draggingState: element.getAttribute("data-liquid-dragging"),
      dropletState: element.getAttribute("data-liquid-droplet"),
      dropletOriginX: style.getPropertyValue("--lg-demo-droplet-origin-x"),
      dropletOriginY: style.getPropertyValue("--lg-demo-droplet-origin-y"),
      lensX: Number(element.getAttribute("data-lens-x") ?? 0),
      lensY: Number(element.getAttribute("data-lens-y") ?? 0),
      left: rect.left,
      scaleX: scale.scaleX,
      scaleY: scale.scaleY,
      top: rect.top,
      transform: style.transform,
      transformOrigin: style.transformOrigin
    };

    function matrixScaleAxes(transform) {
      if (transform === "none") {
        return { scaleX: 1, scaleY: 1 };
      }

      const matrix = transform
        .match(/matrix\(([^)]+)\)/)?.[1]
        ?.split(/,\s*/)
        .map(Number);
      if (!matrix || matrix.length < 4) {
        return { scaleX: 1, scaleY: 1 };
      }

      return {
        scaleX: Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]),
        scaleY: Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3])
      };
    }
  });
}

async function readState(locator) {
  return locator.evaluate((element) => {
    const view = element.ownerDocument.defaultView;
    if (!view) {
      throw new Error("Missing document view");
    }

    const style = view.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    const scale = matrixScale(style.transform);

    return {
      backgroundAlpha: alphaOf(style.backgroundColor),
      backgroundLuma: lumaOf(style.backgroundColor),
      borderAlpha: alphaOf(style.borderColor),
      borderLuma: lumaOf(style.borderColor),
      borderColor: style.borderColor,
      borderStyle: style.borderStyle,
      borderWidthPx: parseFloat(style.borderTopWidth) || 0,
      boxShadow: style.boxShadow,
      filter: style.filter,
      foregroundTextShadowCount: countForegroundTextShadows(element),
      hardRingLayerCount: countCheapHardRingLayers(style.boxShadow),
      height: rect.height,
      left: rect.left,
      outlineColor: style.outlineColor,
      outlineStyle: style.outlineStyle,
      scale,
      shadowLayerCount:
        style.boxShadow === "none" ? 0 : style.boxShadow.split(/,(?![^()]*\))/).length,
      textShadow: style.textShadow,
      transitionProperty: style.transitionProperty,
      maxTransitionDurationMs: maxTransitionDurationMs(style.transitionDuration),
      transform: style.transform,
      width: rect.width
    };

    function countForegroundTextShadows(root) {
      return [root, ...root.querySelectorAll("*")].filter((node) => {
        const text = node.textContent?.trim() ?? "";
        if (text.length === 0) {
          return false;
        }

        return view.getComputedStyle(node).textShadow !== "none";
      }).length;
    }

    function alphaOf(color) {
      const parsed = parseColor(color);
      return parsed.alpha;
    }

    function lumaOf(color) {
      const parsed = parseColor(color);
      return 0.2126 * parsed.red + 0.7152 * parsed.green + 0.0722 * parsed.blue;
    }

    function countCheapHardRingLayers(boxShadow) {
      if (boxShadow === "none") {
        return 0;
      }

      return boxShadow.split(/,(?![^()]*\))/).filter((layer) => {
        if (layer.includes("inset")) {
          return false;
        }

        if (!/\b0px 0px 0px 1px\b/.test(layer)) {
          return false;
        }

        const color = parseColor(layer);
        const luma = 0.2126 * color.red + 0.7152 * color.green + 0.0722 * color.blue;
        return color.alpha >= 0.3 && (luma <= 20 || luma >= 235);
      }).length;
    }

    function parseColor(color) {
      const srgb = color.match(
        /color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/
      );
      if (srgb) {
        return {
          alpha: srgb[4] === undefined ? 1 : parseCssNumber(srgb[4]),
          blue: Number(srgb[3]) * 255,
          green: Number(srgb[2]) * 255,
          red: Number(srgb[1]) * 255
        };
      }

      const oklab = color.match(
        /oklab\(\s*([-\d.]+%?)\s+[-\d.]+%?\s+[-\d.]+%?(?:\s*\/\s*([-\d.]+%?))?\)/
      );
      if (oklab) {
        const lightness = parseCssNumber(oklab[1] ?? "0") * 255;
        return {
          alpha: oklab[2] === undefined ? 1 : parseCssNumber(oklab[2]),
          blue: lightness,
          green: lightness,
          red: lightness
        };
      }

      const match = color.match(/rgba?\(([^)]+)\)/);
      if (!match) {
        return { alpha: 1, blue: 0, green: 0, red: 0 };
      }

      const parts = match[1]
        .split(/[,\s/]+/)
        .filter(Boolean)
        .map(Number);

      return {
        alpha: parts.length >= 4 ? parts[3] : 1,
        blue: parts[2] ?? 0,
        green: parts[1] ?? 0,
        red: parts[0] ?? 0
      };
    }

    function parseCssNumber(value) {
      return value.endsWith("%") ? Number(value.slice(0, -1)) / 100 : Number(value);
    }

    function matrixScale(transform) {
      if (transform === "none") {
        return 1;
      }

      const values = transform
        .match(/matrix\(([^)]+)\)/)?.[1]
        ?.split(/,\s*/)
        .map(Number);
      if (!values || values.length < 4) {
        return 1;
      }

      return Math.sqrt(values[0] * values[0] + values[1] * values[1]);
    }

    function maxTransitionDurationMs(durationList) {
      return Math.max(
        ...durationList.split(",").map((duration) => {
          const value = duration.trim();
          if (value.endsWith("ms")) {
            return Number(value.slice(0, -2));
          }
          if (value.endsWith("s")) {
            return Number(value.slice(0, -1)) * 1000;
          }
          return Number(value) || 0;
        })
      );
    }
  });
}

function assertNoPlasticFocusChrome(state, label) {
  assertNoPlasticInteractionChrome(state, label, "focus");
}

function assertNoPlasticInteractionChrome(state, label, stateName = "interaction") {
  const visibleBorder =
    state.borderWidthPx > 0 && state.borderStyle !== "none" && state.borderStyle !== "hidden";
  const visibleOutline = state.outlineStyle !== "none";
  const focusText = [
    visibleBorder ? state.borderColor : "",
    state.boxShadow,
    visibleOutline ? state.outlineColor : ""
  ].join(" ");

  if (focusText.includes("10, 132, 255") || focusText.includes("0, 95, 204")) {
    throw new Error(`${label}: ${stateName} style still uses system-blue plastic ring`);
  }

  if (state.hardRingLayerCount > 0) {
    throw new Error(`${label}: ${stateName} style still uses a hard white/black 1px ring`);
  }

  if (
    visibleBorder &&
    state.borderAlpha >= 0.34 &&
    (state.borderLuma <= 20 || state.borderLuma >= 235)
  ) {
    throw new Error(
      `${label}: ${stateName} border is still a high-contrast hard edge (${state.borderColor}, alpha=${state.borderAlpha}, luma=${state.borderLuma})`
    );
  }
}

function assertMaterialResponse(idle, focused, label) {
  const backgroundChanged =
    Math.abs(focused.backgroundAlpha - idle.backgroundAlpha) >= 0.02 ||
    Math.abs(focused.backgroundLuma - idle.backgroundLuma) >= 3;
  const shadowChanged = focused.boxShadow !== idle.boxShadow && focused.shadowLayerCount > 0;
  const filterChanged = focused.filter !== idle.filter && focused.filter !== "none";

  if (!backgroundChanged && !shadowChanged && !filterChanged) {
    throw new Error(
      `${label}: expected frosted material response through background, shadow, or filter change`
    );
  }
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(
      `${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
    );
  }
}

function assertNotEqual(actual, expected, label) {
  if (actual === expected) {
    throw new Error(`${label}: expected ${JSON.stringify(actual)} to change`);
  }
}

function assertGreaterThan(actual, expected, label) {
  if (!(actual > expected)) {
    throw new Error(`${label}: expected ${actual} > ${expected}`);
  }
}

function assertGreaterOrEqual(actual, expected, label) {
  if (!(actual >= expected)) {
    throw new Error(`${label}: expected ${actual} >= ${expected}`);
  }
}

function assertLessThan(actual, expected, label) {
  if (!(actual < expected)) {
    throw new Error(`${label}: expected ${actual} < ${expected}`);
  }
}

function assertIncludes(actual, expected, label) {
  if (!String(actual).includes(expected)) {
    throw new Error(`${label}: expected ${JSON.stringify(actual)} to include ${expected}`);
  }
}

function assertLessThanOrEqual(actual, expected, label) {
  if (!(actual <= expected)) {
    throw new Error(`${label}: expected ${actual} <= ${expected}`);
  }
}

function assertApproxEqual(actual, expected, tolerance, label) {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`${label}: expected ${actual} ~= ${expected} within ${tolerance}`);
  }
}

function round(value) {
  return Math.round(value * 1000) / 1000;
}

function roundNullable(value) {
  return typeof value === "number" ? round(value) : null;
}

function contentType(filePath) {
  if (filePath.endsWith(".html")) {
    return "text/html; charset=utf-8";
  }

  if (filePath.endsWith(".js")) {
    return "text/javascript; charset=utf-8";
  }

  if (filePath.endsWith(".css")) {
    return "text/css; charset=utf-8";
  }

  if (filePath.endsWith(".json")) {
    return "application/json; charset=utf-8";
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
