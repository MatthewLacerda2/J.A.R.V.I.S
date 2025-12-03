import { Point } from "../types/drawing";

export function getPointFromEvent(
  e: MouseEvent | TouchEvent,
  canvas: HTMLDivElement | null
): Point | null {
  if (!canvas) return null;

  const rect = canvas.getBoundingClientRect();

  if (e instanceof MouseEvent) {
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  } else {
    // For touch events, try touches first, then changedTouches
    // This handles touchend events where touches is empty
    const touch = e.touches[0] || e.changedTouches[0];
    if (!touch) return null;

    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  }
}
