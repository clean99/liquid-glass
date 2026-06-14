import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  estimateMaximumDisplacement,
  defaultRefractionByIntensity,
  resolveFilterMapGeometry,
  resolveLensReferencePipeline,
  resolvePhysicalRefractionRadius,
  referenceLensDisplacementRefraction,
  resolveRefractiveOptions,
  resolveRefractionRadius,
  type LiquidIntensity,
  type RefractiveOptions
} from "../src";

const styles = fs.readFileSync(path.resolve("src/styles/styles.css"), "utf8");
const tokens = fs.readFileSync(path.resolve("src/styles/tokens.css"), "utf8");
const storyFixture = fs.readFileSync(path.resolve("stories/story-fixtures.tsx"), "utf8");
const lensStorySource = fs.readFileSync(path.resolve("stories/LiquidLens.stories.tsx"), "utf8");
const kubeReferenceAssetsSource = fs.readFileSync(
  path.resolve("stories/kube-reference-assets.ts"),
  "utf8"
);
const kubeReferenceAssetManifest = JSON.parse(
  fs.readFileSync(path.resolve("stories/assets/kube/manifest.json"), "utf8")
) as KubeReferenceAssetManifest;
const searchboxStorySource = fs.readFileSync(
  path.resolve("stories/LiquidSearchBox.stories.tsx"),
  "utf8"
);
const musicPlayerStorySource = fs.readFileSync(
  path.resolve("stories/LiquidMusicPlayerBar.stories.tsx"),
  "utf8"
);
const storybookMainSource = fs.readFileSync(path.resolve(".storybook/main.ts"), "utf8");
const storybookPreviewSource = fs.readFileSync(path.resolve(".storybook/preview.ts"), "utf8");
const storybookKubeFontSource = fs.readFileSync(
  path.resolve(".storybook/kube-reference-fonts.css"),
  "utf8"
);
const switchStorySource = fs.readFileSync(path.resolve("stories/LiquidSwitch.stories.tsx"), "utf8");
const sliderStorySource = fs.readFileSync(path.resolve("stories/LiquidSlider.stories.tsx"), "utf8");
const packageJson = JSON.parse(fs.readFileSync(path.resolve("package.json"), "utf8")) as {
  scripts: Record<string, string>;
};
const lensSource = fs.readFileSync(path.resolve("src/components/LiquidLens.tsx"), "utf8");
const lensReferenceEngineSource = fs.readFileSync(
  path.resolve("src/engines/lens-reference-engine.tsx"),
  "utf8"
);
const refractiveEngineSource = fs.readFileSync(
  path.resolve("src/engines/refractive-engine.tsx"),
  "utf8"
);
const displacementMapSource = fs.readFileSync(
  path.resolve("src/utils/displacement-map.ts"),
  "utf8"
);
const lensPipelineSource = fs.readFileSync(path.resolve("src/utils/lens-pipeline.ts"), "utf8");
const kubeReferenceCompareSource = fs.readFileSync(
  path.resolve("scripts/compare-kube-reference.mjs"),
  "utf8"
);
const kubeDemoAssetVerifierSource = fs.readFileSync(
  path.resolve("scripts/verify-kube-demo-assets.mjs"),
  "utf8"
);
const verifyLiquidBehaviorSource = fs.readFileSync(
  path.resolve("scripts/verify-liquid-behavior.mjs"),
  "utf8"
);
const verifyEnhancedStorybookSource = fs.readFileSync(
  path.resolve("scripts/verify-enhanced-storybook.mjs"),
  "utf8"
);
const surfaceSource = fs.readFileSync(path.resolve("src/components/LiquidSurface.tsx"), "utf8");

const intensities: LiquidIntensity[] = ["subtle", "medium", "strong"];
type DefaultRefractiveOptions = Omit<RefractiveOptions, "radius">;
type KubeReferenceAssetManifest = {
  assets: Record<
    string,
    {
      file: string;
      height: number;
      role: string;
      sha256: string;
      sourceUrl: string;
      width: number;
    }
  >;
  cssOnlyBackgroundAssets: Record<
    string,
    {
      backgroundIncludes: string[];
      backgroundPosition: string;
      backgroundSize: string;
      file: string;
      height: number;
      role: string;
      sha256: string;
      sourceSections: string[];
      sourceUrl: string;
      targetIds: string[];
      width: number;
    }
  >;
  musicAlbumArtAssets: Array<{
    file: string;
    height: number;
    role: string;
    sha256: string;
    sourceUrl: string;
    width: number;
  }>;
  filterMapAssets: Record<
    string,
    {
      file: string;
      height: number;
      role: string;
      sha256: string;
      sourceUrl: string;
      width: number;
    }
  >;
  fontAssets: Record<
    string,
    {
      bytes: number;
      file: string;
      role: string;
      sha256: string;
      sourceUrl: string;
    }
  >;
  generatedFallbackAssets: Array<{ sourceUrl?: string }>;
  captureMethod: string;
  observedOn: string;
  sourcePage: string;
};

const expectedKubeDemoImageAssets = {
  lensDemoBackground: {
    file: "lens-demo-background.jpg",
    height: 1600,
    sourceUrl:
      "https://images.unsplash.com/photo-1688494930098-e88c53c26e3a?auto=format&q=80&fit=crop&w=1400&h=1600&crop=focalpoint&fp-x=0.3&fp-y=0.5&fp-z=1",
    width: 1400
  },
  lensDemoInlineImage: {
    file: "lens-demo-inline-image.jpg",
    height: 700,
    sourceUrl:
      "https://images.unsplash.com/photo-1688494930098-e88c53c26e3a?auto=format&q=80&fit=crop&w=400&h=700&crop=focalpoint&fp-x=0.3&fp-y=0.6&fp-z=1.9",
    width: 400
  },
  lensDemoImage: {
    file: "lens-demo-image.jpg",
    height: 1200,
    sourceUrl:
      "https://images.unsplash.com/photo-1579380656108-f98e4df8ea62?q=80&w=800&auto=format&fit=crop",
    width: 800
  },
  searchboxDemoBackground: {
    file: "searchbox-demo-background.jpg",
    height: 2399,
    sourceUrl:
      "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?q=80&w=1600&auto=format&fit=crop",
    width: 1600
  }
} as const;

const expectedKubeCssOnlyBackgroundAssets = {
  controlGridBackground: {
    backgroundIncludes: ["linear-gradient", "oklab(0 0 0 / 0.05)", "radial-gradient"],
    backgroundPosition: "12px 12px, 12px 12px, 0px 0px",
    backgroundSize: "24px 24px, 24px 24px, 100% 100%",
    file: "reference-captures/control-grid-background.png",
    height: 313,
    sha256: "43aa5bcdbb2eba8cf84bd2dd133e942caf08b223c67d644cfdc3e0cd365b914e",
    sourceUrl: "https://kube.io/blog/liquid-glass-css-svg/",
    targetIds: ["searchbox", "switch", "slider"],
    width: 706
  }
} as const;

