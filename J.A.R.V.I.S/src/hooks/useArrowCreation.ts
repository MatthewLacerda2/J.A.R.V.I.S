import { RefObject, useEffect } from "react";
import { MIN_ARROW_LENGTH } from "../constants/diagram";
import { useDiagramStore } from "../stores/useDiagramStore";
import { Arrow } from "../types/diagram";
import { getPointFromEvent } from "../utils/canvasUtils";
import { findDiagramAtPoint } from "../utils/diagramUtils";

export function useArrowCreation(canvasRef: RefObject<HTMLDivElement | null>) {
  const toolMode = useDiagramStore((state) => state.toolMode);
  const setToolMode = useDiagramStore((state) => state.setToolMode);
  const diagrams = useDiagramStore((state) => state.diagrams);
  const addArrow = useDiagramStore((state) => state.addArrow);
  const isCreatingArrow = useDiagramStore((state) => state.isCreatingArrow);
  const currentArrowStart = useDiagramStore((state) => state.currentArrowStart);
  const currentArrowEnd = useDiagramStore((state) => state.currentArrowEnd);

  useEffect(() => {
    if (toolMode !== "arrow") return;

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
        useDiagramStore.setState({
          isCreatingArrow: true,
          currentArrowStart: point,
          currentArrowEnd: point,
        });
      }
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isCreatingArrow || !currentArrowStart) return;
      e.preventDefault();
      const point = getPointFromEvent(e, canvas);
      if (point) {
        useDiagramStore.setState({ currentArrowEnd: point });
      }
    };

    const handleEnd = (e: MouseEvent | TouchEvent) => {
      if (!isCreatingArrow || !currentArrowStart || !currentArrowEnd) return;
      e.preventDefault();

      const length = Math.sqrt(
        Math.pow(currentArrowEnd.x - currentArrowStart.x, 2) +
          Math.pow(currentArrowEnd.y - currentArrowStart.y, 2)
      );

      if (length >= MIN_ARROW_LENGTH) {
        const startDiagram = findDiagramAtPoint(currentArrowStart, diagrams);
        const endDiagram = findDiagramAtPoint(currentArrowEnd, diagrams);

        addArrow({
          startX: currentArrowStart.x,
          startY: currentArrowStart.y,
          endX: currentArrowEnd.x,
          endY: currentArrowEnd.y,
          startDiagramId: startDiagram?.id || null,
          endDiagramId: endDiagram?.id || null,
        } as Arrow);
      }

      useDiagramStore.setState({
        isCreatingArrow: false,
        currentArrowStart: null,
        currentArrowEnd: null,
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
    isCreatingArrow,
    currentArrowStart,
    currentArrowEnd,
    diagrams,
    addArrow,
    setToolMode,
    canvasRef,
  ]);
}
