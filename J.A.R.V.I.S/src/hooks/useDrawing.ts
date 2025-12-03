import { RefObject, useEffect } from "react";
import { useDrawingStore } from "../stores/useDrawingStore";
import { getPointFromEvent } from "../utils/canvasUtils";

export function useDrawing(canvasRef: RefObject<HTMLDivElement | null>) {
  const { startStroke, addPointToStroke, endStroke, isDrawing, isEnabled } =
    useDrawingStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleStart = (e: MouseEvent | TouchEvent) => {
      if (!isEnabled) return;

      // Don't start drawing if clicking on media items or their children
      const target = e.target as HTMLElement;
      if (target.closest("[data-media-item]")) {
        return;
      }

      // Don't start drawing if clicking on the toolbar
      if (target.closest("[data-drawing-toolbar]")) {
        return;
      }

      e.preventDefault();
      const point = getPointFromEvent(e, canvas);
      if (point) {
        startStroke(point);
      }
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      e.preventDefault();
      const point = getPointFromEvent(e, canvas);
      if (point) {
        addPointToStroke(point);
      }
    };

    const handleEnd = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      e.preventDefault();
      endStroke();
    };

    // Mouse events
    canvas.addEventListener("mousedown", handleStart);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);

    // Touch events
    canvas.addEventListener("touchstart", handleStart, { passive: false });
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);

    return () => {
      canvas.removeEventListener("mousedown", handleStart);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      canvas.removeEventListener("touchstart", handleStart);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [
    canvasRef,
    startStroke,
    addPointToStroke,
    endStroke,
    isDrawing,
    isEnabled,
  ]);
}