describe("Liquid Glass physics contract", () => {
  it("keeps default optical parameters in a plausible glass range", () => {
    for (const intensity of intensities) {
      const options = defaultRefractionByIntensity[intensity];

      expect(options.blur).toBeGreaterThanOrEqual(0);
      expect(options.blur).toBeLessThanOrEqual(1);
      expect(options.glassThickness).toBeGreaterThan(0);
      expect(options.glassThickness).toBeLessThanOrEqual(128);
      expect(options.bezelWidth).toBeGreaterThan(0);
      expect(options.bezelWidth).toBeLessThanOrEqual(24);
      expect(options.refractiveIndex).toBeGreaterThanOrEqual(1.3);
      expect(options.refractiveIndex).toBeLessThanOrEqual(1.6);
      expect(options.specularOpacity).toBeGreaterThanOrEqual(0);
      expect(options.specularOpacity).toBeLessThanOrEqual(0.6);
      expect(options.specularAngle).toBeGreaterThanOrEqual(0);
      expect(options.specularAngle).toBeLessThanOrEqual(Math.PI / 2);
    }
  });

  it("makes optical intensity monotonic without increasing blur into frosted glass", () => {
    const values = intensities.map((intensity) => defaultRefractionByIntensity[intensity]);

    expect(isMonotonic(values, "glassThickness")).toBe(true);
    expect(isMonotonic(values, "bezelWidth")).toBe(true);
    expect(isMonotonic(values, "refractiveIndex")).toBe(true);
    expect(isMonotonic(values, "specularOpacity")).toBe(true);

    const blurDelta =
      (defaultRefractionByIntensity.strong.blur ?? 0) -
      (defaultRefractionByIntensity.subtle.blur ?? 0);
    expect(blurDelta).toBeLessThanOrEqual(0.35);
  });

  it("clamps filter radius to the bounded SVG displacement range", () => {
    expect(resolveRefractionRadius(-20)).toBe(1);
    expect(resolveRefractionRadius(18)).toBe(18);
    expect(resolveRefractionRadius(999)).toBe(96);
    expect(
      resolveRefractiveOptions({
        intensity: "strong",
        radius: 999,
        refraction: { radius: 144 }
      }).radius
    ).toBe(96);
  });

  it("does not allow optical radius to exceed the physical cap of a measured surface", () => {
    expect(resolvePhysicalRefractionRadius({ height: 54, radius: 999, width: 357 })).toBe(27);
    expect(resolvePhysicalRefractionRadius({ height: 84, radius: 96, width: 720 })).toBe(42);
  });

  it("allows explicit lens overscan without weakening the default physical cap", () => {
    expect(
      resolveRefractiveOptions({
        bounds: { height: 120, width: 210 },
        intensity: "strong",
        radius: 75
      }).radius
    ).toBe(60);

    expect(
      resolveRefractiveOptions({
        allowOversizedRadius: true,
        bounds: { height: 120, width: 210 },
        intensity: "strong",
        radius: 75
      }).radius
    ).toBe(75);
    expect(lensSource).toContain("allowOversizedRefractionRadius = true");
  });

  it("keeps the lens thickness aligned with the kube second-pass displacement scale", () => {
    const pipeline = resolveLensReferencePipeline();

    expect(pipeline.stages).toHaveLength(2);
    expect(pipeline.chromaticAberration).toMatchObject({
      active: false,
      amount: 0
    });
    expect(pipeline.stages[0]).toMatchObject({
      bezelWidth: 0,
      glassThickness: referenceLensDisplacementRefraction.magnificationGlassThickness,
      name: "magnification",
      refractiveIndex: 1.5
    });
    expect(pipeline.stages[0]?.scale).toBeCloseTo(24, 6);
    expect(pipeline.stages[1]).toMatchObject({
      bezelWidth: 18,
      glassThickness: 88,
      name: "displacement",
      refractiveIndex: 1.5
    });
    expect(pipeline.stages[1]?.scale).toBeCloseTo(98.24713343067756, 6);
    expect(
      estimateMaximumDisplacement({
        bezelWidth: 18,
        glassThickness: 88,
        refractiveIndex: 1.5
      })
    ).toBeCloseTo(pipeline.stages[1]?.scale ?? 0, 6);
    expect(lensPipelineSource).toContain("glassThickness: 88");
    expect(lensPipelineSource).toContain("referenceLensMagnificationGlassThickness");
    expect(lensPipelineSource).toContain("21.496810403025258");
    expect(lensPipelineSource).toContain("refractiveIndex: 1.5");
    expect(lensStorySource).toContain(
      "referenceLensDisplacementRefraction.magnificationGlassThickness"
    );
    expect(lensSource).toContain("referenceLensDisplacementRefraction");
    expect(lensSource).toContain('engine = "refractive"');
    expect(lensSource).toContain('engine === "reference" ? "reference-lens" : "refractive"');
    expect(lensSource).not.toContain("defaultLensMagnificationRefraction");
    expect(lensSource).not.toContain('className="lg-lens__core"');
  });

  it("keeps chromatic aberration opt-in for the reference lens pipeline", () => {
    const pipeline = resolveLensReferencePipeline({ chromaticAberration: 1 });

    expect(pipeline.chromaticAberration).toMatchObject({
      active: true,
      amount: 1.5,
      blue: { x: -1.5, y: 0 },
      green: { x: 0, y: 0 },
      red: { x: 1.5, y: 0 }
    });
    expect(lensReferenceEngineSource).toContain("pipeline.chromaticAberration.active");
    expect(lensReferenceEngineSource).toContain("red_displaced");
    expect(lensReferenceEngineSource).toContain("green_channel");
    expect(lensReferenceEngineSource).toContain("blue_displaced");
    expect(lensStorySource).not.toContain("chromaticAberration");
  });

  it("matches the Kube pressed lens filter strength from the active contract", () => {
    const pressedPipeline = resolveLensReferencePipeline({
      glassThickness: 114.59234035637621,
      magnificationGlassThickness: 47.48092398546781
    });
    const draggedPipeline = resolveLensReferencePipeline({
      glassThickness: 109.05052,
      magnificationGlassThickness: 42.06586
    });

    expect(pressedPipeline.stages[0]?.scale).toBeCloseTo(53.0098258433195, 3);
    expect(pressedPipeline.stages[1]?.scale).toBeCloseTo(127.93601083098308, 3);
    expect(draggedPipeline.stages[0]?.scale).toBeCloseTo(46.964203545358714, 3);
    expect(draggedPipeline.stages[1]?.scale).toBeCloseTo(121.74887478328273, 3);
  });

  it("keeps the reference lens engine as a real two-pass SVG filter", () => {
    expect(lensReferenceEngineSource.match(/<feImage/g)).toHaveLength(3);
    expect(lensReferenceEngineSource.match(/<feDisplacementMap/g)).toHaveLength(4);
    expect(lensReferenceEngineSource).toContain("createLensFilterPixelMaps");
    expect(lensReferenceEngineSource).not.toContain("calculateDisplacementMagnitudes");
    expect(lensReferenceEngineSource).not.toContain("sampleCapsuleField");
    expect(displacementMapSource).toContain("sampleCapsuleField");
    expect(displacementMapSource).toContain("falloffPower = 4.8");
    expect(displacementMapSource).toContain("maxChannelMagnitude = 127");
    expect(lensPipelineSource).toContain("referenceLensDisplacementFalloff = 25");
    expect(lensReferenceEngineSource).toContain('result="magnifying_displacement_map"');
    expect(lensReferenceEngineSource).toContain('result="displacement_map"');
    expect(lensReferenceEngineSource).toContain('result="specular_layer"');
    expect(lensReferenceEngineSource).toContain('in="SourceGraphic"');
    expect(lensReferenceEngineSource).toContain('in="blurred_source"');
    expect(lensReferenceEngineSource).toContain('values="9"');
  });

  it("keeps optical displacement estimates finite for bad sample input", () => {
    const displacement = estimateMaximumDisplacement({
      bezelWidth: Number.NaN,
      glassThickness: Number.NaN,
      refractiveIndex: Number.NaN,
      samples: Number.NaN
    });

    expect(displacement).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(displacement)).toBe(true);
  });

  it("keeps lens filter-map slices from overlapping at the overscan radius", () => {
    const lensRule = collectCssRuleBodies(styles, ".lg-lens").join("\n");

    expect(lensRule).toContain("height: 9.375rem");
    expect(lensRule).toContain("transform: scaleY(0.8)");
    expect(lensRule).toContain("transform-origin: top center");
    expect(
      resolveFilterMapGeometry({
        bezelWidth: 18,
        height: 150,
        radius: 75,
        width: 210
      }).hasOverlappingSlices
    ).toBe(false);
    expect(
      resolveFilterMapGeometry({
        bezelWidth: 18,
        height: 120,
        radius: 75,
        width: 210
      }).hasOverlappingSlices
    ).toBe(true);
  });

  it("keeps the draggable precision handle at the optical Kube lens bounds", () => {
    const handleRule = collectCssRuleBodies(styles, ".lg-precision-lens-demo__handle").join("\n");
    const handleSurfaceRule = collectCssRuleBodies(
      styles,
      ".lg-precision-lens-demo__surface.lg-lens"
    ).join("\n");
    const pressedSurfaceRule = collectCssRuleBodies(
      styles,
      '.lg-precision-lens-demo__handle[data-liquid-droplet="pressed"] .lg-precision-lens-demo__surface'
    ).join("\n");

    expect(handleRule).toContain("width: 13.125rem");
    expect(handleRule).toContain("height: 9.375rem");
    expect(handleRule).toContain("box-sizing: border-box");
    expect(handleRule).toContain("padding: 0");
    expect(handleRule).toContain("top: var(--lg-demo-lens-y, 0)");
    expect(handleRule).toContain("left: var(--lg-demo-lens-x, 0)");
    expect(handleRule).not.toContain("translate3d(var(--lg-demo-lens-x");
    expect(handleRule).toContain(
      "translate3d(var(--lg-demo-drag-x, 0), var(--lg-demo-drag-y, 0), 0)"
    );
    expect(handleRule).toContain("scaleY(var(--lg-demo-droplet-scale-y, 0.8))");
    expect(handleRule).toContain("scaleX(var(--lg-demo-focus-scale-x, 1))");
    expect(handleRule).toContain("scaleY(var(--lg-demo-focus-scale-y, 1))");
    expect(handleRule).toContain("transform-origin: center");
    expect(handleSurfaceRule).toContain("transform: none");
    expect(handleSurfaceRule).toContain("box-shadow 220ms var(--lg-ease-apple)");
    expect(lensStorySource).toContain('className="lg-precision-lens-demo__surface"');
    expect(styles).not.toContain(".lg-precision-lens-demo__handle::before");
    expect(styles).not.toContain(".lg-precision-lens-demo__handle::after");
    expect(handleRule).not.toContain("padding: 0.9375rem 0");
    expect(lensStorySource).toContain("position.x - precisionLensInitialPosition.x");
    expect(lensStorySource).toContain("position.y - precisionLensInitialPosition.y");
    expect(lensStorySource).toContain('"--lg-demo-drag-x": `${dragDelta.x}px`');
    expect(lensStorySource).toContain('"--lg-demo-drag-y": `${dragDelta.y}px`');
    expect(lensStorySource).toContain("left: `${precisionLensInitialPosition.x}px`");
    expect(lensStorySource).toContain("top: `${precisionLensInitialPosition.y}px`");
    expect(pressedSurfaceRule).not.toContain("drop-shadow");
    expect(pressedSurfaceRule).toContain("4px 16px 24px rgba(0, 0, 0, 0.22)");
    expect(pressedSurfaceRule).toContain("inset 2px 8px 24px rgba(0, 0, 0, 0.27)");
    expect(pressedSurfaceRule).toContain("inset -2px -8px 24px rgba(255, 255, 255, 0.27)");
  });

  it("uses Kube CSS coordinates for the draggable lens initial position", () => {
    expect(lensStorySource).toContain("const precisionLensInitialPosition = { x: 19.5, y: 19.5 }");
    expect(lensStorySource).toContain(
      'style={{ position: "absolute", top: 34.5, left: 19.5, zIndex: 3 }}'
    );
  });

  it("uses the Kube lens demo image instead of the local optics illustration", () => {
    expect(storybookMainSource).toContain('staticDirs: ["../stories/assets"]');
    expect(kubeReferenceAssetsSource).toContain('lensDemoImage: "/kube/lens-demo-image.jpg"');
    expect(kubeReferenceAssetsSource).toContain(
      'lensDemoBackground: "/kube/lens-demo-background.jpg"'
    );
    expect(kubeReferenceAssetsSource).toContain(
      'lensDemoInlineImage: "/kube/lens-demo-inline-image.jpg"'
    );
    expect(fs.existsSync(path.resolve("stories/assets/kube/lens-demo-image.jpg"))).toBe(true);
    expect(fs.existsSync(path.resolve("stories/assets/kube/lens-demo-background.jpg"))).toBe(true);
    expect(fs.existsSync(path.resolve("stories/assets/kube/lens-demo-inline-image.jpg"))).toBe(
      true
    );
    expect(kubeReferenceAssetsSource).toContain(
      "https://images.unsplash.com/photo-1579380656108-f98e4df8ea62?q=80&w=800&auto=format&fit=crop"
    );
    expect(kubeReferenceAssetsSource).toContain(
      "https://images.unsplash.com/photo-1688494930098-e88c53c26e3a?auto=format&q=80&fit=crop&w=1400&h=1600&crop=focalpoint&fp-x=0.3&fp-y=0.5&fp-z=1"
    );
    expect(kubeReferenceAssetsSource).toContain(
      "https://images.unsplash.com/photo-1688494930098-e88c53c26e3a?auto=format&q=80&fit=crop&w=400&h=700&crop=focalpoint&fp-x=0.3&fp-y=0.6&fp-z=1.9"
    );
    expect(lensStorySource).toContain("kubeReferenceImageAssets.lensDemoImage");
    expect(lensStorySource).toContain("kubeReferenceImageAssets.lensDemoBackground");
    expect(lensStorySource).toContain("kubeReferenceImageAssets.lensDemoInlineImage");
    expect(lensStorySource).toContain('backgroundPosition: "center -60px"');
    expect(lensStorySource).toContain('backgroundSize: "700px auto"');
    expect(lensStorySource).toContain('data-lg-reference-frame="lens-page-background"');
    expect(lensStorySource).toContain("Photo: Stephanie LeBlanc / Unsplash");
    expect(lensStorySource).not.toContain("src={localOpticsImage}");
  });

  it("locks Kube demo images to the captured source URLs, dimensions, and hashes", () => {
    expect(kubeReferenceAssetManifest.sourcePage).toBe(
      "https://kube.io/blog/liquid-glass-css-svg/"
    );
    expect(kubeReferenceAssetManifest.captureMethod).toContain("Chrome DOM");
    expect(kubeReferenceAssetManifest.captureMethod).toContain("CDP");
    expect(kubeReferenceAssetManifest.generatedFallbackAssets).toEqual([]);
    expect(kubeReferenceAssetManifest.assets).toMatchObject(expectedKubeDemoImageAssets);

    for (const [name, asset] of Object.entries(kubeReferenceAssetManifest.assets)) {
      const localPath = path.resolve("stories/assets/kube", asset.file);
      const bytes = fs.readFileSync(localPath);
      const hash = crypto.createHash("sha256").update(bytes).digest("hex");

      expect(kubeReferenceAssetsSource).toContain(`${name}: "/kube/${asset.file}"`);
      expect(kubeReferenceAssetsSource).toContain(asset.sourceUrl);
      expect(hash).toBe(asset.sha256);
      expect(readRasterSize(bytes)).toEqual({ height: asset.height, width: asset.width });
    }
  });

  it("uses the captured Kube CSS-only control background fixture", () => {
    expect(kubeReferenceAssetManifest.cssOnlyBackgroundAssets).toMatchObject(
      expectedKubeCssOnlyBackgroundAssets
    );
    expect(kubeReferenceAssetsSource).toContain(
      'controlGridBackground: "/kube/reference-captures/control-grid-background.png"'
    );
    expect(kubeReferenceAssetsSource).toContain("kubeReferenceControlGridBackground");
    expect(kubeReferenceAssetsSource).toContain("oklab(0 0 0 / 0.05)");
    expect(searchboxStorySource).toContain("kubeReferenceControlGridBackground.image");
    expect(switchStorySource).toContain("kubeReferenceControlGridBackground.image");
    expect(sliderStorySource).toContain("kubeReferenceControlGridBackground.image");
    expect(searchboxStorySource).toContain("kubeReferenceControlGridBackground.position");
    expect(switchStorySource).toContain("kubeReferenceControlGridBackground.position");
    expect(sliderStorySource).toContain("kubeReferenceControlGridBackground.position");

    for (const [name, asset] of Object.entries(
      kubeReferenceAssetManifest.cssOnlyBackgroundAssets
    )) {
      const localPath = path.resolve("stories/assets/kube", asset.file);
      const bytes = fs.readFileSync(localPath);
      const hash = crypto.createHash("sha256").update(bytes).digest("hex");

      expect(asset.targetIds).toEqual(["searchbox", "switch", "slider"]);
      expect(kubeReferenceAssetsSource).toContain(`"/kube/${asset.file}"`);
      expect(hash).toBe(asset.sha256);
      expect(readRasterSize(bytes)).toEqual({ height: asset.height, width: asset.width });
      expect(name).toBe("controlGridBackground");
    }
  });

  it("verifies Kube demo asset URLs against the rendered public page before parity capture", () => {
    expect(packageJson.scripts["test:kube-assets"]).toBe(
      "node scripts/verify-kube-demo-assets.mjs"
    );
    expect(packageJson.scripts["test:kube-reference"]).toContain("pnpm test:kube-assets");
    expect(kubeDemoAssetVerifierSource).toContain("https://kube.io/blog/liquid-glass-css-svg/");
    expect(kubeDemoAssetVerifierSource).toContain("targetNavigationRetries");
    expect(kubeDemoAssetVerifierSource).toContain("targetNavigationTimeoutMs");
    expect(kubeDemoAssetVerifierSource).toContain("gotoTargetReference(page)");
    expect(kubeDemoAssetVerifierSource).toContain('waitUntil: "domcontentloaded"');
    expect(kubeDemoAssetVerifierSource).toContain('waitForLoadState("networkidle"');
    expect(kubeDemoAssetVerifierSource).toContain("Kube asset verifier navigation failed");
    expect(kubeDemoAssetVerifierSource).toContain('"Use image background"');
    expect(kubeDemoAssetVerifierSource).toContain(
      'document.querySelectorAll("svg image, image, svg feImage, feImage")'
    );
    expect(kubeDemoAssetVerifierSource).toContain("manifest.musicAlbumArtAssets");
    expect(kubeDemoAssetVerifierSource).toContain("manifest.filterMapAssets");
    expect(kubeDemoAssetVerifierSource).toContain("manifest.fontAssets");
    expect(kubeDemoAssetVerifierSource).toContain("manifest.cssOnlyBackgroundAssets");
    expect(kubeDemoAssetVerifierSource).toContain("filterMapAssets.${name}");
    expect(kubeDemoAssetVerifierSource).toContain("fontAssets.${name}");
    expect(kubeDemoAssetVerifierSource).toContain("cssOnlyBackgroundAssets.${name}");
    expect(kubeDemoAssetVerifierSource).toContain("searchboxDemoBackground");
    expect(kubeDemoAssetVerifierSource).toContain("lensDemoBackground");
    expect(kubeDemoAssetVerifierSource).toContain("lensDemoInlineImage");
    expect(kubeDemoAssetVerifierSource).toContain("lensDemoImage");
    expect(kubeDemoAssetVerifierSource).toContain("controlGridBackground");
    expect(kubeDemoAssetVerifierSource).toContain("observed-kube-demo-assets.json");
    expect(kubeDemoAssetVerifierSource).toContain("validateLocalAsset");
    expect(kubeDemoAssetVerifierSource).toContain("validateLocalFontAsset");
    expect(kubeDemoAssetVerifierSource).toContain("validateRenderedCssOnlyBackgroundAssets");
    expect(kubeDemoAssetVerifierSource).toContain("readTargetCssOnlyDemoBackground");
    expect(kubeDemoAssetVerifierSource).toContain("newCDPSession(page)");
    expect(kubeDemoAssetVerifierSource).toContain('cdpSession.send("Network.enable")');
    expect(kubeDemoAssetVerifierSource).toContain("Network.responseReceived");
    expect(kubeDemoAssetVerifierSource).toContain("cdpResponseUrls");
    expect(kubeDemoAssetVerifierSource).toContain("captureTargetCssOnlyDemoBackground");
    expect(kubeDemoAssetVerifierSource).toContain("Math.abs(capture.width - asset.width) > 1");
    expect(kubeDemoAssetVerifierSource).toContain("Math.abs(capture.height - asset.height) > 2");
    expect(kubeDemoAssetVerifierSource).toContain('"css-only-backgrounds"');
    expect(kubeDemoAssetVerifierSource).toContain("sample.capture = {");
    expect(kubeDemoAssetVerifierSource).toContain("shaMatchesFixture");
    expect(kubeDemoAssetVerifierSource).toContain("compareRasterFilesInBrowser");
    expect(kubeDemoAssetVerifierSource).toContain("pixelDeltaThreshold");
    expect(kubeDemoAssetVerifierSource).toContain("comparison,");
    expect(kubeDemoAssetVerifierSource).toContain("createImageBitmap");
    expect(kubeDemoAssetVerifierSource).toContain("getImageData");
    expect(kubeDemoAssetVerifierSource).toContain("crypto.createHash");
    expect(kubeDemoAssetVerifierSource).toContain("readRasterSize(bytes)");
    expect(kubeDemoAssetVerifierSource).toContain("localAssets: localAssetChecks");
    expect(kubeDemoAssetVerifierSource).toContain(
      "cssOnlyBackgroundAssets: cssOnlyBackgroundAssetChecks"
    );
    expect(kubeDemoAssetVerifierSource).toContain("cssOnlyBackgrounds: cssOnlyBackgroundChecks");
    expect(kubeDemoAssetVerifierSource).toContain("localFontAssets: localFontAssetChecks");
    expect(kubeDemoAssetVerifierSource).toContain("filterMapAssets");
    expect(kubeDemoAssetVerifierSource).toContain("resourceUrls");
    expect(kubeDemoAssetVerifierSource).toContain("document.fonts.status");
    expect(kubeDemoAssetVerifierSource).toContain("observedCssBackgrounds");
    expect(kubeDemoAssetVerifierSource).toContain("uncoveredCssBackgrounds");
    expect(kubeDemoAssetVerifierSource).toContain("generatedFallbackAssets");
    expect(kubeDemoAssetVerifierSource).toContain("Kube CSS-only background verification failed");
    expect(kubeDemoAssetVerifierSource).toContain("CSS-only background captures");
    expect(kubeDemoAssetVerifierSource).toContain(
      "Add these rendered CSS backgrounds to stories/assets/kube/manifest.json or record a generated fallback"
    );
  });

  it("locks the Kube page Inter font fixture for reference screenshots", () => {
    const interVariable = kubeReferenceAssetManifest.fontAssets.interVariable;
    const localPath = path.resolve("stories/assets/kube", interVariable.file);
    const bytes = fs.readFileSync(localPath);
    const hash = crypto.createHash("sha256").update(bytes).digest("hex");

    expect(interVariable).toMatchObject({
      bytes: 352240,
      file: "fonts/InterVariable.woff2",
      sourceUrl: "https://rsms.me/inter/font-files/InterVariable.woff2?v=4.1"
    });
    expect(hash).toBe(interVariable.sha256);
    expect(storybookPreviewSource).toContain('import "./kube-reference-fonts.css";');
    expect(storybookKubeFontSource).toContain("@font-face");
    expect(storybookKubeFontSource).toContain("font-family: InterVariable");
    expect(storybookKubeFontSource).toContain('url("/kube/fonts/InterVariable.woff2")');
    expect(kubeReferenceCompareSource).toContain("waitForPageFonts(referencePage)");
    expect(kubeReferenceCompareSource).toContain("waitForPageFonts(candidatePage)");
    expect(kubeReferenceCompareSource).toContain("document.fonts.status");
  });

  it("locks Kube same-origin filter maps for exact parity diagnostics", () => {
    const filterMapAssets = kubeReferenceAssetManifest.filterMapAssets;

    expect(Object.keys(filterMapAssets)).toHaveLength(17);
    expect(kubeReferenceAssetsSource).toContain("kubeReferenceFilterMapAssets");
    expect(kubeReferenceAssetsSource).toContain("kubeReferenceRemoteFilterMapAssets");

    for (const [name, asset] of Object.entries(filterMapAssets)) {
      const localPath = path.resolve("stories/assets/kube", asset.file);
      const bytes = fs.readFileSync(localPath);
      const hash = crypto.createHash("sha256").update(bytes).digest("hex");

      expect(asset.sourceUrl).toBe(`https://kube.io/assets/${path.basename(asset.file)}`);
      expect(kubeReferenceAssetsSource).toContain(`${name}: "/kube/${asset.file}"`);
      expect(kubeReferenceAssetsSource).toContain(`${name}: "${asset.sourceUrl}"`);
      expect(hash).toBe(asset.sha256);
      expect(readRasterSize(bytes)).toEqual({ height: asset.height, width: asset.width });
    }

    expect(filterMapAssets.magnifyingMapQ51ggw).toMatchObject({ height: 150, width: 210 });
    expect(filterMapAssets.displacementMapW2qrsb).toMatchObject({ height: 300, width: 420 });
    expect(filterMapAssets.specularMapW2qrsb).toMatchObject({ height: 300, width: 420 });
  });

  it("uses captured Kube filter maps in the reference lens parity stories", () => {
    expect(lensSource).toContain("referenceFilterMaps");
    expect(surfaceSource).toContain("referenceFilterMaps?");
    expect(lensReferenceEngineSource).toContain("referenceFilterMaps ?? generatedMaps");
    expect(lensReferenceEngineSource).toContain("if (referenceFilterMaps)");
    expect(lensStorySource).toContain("kubeReferenceFilterMapAssets");
    expect(lensStorySource).toContain(
      "displacement: kubeReferenceFilterMapAssets.displacementMapW2qrsb"
    );
    expect(lensStorySource).toContain(
      "magnification: kubeReferenceFilterMapAssets.magnifyingMapQ51ggw"
    );
    expect(lensStorySource).toContain("specular: kubeReferenceFilterMapAssets.specularMapW2qrsb");
    expect(lensStorySource).toContain("referenceFilterMaps={precisionLensReferenceFilterMaps}");
  });

  it("uses the Kube searchbox demo image instead of a synthetic photo fallback", () => {
    expect(kubeReferenceAssetsSource).toContain(
      'searchboxDemoBackground: "/kube/searchbox-demo-background.jpg"'
    );
    expect(fs.existsSync(path.resolve("stories/assets/kube/searchbox-demo-background.jpg"))).toBe(
      true
    );
    expect(kubeReferenceAssetsSource).toContain(
      "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?q=80&w=1600&auto=format&fit=crop"
    );
    expect(searchboxStorySource).toContain("kubeReferenceImageAssets.searchboxDemoBackground");
    expect(searchboxStorySource).toContain('"--lg-text": "#fff"');
    expect(verifyLiquidBehaviorSource).toContain(
      'const kubeSearchboxImageId = "searchbox-demo-background.jpg"'
    );
    expect(verifyLiquidBehaviorSource).toContain('new RegExp(`${name}:\\\\s*"([^"]+)"`)');
    expect(searchboxStorySource).toContain("Photo by Teemu Paananen");
    expect(searchboxStorySource).not.toContain("radial-gradient(ellipse at 18% 24%");
  });

  it("keeps the Kube searchbox visual radius separate from the physical optical radius", () => {
    const kubeSearchboxRule = collectCssRuleBodies(
      styles,
      ".lg-searchbox.lg-searchbox--kube-reference"
    ).join("\n");
    const kubeSearchboxContentRule = collectCssRuleBodies(
      styles,
      ".lg-searchbox--kube-reference > .lg-surface__content"
    ).join("\n");

    expect(searchboxStorySource).toContain("radius: 28");
    expect(kubeSearchboxRule).toContain("border-radius: 28px");
    expect(kubeSearchboxContentRule).toContain("border-radius: 28px");
    expect(resolvePhysicalRefractionRadius({ height: 45, radius: 28, width: 336 })).toBe(22);
    expect(searchboxStorySource).toContain('"--lg-surface-radius": "28px"');
    expect(surfaceSource).toContain("const visualRadiusPx =");
    expect(surfaceSource).toContain('resolvedMode === "enhanced" ? refractiveOptions.radius');
    expect(surfaceSource).toContain("...style");
    expect(surfaceSource).toContain('"--lg-surface-radius": `${visualRadiusPx}px`');
    expect(refractiveEngineSource).toContain("resolveVisualStyle");
    expect(refractiveEngineSource).toContain('"--lg-surface-radius"');
    expect(refractiveEngineSource).toContain("borderRadius: visualRadius");
    expect(lensReferenceEngineSource).not.toContain("borderRadius: refraction.radius");
    expect(verifyEnhancedStorybookSource).toContain(
      "assertEqual(result.borderRadius, story.radius"
    );
    expect(verifyEnhancedStorybookSource).toContain('radius: "28px"');
    expect(kubeReferenceCompareSource).toContain("glassLayerMaterial");
  });

  it("uses the Kube Music Player album art grid instead of synthetic covers", () => {
    const albumArtAssets = kubeReferenceAssetManifest.musicAlbumArtAssets;

    expect(albumArtAssets).toHaveLength(8);
    expect(kubeReferenceAssetsSource).toContain("kubeReferenceMusicAlbumAssets");
    expect(musicPlayerStorySource).toContain("kubeReferenceMusicAlbumAssets");
    expect(musicPlayerStorySource).toContain('gridTemplateColumns: "repeat(4, 154px)"');
    expect(musicPlayerStorySource).toContain('objectFit: "cover"');
    expect(musicPlayerStorySource).not.toContain("radial-gradient(circle");
    expect(musicPlayerStorySource).not.toContain("linear-gradient(135deg, ${color}");

    for (const asset of albumArtAssets) {
      const localPath = path.resolve("stories/assets/kube", asset.file);
      const bytes = fs.readFileSync(localPath);
      const hash = crypto.createHash("sha256").update(bytes).digest("hex");

      expect(asset.sourceUrl).toContain("https://is1-ssl.mzstatic.com/image/thumb/");
      expect(kubeReferenceAssetsSource).toContain(`src: "/kube/${asset.file}"`);
      expect(kubeReferenceAssetsSource).toContain(asset.sourceUrl);
      expect(hash).toBe(asset.sha256);
      expect(readRasterSize(bytes)).toEqual({ height: asset.height, width: asset.width });
    }
  });

  it("keeps Kube control reference frames at the measured target size", () => {
    const frameSources = [searchboxStorySource, switchStorySource, sliderStorySource];

    for (const source of frameSources) {
      expect(source).toContain('boxSizing: "border-box"');
      expect(source).toContain("width: 706");
      expect(source).toContain("height: 313");
      expect(source).not.toContain("minHeight: 312");
    }
  });

  it("keeps Kube parity Storybook builds isolated per command run", () => {
    const kubeScript = packageJson.scripts["test:kube-reference"];
    const strictScript = packageJson.scripts["test:kube-reference:strict"];
    const exactScript = packageJson.scripts["test:kube-reference:exact"];

    expect(kubeScript).toContain("KUBE_STORYBOOK_STATIC_DIR");
    expect(kubeScript).toContain("storybook-static-kube-reference-$$");
    expect(kubeScript).toContain('--output-dir "$KUBE_STORYBOOK_STATIC_DIR"');
    expect(kubeScript).toContain('STORYBOOK_STATIC_DIR="$KUBE_STORYBOOK_STATIC_DIR"');
    expect(strictScript).toContain("Retrying strict Kube reference capture once");
    expect(strictScript.match(/KUBE_STRICT_INTERACTIVE=1/g)).toHaveLength(2);
    expect(strictScript).toContain("||");
    expect(exactScript).not.toContain("Retrying strict Kube reference capture once");
    expect(exactScript).not.toContain("||");
  });

  it("keeps behavior Storybook builds isolated per command run", () => {
    const e2eScript = packageJson.scripts["test:e2e"];

    expect(e2eScript).toContain("E2E_STORYBOOK_STATIC_DIR");
    expect(e2eScript).toContain("storybook-static-e2e-$$");
    expect(e2eScript).toContain('--output-dir "$E2E_STORYBOOK_STATIC_DIR"');
    expect(e2eScript).toContain('STORYBOOK_STATIC_DIR="$E2E_STORYBOOK_STATIC_DIR"');
  });

  it("rejects impossible target-page drag samples before comparing parity", () => {
    expect(kubeReferenceCompareSource).toContain("hasPlausiblePointerActionMetrics");
    expect(kubeReferenceCompareSource).toContain("scrollActionPointIntoViewport");
    expect(kubeReferenceCompareSource).toContain("actionPathBounds");
    expect(kubeReferenceCompareSource).toContain("addPointerActionScrollSlack");
    expect(kubeReferenceCompareSource).toContain("removePointerActionScrollSlack");
    expect(kubeReferenceCompareSource).toContain("applyTargetActionWithPageRecovery");
    expect(kubeReferenceCompareSource).toContain("isRecoverableTargetActionError");
    expect(kubeReferenceCompareSource).toContain("resetTargetReferencePage");
    expect(kubeReferenceCompareSource).toContain("createPointerActionSample");
    expect(kubeReferenceCompareSource).toContain("summarizePointerActionMetrics");
    expect(kubeReferenceCompareSource).toContain('"./kube-pointer-metrics.mjs"');
    expect(kubeReferenceCompareSource).toContain("node.getBoundingClientRect()");
    expect(kubeReferenceCompareSource).not.toContain("handle.boundingBox()");
    expect(kubeReferenceCompareSource).toContain("return createPointerActionSample(box, viewport)");
    expect(kubeReferenceCompareSource).toContain(
      'data-lg-transient", "pointer-action-scroll-slack"'
    );
    expect(kubeReferenceCompareSource).toContain('behavior: "instant"');
    expect(kubeReferenceCompareSource).toContain("bounds.maxY > sample.viewport.height - margin");
    expect(kubeReferenceCompareSource).toContain("endY = startY + (action.delta?.y ?? 0)");
    expect(kubeReferenceCompareSource).toContain("summarizePointerActionMetrics");
    expect(kubeReferenceCompareSource).toContain("Math.abs(action.delta.x) + Math.max(32");
    expect(kubeReferenceCompareSource).toContain("Math.abs(action.delta.y) + Math.max(32");
    expect(kubeReferenceCompareSource).toContain("Math.abs(metrics.heightDelta) * 1.25");
    expect(kubeReferenceCompareSource).toContain("Math.abs(action.delta.y) * 0.16");
    expect(kubeReferenceCompareSource).toContain(
      "Drag action produced an implausible movement or deformation sample"
    );
    expect(kubeReferenceCompareSource).toContain("Drag action did not move the lens enough");
    expect(kubeReferenceCompareSource).toContain("Press action did not deform the lens enough");
    expect(kubeReferenceCompareSource).toContain("currentTargetElement = await findTargetDemo");
  });

  it("keeps strict Kube budgets honest about loaded media and lens CI variance", () => {
    expect(readKubeMaxDiffRatio("searchbox")).toBe(0.02);
    expect(readKubeMaxDiffRatio("searchbox-image-background")).toBe(0.12);
    expect(readKubeMaxDiffRatio("switch")).toBe(0.02);
    expect(readKubeMaxDiffRatio("slider")).toBe(0.02);
    expect(readKubeMaxDiffRatio("magnifying-glass")).toBe(0.24);
    expect(readKubeMaxDiffRatio("magnifying-glass-pressed")).toBe(0.405);
    expect(readKubeMaxDiffRatio("magnifying-glass-dragged")).toBe(0.455);
    expect(kubeReferenceCompareSource).toContain("heightDelta: 7");
    expect(kubeReferenceCompareSource).toContain("heightDelta: 10");
    expect(kubeReferenceCompareSource).toContain("widthDelta: 7");
    expect(kubeReferenceCompareSource).toContain("widthDelta: 10");
    expect(kubeReferenceCompareSource).toContain("emitGithubError(");
    expect(kubeReferenceCompareSource).toContain("Kube reference parity failed");
    expect(kubeReferenceCompareSource).toContain("Kube reference capture failed");
    expect(kubeReferenceCompareSource).toContain("GITHUB_STEP_SUMMARY");
    expect(kubeReferenceCompareSource).toContain("Run failed before all references completed");
    expect(kubeReferenceCompareSource).toContain("diffDiagnostics");
    expect(kubeReferenceCompareSource).toContain("diffDiagnosticThresholds");
    expect(kubeReferenceCompareSource).toContain("thresholdSweep");
    expect(kubeReferenceCompareSource).toContain("formatThresholdSweepRatio(result, 24)");
    expect(kubeReferenceCompareSource).toContain("formatThresholdSweepRatio(result, 64)");
    expect(kubeReferenceCompareSource).toContain("formatWorstDiffRegion(result)");
    expect(kubeReferenceCompareSource).toContain("deltaGt24");
    expect(kubeReferenceCompareSource).toContain("deltaGt64");
    expect(kubeReferenceCompareSource).toContain("Worst region");
    expect(kubeReferenceCompareSource).toContain("layerContract");
    expect(kubeReferenceCompareSource).toContain("summarizeLayerContract");
    expect(kubeReferenceCompareSource).toContain("hasLayerTransformMismatch");
    expect(kubeReferenceCompareSource).toContain("layerTransformMismatch");
    expect(kubeReferenceCompareSource).toContain("layerTransformDelta");
    expect(kubeReferenceCompareSource).toContain("parseCssTransformMatrix");
    expect(kubeReferenceCompareSource).toContain("matrix3d");
    expect(kubeReferenceCompareSource).toContain("effectiveTransformMetrics");
    expect(kubeReferenceCompareSource).toContain("filterSurfaceCarriesTransform");
    expect(kubeReferenceCompareSource).toContain("transformOwner");
    expect(kubeReferenceCompareSource).toContain("formatLayerTransformOwner");
    expect(kubeReferenceCompareSource).toContain("formatLayerTransformDelta");
    expect(kubeReferenceCompareSource).toContain("maxScaleDelta");
    expect(kubeReferenceCompareSource).toContain("maxTranslateDelta");
    expect(kubeReferenceCompareSource).toContain("surfaceParentTransform");
    expect(kubeReferenceCompareSource).toContain("surfaceParentSameAsSurface");
    expect(kubeReferenceCompareSource).toContain("[0, 1, 2, 4, 8, 16, 24, 32, 48, 64]");
    expect(kubeReferenceCompareSource).toContain("verticalBands");
    expect(kubeReferenceCompareSource).toContain("horizontalBands");
    expect(kubeReferenceCompareSource).toContain("radialRegions");
    expect(kubeReferenceCompareSource).toContain("worstRegion");
  });

  it("captures lens filter contracts before action cleanup changes the measured state", () => {
    const targetFilterReadIndex = kubeReferenceCompareSource.indexOf(
      "const targetFilterContract ="
    );
    const targetCleanupIndex = kubeReferenceCompareSource.indexOf("await targetAction?.cleanup();");
    const candidateFilterReadIndex = kubeReferenceCompareSource.indexOf(
      "const candidateFilterContract ="
    );
    const candidateCleanupIndex = kubeReferenceCompareSource.indexOf(
      "await candidateAction?.cleanup();"
    );

    expect(targetFilterReadIndex).toBeGreaterThan(-1);
    expect(targetCleanupIndex).toBeGreaterThan(-1);
    expect(candidateFilterReadIndex).toBeGreaterThan(-1);
    expect(candidateCleanupIndex).toBeGreaterThan(-1);
    expect(targetFilterReadIndex).toBeLessThan(targetCleanupIndex);
    expect(candidateFilterReadIndex).toBeLessThan(candidateCleanupIndex);
  });

  it("checks the Kube searchbox image background through real checkbox input", () => {
    expect(kubeReferenceCompareSource).toContain('name: "searchbox-image-background"');
    expect(kubeReferenceCompareSource).toContain('controlContract: "searchbox"');
    expect(kubeReferenceCompareSource).toContain('kind: "checkbox"');
    expect(kubeReferenceCompareSource).toContain("applyCheckboxAction");
    expect(kubeReferenceCompareSource).toContain("readCheckboxActionSample");
    expect(kubeReferenceCompareSource).toContain("waitForCssBackgroundImages");
    expect(kubeReferenceCompareSource).toContain("readCssBackgroundImageStatus");
    expect(kubeReferenceCompareSource).toContain("Checkbox background image failed to render");
    expect(kubeReferenceCompareSource).toContain("naturalWidth");
    expect(kubeReferenceCompareSource).toContain("readControlContract");
    expect(kubeReferenceCompareSource).toContain("summarizeControlContract");
    expect(kubeReferenceCompareSource).toContain("assertControlContractIntegrity");
    expect(kubeReferenceCompareSource).toContain("assertSearchboxVerticalAlignment");
    expect(kubeReferenceCompareSource).toContain("searchbox vertical alignment exceeds");
    expect(kubeReferenceCompareSource).toContain("findSearchGlassLayer");
    expect(kubeReferenceCompareSource).toContain("findSearchContentLayer");
    expect(kubeReferenceCompareSource).toContain("glassLayerMaterial");
    expect(kubeReferenceCompareSource).toContain("contentLayerMaterial");
    expect(kubeReferenceCompareSource).toContain("icon: summarizeRectDelta");
    expect(kubeReferenceCompareSource).toContain("content layer is filtered");
    expect(kubeReferenceCompareSource).toContain("content layer does not cover glass surface");
    expect(kubeReferenceCompareSource).toContain("rectsMatch");
    expect(kubeReferenceCompareSource).toContain("glass layer has inset rim");
    expect(kubeReferenceCompareSource).toContain("-control-contract.json");
    expect(kubeReferenceCompareSource).toContain("photo-1497250681960-ef046c08a56e");
    expect(kubeReferenceCompareSource).toContain("searchbox-demo-background.jpg");
    expect(searchboxStorySource).toContain("const kubeFontStack");
    expect(searchboxStorySource).toContain("InterVariable, Inter");
    expect(searchboxStorySource).toContain("top: 9.75");
    expect(searchboxStorySource).toContain("left: 9.75");
    expect(searchboxStorySource).toContain("fontSize: 9");
    expect(searchboxStorySource).toContain('backdropFilter: useImageBackground ? "blur(8px)"');
    expect(searchboxStorySource).toContain("bottom: useImageBackground ? 7.5 : 12");
    expect(searchboxStorySource).toContain('padding: useImageBackground ? "3.25px 7.25px"');
    expect(searchboxStorySource).toContain("fontSize: useImageBackground ? 9.75 : 10");
    expect(searchboxStorySource).toContain('lineHeight: useImageBackground ? "13px"');
    expect(searchboxStorySource).toContain("borderRadius: useImageBackground ? 4.875");
  });

  it("boosts the Kube lens filter scale only for active water-drop states", () => {
    expect(lensStorySource).toContain("const precisionLensPressedRefraction = {");
    expect(lensStorySource).toContain("const precisionLensDraggingRefraction = {");
    expect(lensStorySource).toContain("glassThickness: 114.59234035637621");
    expect(lensStorySource).toContain("magnificationGlassThickness: 47.48092398546781");
    expect(lensStorySource).toContain("glassThickness: 109.05052");
    expect(lensStorySource).toContain("magnificationGlassThickness: 42.06586");
    expect(lensStorySource).toContain("precisionLensRefractionForDroplet(droplet)");
    expect(lensStorySource).toContain('if (droplet.phase === "pressed")');
    expect(lensStorySource).toContain('if (droplet.phase === "dragging")');
    expect(lensStorySource).not.toContain("glassThickness: 110");
    expect(lensStorySource).not.toContain("magnificationGlassThickness: 43");
    expect(lensStorySource).toContain('className="lg-precision-lens-demo__handle"');
    expect(lensStorySource).toContain('data-lg-draggable-lens=""');
    expect(lensStorySource).toContain('className="lg-precision-lens-demo__surface"');
    expect(lensStorySource).toContain('engine="reference"');
    expect(lensStorySource).toContain("refraction={precisionLensRefractionForDroplet(droplet)}");
  });

  it("keeps foreground content outside the displacement/filter layer", () => {
    const contentRules = collectCssRuleBodies(styles, ".lg-surface__content").join("\n");

    expect(surfaceSource).toContain('<span className="lg-surface__content">{children}</span>');
    expect(contentRules).not.toMatch(/(?:^|;)\s*-?webkit-filter\s*:/);
    expect(contentRules).not.toMatch(/(?:^|;)\s*filter\s*:/);
    expect(contentRules).not.toMatch(/(?:^|;)\s*-?webkit-backdrop-filter\s*:/);
    expect(contentRules).not.toMatch(/(?:^|;)\s*backdrop-filter\s*:/);
  });

  it("does not fake refraction by adding generated crosshatch material texture", () => {
    expect(styles).not.toContain("repeating-linear-gradient");
    expect(storyFixture).not.toContain("repeating-linear-gradient");
  });

  it("keeps nav and toolbar item filters disabled so the plate owns refraction", () => {
    expect(styles).toContain(".lg-nav .lg-surface--button");
    expect(styles).toContain(".lg-nav .lg-surface--toggle");
    expect(styles).toContain("-webkit-backdrop-filter: none !important");
    expect(styles).toContain("backdrop-filter: none !important");
  });

  it("uses material focus instead of system-blue or hard white rings", () => {
    const surfaceRule = collectCssRuleBodies(styles, ".lg-surface").join("\n");
    const focusRules = [
      ...collectCssRuleBodies(styles, ".lg-surface:focus-visible"),
      ...collectCssRuleBodies(
        styles,
        ".lg-surface--interactive:not(.lg-surface--disabled):focus-visible"
      ),
      ...collectCssRuleBodies(styles, ".lg-tabs__tab:focus-visible"),
      ...collectCssRuleBodies(styles, ".lg-switch:focus-visible .lg-switch__thumb"),
      ...collectCssRuleBodies(styles, ".lg-slider:focus-within .lg-slider__thumb"),
      ...collectCssRuleBodies(styles, ".lg-searchbox:focus-within"),
      ...collectCssRuleBodies(styles, ".lg-field-control:focus-within")
    ].join("\n");

    expect(focusRules).not.toContain("--lg-accent");
    expect(focusRules).not.toContain("#0a84ff");
    expect(focusRules).not.toContain("0 0 0 1px");
    expect(focusRules).not.toContain("--lg-control-focus-rim");
    expect(tokens).toContain("--lg-control-focus-fill: rgba(255, 255, 255, 0.64)");
    expect(tokens).toContain("--lg-control-focus-surface: rgba(255, 255, 255, 0.72)");
    expect(tokens).toContain("--lg-control-focus-edge: rgba(255, 255, 255, 0.56)");
    expect(tokens).toContain("--lg-control-focus-depth: rgba(58, 76, 96, 0.08)");
    expect(tokens).toContain("--lg-control-focus-mist: rgba(255, 255, 255, 0.46)");
    expect(tokens).toContain("--lg-control-focus-lift-shadow:");
    expect(tokens).toContain("--lg-control-focus-shadow-soft:");
    expect(tokens).toContain("--lg-control-focus-shadow-deep:");
    expect(tokens).toContain("--lg-control-focus-fill: rgba(244, 249, 255, 0.58)");
    expect(tokens).toContain("--lg-control-focus-surface: rgba(244, 249, 255, 0.54)");
    expect(tokens).toContain("--lg-control-focus-depth: rgba(190, 216, 245, 0.13)");
    expect(tokens).not.toContain("--lg-control-focus-depth: rgba(0, 0, 0, 0.16)");
    expect(tokens).not.toContain("--lg-control-focus-depth: rgba(0, 0, 0");
    expect(tokens).not.toContain("inset 0 -1px 0 rgba(0, 0, 0");
    expect(focusRules).not.toContain("var(--lg-surface-shadow)");
    expect(focusRules).not.toContain("var(--lg-glass-shadow)");
    expect(focusRules).toContain("var(--lg-control-focus-lift-shadow)");
    expect(surfaceRule).not.toContain("--lg-control-focus-fill:");
    expect(surfaceRule).not.toContain("--lg-control-focus-depth:");
    expect(focusRules).toContain("--lg-control-focus-fill");
    expect(focusRules).toContain("--lg-control-focus-surface");
    expect(focusRules).toContain("--lg-control-focus-shadow");
    expect(focusRules).not.toContain("0 4px 16px var(--lg-control-focus-depth)");
    expect(focusRules).not.toContain("0 4px 14px var(--lg-control-focus-depth)");
    expect(focusRules).not.toContain(
      "background: var(--lg-control-focus-fill);\n  box-shadow: var(--lg-control-focus-shadow-deep);\n  transform: scale(0.72)"
    );
    expect(focusRules).not.toContain(
      "background: var(--lg-control-focus-fill);\n  box-shadow: var(--lg-control-focus-shadow-deep);\n  transform: translateX(-50%) scale(0.68)"
    );
    expect(focusRules).toContain("filter: saturate");
    expect(focusRules).toContain("scale(");
  });

  it("keeps shadcn primitive focus targets on frosted material with growth", () => {
    const focusContracts = [
      { growth: ".lg-input-otp__field:focus-visible" },
      { growth: ".lg-radio-group__item:has(.lg-radio-group__input:focus-visible)" },
      { growth: ".lg-tabs__tab:focus-visible" },
      { growth: ".lg-tabs__panel:focus-visible" },
      { growth: ".lg-accordion__trigger:focus-visible" },
      { growth: ".lg-menu__item:focus-visible" },
      { growth: ".lg-command__item[data-selected]" },
      { growth: ".lg-context-menu__trigger:focus-visible" },
      { growth: ".lg-menubar__trigger:focus-visible" },
      { growth: ".lg-tooltip__trigger:focus-visible" },
      { growth: ".lg-hover-card__trigger:focus-visible" },
      { growth: ".lg-nav .lg-surface--button:focus-visible" },
      {
        growth: ".lg-field-control:focus-within",
        material: ".lg-field-control:focus-within"
      },
      {
        growth: ".lg-surface--interactive:not(.lg-surface--disabled):focus-visible",
        material: ".lg-surface:focus-visible"
      },
      { growth: ".lg-switch:focus-visible .lg-switch__thumb" },
      { growth: ".lg-slider:focus-within .lg-slider__thumb" },
      { growth: ".lg-breadcrumb__link:focus-visible" },
      { growth: ".lg-checkbox__input:focus-visible + .lg-checkbox__surface" },
      { growth: ".lg-data-table__sort:focus-visible" },
      { growth: ".lg-sidebar-menu__button:focus-visible" },
      { growth: ".lg-pagination__link:focus-visible" },
      { growth: ".lg-scroll-area__viewport:focus-visible" },
      { growth: ".lg-resizable__handle:focus-visible" },
      {
        growth:
          '.lg-precision-lens-demo__handle:focus-visible:not([data-liquid-droplet="pressed"]):not([data-liquid-dragging="true"])'
      },
      { growth: ".lg-calendar__nav-button:focus-visible" },
      { growth: ".lg-calendar__day-button:focus-visible" },
      {
        growth: ".lg-calendar__day--today .lg-calendar__day-button:focus-visible",
        material: ".lg-calendar__day--today .lg-calendar__day-button:focus-visible"
      }
    ];
    const missingContracts = focusContracts.flatMap(({ growth, material = growth }) => {
      const materialBody = collectCssRuleBodyForSelector(styles, material);
      const growthBody = collectCssRuleBodyForSelector(styles, growth);
      const violations = [];

      if (!materialBody || !growthBody) {
        return [`${growth}: missing focus rule`];
      }

      if (
        !materialBody.includes("--lg-control-focus-fill") &&
        !materialBody.includes("--lg-control-focus-surface") &&
        !materialBody.includes("--lg-control-focus-mist") &&
        !materialBody.includes("--lg-control-focus-shadow")
      ) {
        violations.push("missing frosted material");
      }

      if (
        !growthBody.includes("transform:") &&
        !growthBody.includes("--lg-demo-droplet-scale") &&
        !growthBody.includes("--lg-demo-focus-scale")
      ) {
        violations.push("missing focus growth");
      }

      return violations.length > 0 ? [`${growth}: ${violations.join(", ")}`] : [];
    });

    expect(missingContracts).toEqual([]);

    const tooltipTriggerBody = [
      collectCssRuleBodyForSelector(styles, ".lg-tooltip__trigger"),
      collectCssRuleBodyForSelector(styles, ".lg-hover-card__trigger")
    ].join("\n");

    expect(tooltipTriggerBody).toContain("background: transparent");
    expect(tooltipTriggerBody).toContain("border: 0");
    expect(tooltipTriggerBody).toContain("font: inherit");
  });

  it("keeps OTP focus out of native dark input selection chrome", () => {
    const otpBaseBody = collectCssRuleBodyForSelector(styles, ".lg-input-otp__field");
    const otpFocusBody = collectCssRuleBodyForSelector(
      styles,
      ".lg-input-otp__field:focus-visible"
    );
    const otpSelectionBody = collectCssRuleBodyForSelector(
      styles,
      ".lg-input-otp__field::selection"
    );

    expect(otpBaseBody).toContain("-webkit-appearance: none");
    expect(otpBaseBody).toContain("appearance: none");
    expect(otpBaseBody).toContain("color-scheme: only light");
    expect(otpBaseBody).toContain("caret-color:");
    expect(otpBaseBody).toContain("background-clip: padding-box");
    expect(otpFocusBody).toContain("background-color: rgba(255, 255, 255, 0.9)");
    expect(otpFocusBody).toContain("--lg-control-focus-surface");
    expect(otpFocusBody).toContain("caret-color:");
    expect(otpFocusBody).toContain("outline: none");
    expect(otpFocusBody).not.toContain("background: var(--lg-control-focus-fill)");
    expect(otpSelectionBody).toContain("--lg-control-focus-fill");
    expect(otpSelectionBody).toContain("rgba(255, 255, 255");
    expect(otpSelectionBody).not.toContain("rgba(0, 0, 0");
    expect(otpSelectionBody).not.toContain("black");
  });

  it("shares focus shadow material tokens across component-specific focus states", () => {
    const shadowContracts = [
      [".lg-searchbox:focus-within", "--lg-control-focus-shadow-deep"],
      [".lg-field-control:focus-within", "--lg-control-focus-shadow-deep"],
      [".lg-input-otp__field:focus-visible", "--lg-control-focus-shadow-deep"],
      [".lg-tabs__tab:focus-visible", "--lg-control-focus-shadow-deep"],
      [".lg-accordion__trigger:focus-visible", "--lg-control-focus-shadow-deep"],
      [".lg-surface:focus-visible", "--lg-control-focus-shadow-deep"],
      [".lg-switch:focus-visible .lg-switch__thumb", "--lg-control-focus-shadow-deep"],
      [".lg-slider:focus-within .lg-slider__thumb", "--lg-control-focus-shadow-deep"],
      [".lg-command__item[data-selected]", "--lg-control-focus-shadow-soft"],
      [".lg-menu__item:focus-visible", "--lg-control-focus-shadow-soft"],
      [".lg-menubar__trigger:focus-visible", "--lg-control-focus-shadow-soft"],
      [".lg-tooltip__trigger:focus-visible", "--lg-control-focus-shadow-soft"],
      [".lg-breadcrumb__link:focus-visible", "--lg-control-focus-shadow-soft"],
      [
        ".lg-checkbox__input:focus-visible + .lg-checkbox__surface",
        "--lg-control-focus-shadow-soft"
      ],
      [".lg-data-table__sort:focus-visible", "--lg-control-focus-shadow-soft"],
      [".lg-sidebar-menu__button:focus-visible", "--lg-control-focus-shadow-soft"],
      [".lg-pagination__link:focus-visible", "--lg-control-focus-shadow-soft"],
      [".lg-scroll-area__viewport:focus-visible", "--lg-control-focus-shadow-soft"],
      [".lg-resizable__handle:focus-visible", "--lg-control-focus-shadow-soft"],
      [".lg-calendar__nav-button:focus-visible", "--lg-control-focus-shadow-soft"],
      [".lg-calendar__day-button:focus-visible", "--lg-control-focus-shadow-soft"]
    ];
    const missingShadowContracts = shadowContracts.flatMap(([selector, token]) => {
      const body = collectCssRuleBodyForSelector(styles, selector);

      return body.includes(token) ? [] : [`${selector}: missing ${token}`];
    });

    expect(missingShadowContracts).toEqual([]);
  });

  it("keeps calendar today focus from collapsing to the idle today marker", () => {
    const todayBody = collectCssRuleBodyForSelector(
      styles,
      ".lg-calendar__day--today .lg-calendar__day-button"
    );
    const todayFocusBody = collectCssRuleBodyForSelector(
      styles,
      ".lg-calendar__day--today .lg-calendar__day-button:focus-visible"
    );

    expect(todayBody).toContain("inset 0 0 0 1px");
    expect(todayFocusBody).toContain("var(--lg-control-focus-shadow-soft)");
    expect(todayFocusBody).toContain("var(--lg-control-focus-lift-shadow)");
    expect(todayFocusBody).not.toContain("var(--lg-glass-shadow)");
    expect(todayFocusBody).not.toContain("inset 0 0 0 1px");
  });

  it("keeps nav and toolbar focus growth after the generic surface focus cascade", () => {
    const rules = collectCssRules(styles);
    const genericFocusIndex = rules.findIndex((rule) => {
      return (
        normalizeCssSelector(rule.selector)
          .split(", ")
          .includes(".lg-surface--interactive:not(.lg-surface--disabled):focus-visible") &&
        rule.body.includes("scale(1.025)")
      );
    });
    const navFocusIndex = rules.findIndex((rule, index) => {
      return (
        index > genericFocusIndex &&
        normalizeCssSelector(rule.selector)
          .split(", ")
          .includes(".lg-nav .lg-surface--button:focus-visible") &&
        rule.body.includes("scale(1.05)") &&
        rule.body.includes("text-shadow: none")
      );
    });

    expect(genericFocusIndex).toBeGreaterThan(-1);
    expect(navFocusIndex).toBeGreaterThan(genericFocusIndex);
  });

  it("keeps every focus rule in the transparent frosted material family", () => {
    const focusRules = collectCssRules(styles).filter(
      ({ selector }) =>
        selector.includes(":focus") ||
        selector.includes("focus-within") ||
        selector.includes("focus-visible")
    );
    const offenders = focusRules
      .map(({ body, selector }) => {
        const violations = [];

        if (body.includes("var(--lg-accent)") || body.includes("#0a84ff")) {
          violations.push("accent focus ring");
        }

        if (
          body.includes("drop-shadow") ||
          body.includes("rgba(33, 34, 34") ||
          body.includes("rgba(34, 36, 36") ||
          body.includes("rgba(34, 38, 39") ||
          body.includes("rgba(40, 42, 44")
        ) {
          violations.push("darkened focus material");
        }

        if (/(?:^|[;\n]\s*)color:\s*(?:#fff|white|rgba\(255,\s*255,\s*255,\s*0\.9)/.test(body)) {
          violations.push("forced white focus text");
        }

        const textShadow = body.match(/text-shadow:\s*([^;]+)/);
        if (textShadow && textShadow[1]?.trim() !== "none") {
          violations.push("focus text shadow");
        }

        return violations.length > 0 ? `${selector}: ${violations.join(", ")}` : null;
      })
      .filter(Boolean);

    expect(offenders).toEqual([]);
  });

  it("keeps command roving focus on frosted material instead of a dark selected slab", () => {
    const body = collectCssRuleBodyForSelector(styles, ".lg-command__item[data-selected]");

    expect(body).toContain("background: var(--lg-control-focus-surface)");
    expect(body).toContain("box-shadow: var(--lg-control-focus-shadow-soft)");
    expect(body).toContain("text-shadow: none");
    expect(body).toContain("transform: scale(1.012)");
    expect(body).not.toContain("rgba(24, 26, 30");
    expect(body).not.toContain("rgba(255, 255, 255, 0.94)");
    expect(body).not.toContain("0 1px 2px rgba(0, 0, 0");
  });

  it("runs real browser focus audits for foundation, navigation, calendar, data, and layout primitives", () => {
    const auditedFocusTargets = [
      "breadcrumb",
      "checkbox",
      "radioGroup",
      "nativeSelect",
      "select",
      "pagination",
      "scrollArea",
      "dataTableSort",
      "sidebarMenuButton",
      "sidebarMenuAction",
      "sidebarRail",
      "calendarNav",
      "calendarDay",
      "datePickerTrigger",
      "resizableHandle",
      "toggle",
      "segmentedControl",
      "toolbar",
      "contextMenuTrigger",
      "popoverTrigger",
      "dialogTrigger",
      "comboboxTrigger",
      "carouselNext",
      "hoverCardTrigger",
      "menubarTrigger",
      "tooltipTrigger",
      "switch",
      "slider"
    ];

    for (const target of auditedFocusTargets) {
      expect(verifyLiquidBehaviorSource).toContain(`name: "${target}"`);
    }

    expect(verifyLiquidBehaviorSource).toContain("const focusAuditTargets = [");
    expect(verifyLiquidBehaviorSource).toContain(
      "verifyFocusMaterial(target.name, target.options)"
    );
    expect(verifyLiquidBehaviorSource).toContain("for (let attempt = 1; attempt <= 3");
    expect(verifyLiquidBehaviorSource).toContain("await page.close().catch(() => {})");
    expect(verifyLiquidBehaviorSource).toContain("await waitForStoryReady(page, id)");
    expect(verifyLiquidBehaviorSource).toContain("await page.waitForTimeout(420)");
    expect(verifyLiquidBehaviorSource).toContain("Storybook story did not become ready");
    expect(verifyLiquidBehaviorSource).toContain("focusAuditResults.push");
    expect(verifyLiquidBehaviorSource).toContain('materialSelector: ".lg-switch__track"');
    expect(verifyLiquidBehaviorSource).toContain('materialSelector: ".lg-slider__track"');
    expect(verifyLiquidBehaviorSource).toContain("requireMaterialResponse: true");
    expect(verifyLiquidBehaviorSource).toContain("assertMaterialResponse");
    expect(verifyLiquidBehaviorSource).toContain("materialFilterChanged");
    expect(verifyLiquidBehaviorSource).toContain("materialShadowLayerDelta");
    expect(verifyLiquidBehaviorSource).toContain("focus-material-audit.json");
    expect(verifyLiquidBehaviorSource).toContain(
      "const minimumFocusAuditCount = focusAuditTargets.length"
    );
  });

  it("runs real browser hover, active, and slider drag material audits", () => {
    const auditedInteractionTargets = ["tabs", "nav", "searchbox", "switch", "slider"];

    expect(verifyLiquidBehaviorSource).toContain("const interactionAuditTargets = [");
    for (const target of auditedInteractionTargets) {
      expect(verifyLiquidBehaviorSource).toContain(`name: "${target}"`);
    }

    expect(verifyLiquidBehaviorSource).toContain("verifyPointerInteractionMaterial(target)");
    expect(verifyLiquidBehaviorSource).toContain("await pointerLocator.hover()");
    expect(verifyLiquidBehaviorSource).toContain("await page.mouse.down()");
    expect(verifyLiquidBehaviorSource).toContain("dragOffset: { x: 140, y: 0 }");
    expect(verifyLiquidBehaviorSource).toContain("minimumDragLeftDelta");
    expect(verifyLiquidBehaviorSource).toContain(
      "assertMaterialResponse(idleMaterial, hoveredMaterial"
    );
    expect(verifyLiquidBehaviorSource).toContain(
      "assertMaterialResponse(idleMaterial, activeMaterial"
    );
    expect(verifyLiquidBehaviorSource).toContain("pointer-interaction-audit.json");
    expect(verifyLiquidBehaviorSource).toContain("interactionAuditResults.push");
    expect(verifyLiquidBehaviorSource).toContain("dragged lens narrows vs press");
    expect(verifyLiquidBehaviorSource).toContain("dragged lens grows taller vs press");
    expect(verifyLiquidBehaviorSource).toContain("dragged lens remains water-drop tall");

    expect(styles).toContain(".lg-searchbox:hover:not(:focus-within)");
    expect(styles).toContain(".lg-searchbox:active:not(:focus-within)");
    expect(styles).toContain(".lg-switch:hover .lg-switch__track");
    expect(styles).toContain(".lg-switch:active .lg-switch__thumb");
    expect(styles).toContain(".lg-slider:hover .lg-slider__track");
    expect(styles).toContain(".lg-slider:has(.lg-slider__input:active) .lg-slider__thumb");
  });

  it("retries transient Storybook iframe misses before failing behavior audits", () => {
    expect(verifyLiquidBehaviorSource).toContain("for (let attempt = 1; attempt <= 3;");
    expect(verifyLiquidBehaviorSource).toContain("lastError = error");
    expect(verifyLiquidBehaviorSource).toContain("await page.close().catch(() => {})");
    expect(verifyLiquidBehaviorSource).toContain('return "application/json; charset=utf-8"');
    expect(verifyLiquidBehaviorSource).toContain("throw lastError");
  });

  it("captures real idle and focused screenshots for every focus material audit target", () => {
    expect(verifyLiquidBehaviorSource).toContain("const focusScreenshotDir");
    expect(verifyLiquidBehaviorSource).toContain('path.join(behaviorArtifactDir, "focus")');
    expect(verifyLiquidBehaviorSource).toContain("await fs.mkdir(focusScreenshotDir");
    expect(verifyLiquidBehaviorSource).toContain("safeFileSegment(name)");
    expect(verifyLiquidBehaviorSource).toContain("-idle.png");
    expect(verifyLiquidBehaviorSource).toContain("-focused.png");
    expect(verifyLiquidBehaviorSource).toContain("captureFocusScreenshot(");
    expect(verifyLiquidBehaviorSource).toContain("await locator.scrollIntoViewIfNeeded");
    expect(verifyLiquidBehaviorSource).toContain("await locator.screenshot");
    expect(verifyLiquidBehaviorSource).toContain("await page.screenshot");
    expect(verifyLiquidBehaviorSource).toContain("screenshots:");
    expect(verifyLiquidBehaviorSource).toContain("screenshotCaptureModes:");
    expect(verifyLiquidBehaviorSource).toContain("viewport-fallback");
    expect(verifyLiquidBehaviorSource).toContain("unavailable");
    expect(verifyLiquidBehaviorSource).toContain("path.relative(behaviorArtifactDir");
    expect(verifyLiquidBehaviorSource).toContain("measureScreenshotLuma");
    expect(verifyLiquidBehaviorSource).toContain("createImageBitmap");
    expect(verifyLiquidBehaviorSource).toContain("minimumFocusedScreenshotLuma");
    expect(verifyLiquidBehaviorSource).toContain("maximumFocusedScreenshotLumaLoss");
    expect(verifyLiquidBehaviorSource).toContain("minimumFocusedScreenshotLuma: 232");
    expect(verifyLiquidBehaviorSource).toContain("maximumFocusedScreenshotLumaLoss: 18");
    expect(verifyLiquidBehaviorSource).toContain("minimumFocusedScreenshotLuma: 226");
    expect(verifyLiquidBehaviorSource).toContain("maximumFocusedScreenshotLumaLoss: 22");
    expect(verifyLiquidBehaviorSource).toContain("minimumFocusedScreenshotLuma: 168");
    expect(verifyLiquidBehaviorSource).toContain("maximumFocusedScreenshotDarkPixelRatio: 0.3");
    expect(verifyLiquidBehaviorSource).toContain("maximumFocusedScreenshotBlackPixelRatio: 0.14");
    expect(verifyLiquidBehaviorSource).toContain("maximumFocusedScreenshotDarkPixelRatio: 0.02");
    expect(verifyLiquidBehaviorSource).toContain('contextScreenshotSelector: ".lg-input-otp"');
    expect(verifyLiquidBehaviorSource).toContain('contextScreenshotSelector: ".lg-switch"');
    expect(verifyLiquidBehaviorSource).toContain('contextScreenshotSelector: ".lg-slider"');
    expect(verifyLiquidBehaviorSource).toContain('selector: ".lg-switch"');
    expect(verifyLiquidBehaviorSource).toContain('selector: ".lg-slider"');
    expect(verifyLiquidBehaviorSource).toContain("requireFocusedElementShadow: false");
    expect(verifyLiquidBehaviorSource).toContain("requireMaterialShadowLayerGrowth: true");
    expect(verifyLiquidBehaviorSource).toContain("focus material shadow layers");
    expect(verifyLiquidBehaviorSource).toContain("minimumFocusedContextScreenshotLuma: 232");
    expect(verifyLiquidBehaviorSource).toContain(
      "maximumFocusedContextScreenshotDarkPixelRatio: 0.03"
    );
    expect(verifyLiquidBehaviorSource).toContain("focusedContextScreenshotMeanLuma");
    expect(verifyLiquidBehaviorSource).toContain("focusedContextScreenshotDarkPixelRatio");
    expect(verifyLiquidBehaviorSource).toContain(
      "options.maximumFocusedScreenshotBlackPixelRatio ?? 0.72"
    );
    expect(verifyLiquidBehaviorSource).toContain("focusedScreenshotBlackPixelRatio");
    expect(verifyLiquidBehaviorSource).toContain("blackPixelRatio");
    expect(verifyLiquidBehaviorSource).toContain("focusedScreenshotDarkPixelRatio");
    expect(verifyLiquidBehaviorSource).toContain("darkPixelRatio");
    expect(verifyLiquidBehaviorSource).toContain("focusedScreenshotMeanLuma");
    expect(verifyLiquidBehaviorSource).toContain("idleScreenshotMeanLuma");
  });

  it("removes elastic focus transforms for every frosted focus target in reduced motion", () => {
    const reducedMotionBlock = Array.from(
      styles.matchAll(/@media \(prefers-reduced-motion: reduce\) \{([\s\S]*?)\n\}/g),
      (match) => match[1] ?? ""
    ).find((block) =>
      block.includes(".lg-surface--interactive:not(.lg-surface--disabled):focus-visible")
    );
    const reducedMotionFocusSelectors = [
      ".lg-surface--interactive:not(.lg-surface--disabled):focus-visible",
      ".lg-input-otp__field:focus-visible",
      ".lg-radio-group__item:has(.lg-radio-group__input:focus-visible)",
      ".lg-tabs__tab:focus-visible",
      ".lg-tabs__panel:focus-visible",
      ".lg-accordion__trigger:focus-visible",
      ".lg-menu__item:focus-visible",
      ".lg-command__item[data-selected]",
      ".lg-context-menu__trigger:focus-visible",
      ".lg-menubar__trigger:focus-visible",
      ".lg-tooltip__trigger:focus-visible",
      ".lg-hover-card__trigger:focus-visible",
      ".lg-nav .lg-surface--button:focus-visible",
      ".lg-nav .lg-surface--toggle:focus-visible",
      ".lg-toolbar .lg-surface--button:focus-visible",
      ".lg-toolbar .lg-surface--toggle:focus-visible",
      ".lg-searchbox:focus-within",
      ".lg-field-control:focus-within",
      ".lg-breadcrumb__link:focus-visible",
      ".lg-checkbox__input:focus-visible + .lg-checkbox__surface",
      ".lg-data-table__sort:focus-visible",
      ".lg-sidebar-menu__button:focus-visible",
      ".lg-sidebar-group__action:focus-visible",
      ".lg-sidebar-menu__action:focus-visible",
      ".lg-sidebar-rail:focus-visible",
      ".lg-pagination__link:focus-visible",
      ".lg-scroll-area__viewport:focus-visible",
      ".lg-resizable__handle:focus-visible",
      ".lg-calendar__nav-button:focus-visible",
      ".lg-calendar__day-button:focus-visible"
    ];

    expect(reducedMotionBlock).toContain("transform: none");
    expect(reducedMotionBlock).toContain("animation: none");
    for (const selector of reducedMotionFocusSelectors) {
      expect(reducedMotionBlock).toContain(selector);
    }
  });

  it("models search focus as a frosted capsule growing from idle scale", () => {
    const searchboxRule = collectCssRuleBodies(styles, ".lg-searchbox").join("\n");
    const searchboxContentRule = collectCssRuleBodies(
      styles,
      ".lg-searchbox > .lg-surface__content"
    ).join("\n");
    const enhancedSearchboxContentRule = collectCssRuleBodyForSelector(
      styles,
      ".lg-surface--enhanced.lg-searchbox > .lg-surface__content"
    );
    const kubeSearchboxHostRule = collectCssRuleBodies(
      styles,
      ".lg-searchbox.lg-searchbox--kube-reference"
    ).join("\n");
    const kubeSearchboxContentRule = collectCssRuleBodies(
      styles,
      ".lg-searchbox--kube-reference > .lg-surface__content"
    ).join("\n");
    const kubeSearchboxIconRule = collectCssRuleBodies(
      styles,
      ".lg-searchbox--kube-reference .lg-searchbox__icon"
    ).join("\n");
    const kubeSearchboxMagnifierRule = collectCssRuleBodies(
      styles,
      ".lg-searchbox--kube-reference .lg-searchbox__magnifier"
    ).join("\n");
    const focusRule = collectCssRuleBodies(styles, ".lg-searchbox:focus-within").join("\n");
    const searchboxPillRule = collectCssRuleBodies(styles, ".lg-surface--pill.lg-searchbox").join(
      "\n"
    );
    const reducedMotionRule = collectCssRuleBodies(
      styles,
      ".lg-searchbox[data-liquid-reduced-motion]"
    ).join("\n");

    expect(searchboxRule).toContain("width: 26.25rem");
    expect(searchboxRule).toContain("max-width: 100%");
    expect(searchboxRule).toContain("height: 3.5rem");
    expect(searchboxRule).toContain("padding: 0");
    expect(searchboxRule).not.toContain("inset");
    expect(searchboxRule).toContain("transform: scale(0.8)");
    expect(searchboxRule).toContain("transition:");
    expect(searchboxRule).toContain("transform 260ms");
    expect(searchboxContentRule).toContain("position: absolute");
    expect(searchboxContentRule).toContain("inset: 0");
    expect(searchboxContentRule).toContain("text-shadow: none");
    expect(searchboxContentRule).toContain("height: 100%");
    expect(searchboxContentRule).toContain("box-sizing: border-box");
    expect(searchboxContentRule).toContain("padding: 0 1.25rem");
    expect(searchboxContentRule).toContain("border-radius: inherit");
    expect(searchboxContentRule).toContain("align-items: center");
    expect(searchboxPillRule).toContain("padding: 0");
    expect(enhancedSearchboxContentRule).toContain("text-shadow: none");
    expect(focusRule).toContain("background: var(--lg-control-focus-fill)");
    expect(focusRule).toContain("box-shadow: var(--lg-control-focus-shadow-deep)");
    expect(focusRule).toContain("transform: scale(1)");
    expect(reducedMotionRule).toContain("transform: none");
    expect(searchboxStorySource).toContain('className: "lg-searchbox--kube-reference"');
    expect(searchboxStorySource).toContain('top: "calc(50% + 1.5px)"');
    expect(searchboxStorySource).toContain("radius: 28");
    expect(kubeSearchboxHostRule).toContain("width: 21rem");
    expect(kubeSearchboxHostRule).toContain("height: 2.8rem");
    expect(kubeSearchboxHostRule).toContain("border: 0");
    expect(kubeSearchboxHostRule).toContain("border-radius: 28px");
    expect(kubeSearchboxHostRule).toContain("font-size: 1rem");
    expect(kubeSearchboxHostRule).toContain("line-height: 1.375rem");
    expect(kubeSearchboxHostRule).toContain("transform: none");
    expect(kubeSearchboxContentRule).toContain("padding: 0 0.8125rem");
    expect(kubeSearchboxContentRule).toContain("border-radius: 28px");
    expect(kubeSearchboxContentRule).toContain("gap: 0.4875rem");
    expect(kubeSearchboxContentRule).toContain("font-size: 1rem");
    expect(kubeSearchboxIconRule).toContain(
      "color: color-mix(in srgb, var(--lg-text), transparent 10%)"
    );
    expect(kubeSearchboxIconRule).toContain("opacity: 0.7");
    expect(kubeSearchboxMagnifierRule).toContain("width: 1rem");
    expect(kubeSearchboxMagnifierRule).toContain("height: 1rem");
    expect(kubeSearchboxMagnifierRule).toContain("opacity: 0.7");
  });

  it("keeps source and registry components free of hard-coded focus rings", () => {
    const sourceFiles = collectFiles(["src/components", "registry/components"], ".tsx");
    const offenders = sourceFiles.flatMap((filePath) => {
      const source = fs.readFileSync(filePath, "utf8");
      const matches = source
        .split("\n")
        .filter((line) =>
          /\b(?:focus|focus-visible):(?:ring|outline|shadow|border-(?:black|white|blue)|bg-(?:black|white|blue)|text-white)|\b(?:outline-none|ring-\d|ring-offset)/.test(
            line
          )
        );

      return matches.map((match) => `${filePath}: ${match.trim()}`);
    });

    expect(offenders).toEqual([]);
  });
});

