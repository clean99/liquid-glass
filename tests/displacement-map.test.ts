import { describe, expect, it } from "vitest";
import {
  createLensDisplacementPixelMap,
  createLensFilterPixelMaps,
  createLensSpecularPixelMap,
  referenceLensGeometry,
  resolveLensReferencePipeline,
  sampleCapsuleField,
  type LiquidPixelMap
} from "../src";

describe("lens displacement pixel maps", () => {
  it("creates default reference maps at the expected optical dimensions", () => {
    const maps = createLensFilterPixelMaps();

    expect(maps.magnification.pixelRatio).toBe(1);
    expect(maps.magnification.width).toBe(referenceLensGeometry.opticalWidth);
    expect(maps.magnification.height).toBe(referenceLensGeometry.opticalHeight);
    expect(maps.magnification.data).toHaveLength(
      referenceLensGeometry.opticalWidth * referenceLensGeometry.opticalHeight * 4
    );

    for (const map of [maps.displacement, maps.specular]) {
      const expectedWidth = referenceLensGeometry.opticalWidth * 2;
      const expectedHeight = referenceLensGeometry.opticalHeight * 2;

      expect(map.pixelRatio).toBe(2);
      expect(map.width).toBe(expectedWidth);
      expect(map.height).toBe(expectedHeight);
      expect(map.data).toHaveLength(expectedWidth * expectedHeight * 4);
    }
  });

  it("allows tests to force one deterministic pixel ratio for every map", () => {
    const maps = createLensFilterPixelMaps({ pixelRatio: 3 });
    const expectedWidth = referenceLensGeometry.opticalWidth * 3;
    const expectedHeight = referenceLensGeometry.opticalHeight * 3;

    for (const map of [maps.displacement, maps.magnification, maps.specular]) {
      expect(map.pixelRatio).toBe(3);
      expect(map.width).toBe(expectedWidth);
      expect(map.height).toBe(expectedHeight);
    }
  });

  it("keeps the displacement center neutral while bending each bevel along its normal", () => {
    const [, displacementStage] = resolveLensReferencePipeline().stages;
    const map = createLensDisplacementPixelMap(displacementStage, { pixelRatio: 1 });

    expect(rgbaAt(map, 105, 75)).toEqual([128, 128, 0, 255]);

    const top = rgbaAt(map, 105, 1);
    const bottom = rgbaAt(map, 105, 149);
    const left = rgbaAt(map, 1, 75);
    const right = rgbaAt(map, 209, 75);

    expect(top[1]).toBeGreaterThan(128);
    expect(bottom[1]).toBeLessThan(128);
    expect(left[0]).toBeGreaterThan(128);
    expect(right[0]).toBeLessThan(128);
  });

  it("keeps spatial falloff separate from physical bevel scale", () => {
    const [magnificationStage, displacementStage] = resolveLensReferencePipeline().stages;

    expect(magnificationStage.mapFalloffWidth).toBe(referenceLensGeometry.radius);
    expect(displacementStage.mapFalloffWidth).toBe(referenceLensGeometry.radius);
    expect(displacementStage.bezelWidth).toBe(18);
  });

  it("keeps points outside the capsule transparent in the specular map", () => {
    const map = createLensSpecularPixelMap({ pixelRatio: 1 });

    expect(rgbaAt(map, 0, 0)).toEqual([0, 0, 0, 0]);
    expect(rgbaAt(map, 105, 1)[3]).toBeGreaterThan(rgbaAt(map, 105, 75)[3]);
  });

  it("samples the capsule field with finite normals and no outside false positives", () => {
    const top = sampleCapsuleField(105, 1);
    const left = sampleCapsuleField(1, 75);

    expect(sampleCapsuleField(0, 0)).toBeNull();
    expect(top).toMatchObject({
      distanceFromEdge: 1,
      normalX: 0,
      normalY: -1
    });
    expect(left?.normalX).toBeLessThan(0);
    expect(left?.normalY).toBeCloseTo(0, 6);
    expect(Number.isFinite(left?.distanceFromEdge)).toBe(true);
  });

  it("clamps invalid pixel ratios to deterministic integer maps", () => {
    const [, displacementStage] = resolveLensReferencePipeline().stages;
    const map = createLensDisplacementPixelMap(displacementStage, { pixelRatio: Number.NaN });

    expect(map.pixelRatio).toBe(3);
    expect(map.width).toBe(referenceLensGeometry.opticalWidth * 3);
    expect(map.height).toBe(referenceLensGeometry.opticalHeight * 3);
  });
});

function rgbaAt(map: LiquidPixelMap, x: number, y: number) {
  const index = (y * map.width + x) * 4;

  return [map.data[index], map.data[index + 1], map.data[index + 2], map.data[index + 3]];
}
