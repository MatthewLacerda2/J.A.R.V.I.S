import { RefObject, useEffect } from "react";
import { MIN_RECTANGLE_SIZE } from "../constants/diagram";
import { useDiagramStore } from "../stores/useDiagramStore";
import { Diagram } from "../types/diagram";
import { getPointFromEvent } from "../utils/canvasUtils";
import { findDiagramAtPoint } from "../utils/diagramUtils";

export function useDiagramCreation(
  canvasRef: RefObject<HTMLDivElement | null>
) {
  const toolMode = useDiagramStore((state) => state.toolMode);
  const setToolMode = useDiagramStore((state) => state.setToolMode);
  const diagrams = useDiagramStore((state) => state.diagrams);
  const addDiagram = useDiagramStore((state) => state.addDiagram);
  const isCreatingRectangle = useDiagramStore(
    (state) => state.isCreatingRectangle
  );
  const currentRectangleStart = useDiagramStore(
    (state) => state.currentRectangleStart
  );

  useEffect(() => {
    if (toolMode !== "rectangle") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleStart = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("[data-diagram-item]") ||
        target.closest("[data-arrow-item]")
      ) {
        return;
      }
      if (target.closest("[data-diagram-toolbar]")) {
        return;
      }

      e.preventDefault();
      const point = getPointFromEvent(e, canvas);
      if (point) {
        const existingDiagram = findDiagramAtPoint(point, diagrams);
        if (!existingDiagram) {
          useDiagramStore.setState({
            isCreatingRectangle: true,
            currentRectangleStart: point,
          });
        }
      }
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isCreatingRectangle || !currentRectangleStart) return;
      e.preventDefault();
    };

    const handleEnd = (e: MouseEvent | TouchEvent) => {
      if (!isCreatingRectangle || !currentRectangleStart) return;
      e.preventDefault();

      const endPoint = getPointFromEvent(e, canvas);
      if (endPoint) {
        const width = Math.abs(endPoint.x - currentRectangleStart.x);
        const height = Math.abs(endPoint.y - currentRectangleStart.y);

        if (width >= MIN_RECTANGLE_SIZE && height >= MIN_RECTANGLE_SIZE) {
          const x = Math.min(currentRectangleStart.x, endPoint.x);
          const y = Math.min(currentRectangleStart.y, endPoint.y);

          addDiagram({
            x,
            y,
            width,
            height,
            text: "",
          } as Diagram);
        }
      }

      useDiagramStore.setState({
        isCreatingRectangle: false,
        currentRectangleStart: null,
      });
      setToolMode("none");
    };

    canvas.addEventListener("mousedown", handleStart);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
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
    toolMode,
    isCreatingRectangle,
    currentRectangleStart,
    diagrams,
    addDiagram,
    setToolMode,
    canvasRef,
  ]);
}