function collectCssRuleBodyForSelector(css: string, selector: string) {
  const normalizedSelector = normalizeCssSelector(selector);

  return collectCssRules(css)
    .filter(({ selector: ruleSelector }) =>
      normalizeCssSelector(ruleSelector)
        .split(", ")
        .map((part) => part.trim())
        .includes(normalizedSelector)
    )
    .map(({ body }) => body)
    .join("\n");
}

function isMonotonic(options: DefaultRefractiveOptions[], key: keyof DefaultRefractiveOptions) {
  return options.every((option, index) => {
    if (index === 0) {
      return true;
    }

    return Number(option[key] ?? 0) >= Number(options[index - 1]?.[key] ?? 0);
  });
}

function collectCssRuleBodies(css: string, selector: string) {
  const normalizedSelector = normalizeCssSelector(selector);
  return collectCssRules(css)
    .filter((rule) => normalizeCssSelector(rule.selector) === normalizedSelector)
    .map((rule) => rule.body);
}

function readKubeMaxDiffRatio(name: string) {
  const pattern = new RegExp(`name:\\s*"${name}"[\\s\\S]*?maxDiffRatio:\\s*([0-9.]+)`, "m");
  const match = kubeReferenceCompareSource.match(pattern);

  if (!match?.[1]) {
    throw new Error(`Missing Kube maxDiffRatio for ${name}`);
  }

  return Number(match[1]);
}

