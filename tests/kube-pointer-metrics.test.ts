import { describe, expect, it } from "vitest";
import path from "node:path";
import { pathToFileURL } from "node:url";

describe("Kube pointer metrics", () => {
  it("measures dragged lens movement in viewport space when page scroll changes", async () => {
    const { summarizePointerActionMetrics } = (await import(
      pathToFileURL(path.resolve("scripts/kube-pointer-metrics.mjs")).href
    )) as {
      summarizePointerActionMetrics: (
        before: PointerActionSample,
        after: PointerActionSample,
        action: { kind: string }
      ) => PointerActionMetrics;
    };
    const before = {
      box: { height: 120, width: 210, x: 180, y: 224.2 },
      documentBox: { height: 120, width: 210, x: 180, y: 9590.2 },
      viewport: { height: 760, scrollX: 0, scrollY: 9366, width: 1100 }
    };
    const after = {
      box: { height: 150, width: 210, x: 312, y: 300.2 },
      documentBox: { height: 150, width: 210, x: 312, y: 300 },
      viewport: { height: 760, scrollX: 0, scrollY: 0, width: 1100 }
    };

    expect(
      summarizePointerActionMetrics(before, after, {
        kind: "drag"
      })
    ).toMatchObject({
      deltaX: 132,
      deltaY: 76,
      documentDeltaY: -9290.2,
      heightDelta: 30,
      scrollDeltaY: -9366,
      widthDelta: 0
    });
  });
});

interface PointerActionRect {
  height: number;
  width: number;
  x: number;
  y: number;
}

interface PointerActionSample {
  box: PointerActionRect;
  documentBox: PointerActionRect;
  viewport: {
    height: number;
    scrollX: number;
    scrollY: number;
    width: number;
  };
}

interface PointerActionMetrics {
  deltaX: number;
  deltaY: number;
  documentDeltaY: number;
  heightDelta: number;
  scrollDeltaY: number;
  widthDelta: number;
}
