export function summarizePointerActionMetrics(before, after, action) {
  return {
    deltaX: round(after.box.x - before.box.x),
    deltaY: round(after.box.y - before.box.y),
    documentDeltaX: round(after.documentBox.x - before.documentBox.x),
    documentDeltaY: round(after.documentBox.y - before.documentBox.y),
    height: round(after.box.height),
    heightDelta: round(after.box.height - before.box.height),
    kind: action.kind,
    scrollDeltaX: round(after.viewport.scrollX - before.viewport.scrollX),
    scrollDeltaY: round(after.viewport.scrollY - before.viewport.scrollY),
    width: round(after.box.width),
    widthDelta: round(after.box.width - before.box.width)
  };
}

function round(value) {
  return Math.round(value * 100) / 100;
}