function readRasterSize(bytes: Buffer) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    return readJpegSize(bytes);
  }

  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return { height: bytes.readUInt32BE(20), width: bytes.readUInt32BE(16) };
  }

  throw new Error("Unsupported raster fixture format");
}

function readJpegSize(bytes: Buffer) {
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

  throw new Error("Unable to read JPEG fixture dimensions");
}

function isJpegStartOfFrame(marker: number) {
  return marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
}

function collectCssRules(css: string) {
  const matcher = /([^{}]+)\{([^{}]*)\}/g;

  return Array.from(css.matchAll(matcher), (match) => ({
    body: (match[2] ?? "").trim(),
    selector: (match[1] ?? "").trim().replace(/\s+/g, " ")
  }));
}

function collectFiles(directories: string[], extension: string) {
  return directories.flatMap((directory) =>
    fs
      .readdirSync(path.resolve(directory))
      .filter((fileName) => fileName.endsWith(extension))
      .map((fileName) => path.resolve(directory, fileName))
  );
}

function normalizeCssSelector(selector: string) {
  return selector
    .replace(/\s+/g, " ")
    .replace(/:not\(\s+/g, ":not(")
    .replace(/\s+\)/g, ")")
    .replace(/\s*,\s*/g, ", ")
    .trim();
}
