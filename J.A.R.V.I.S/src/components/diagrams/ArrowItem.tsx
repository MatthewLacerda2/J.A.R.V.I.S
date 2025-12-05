import React from "react";
import { ARROW_HEAD_SIZE } from "../../constants/diagram";
import { useDiagramStore } from "../../stores/useDiagramStore";
import { useSelectionStore } from "../../stores/useSelectionStore";
import { Arrow } from "../../types/diagram";
import {
  calculateArrowEndpoints,
  isPointOnArrow,
} from "../../utils/arrowUtils";

interface ArrowItemProps {
  arrow: Arrow;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

export function ArrowItem({ arrow, canvasRef }: ArrowItemProps) {
  const selectedItemId = useSelectionStore((state) => state.selectedItemId);
  const selectItem = useSelectionStore((state) => state.selectItem);
  const diagrams = useDiagramStore((state) => state.diagrams);

  const isSelected = selectedItemId === arrow.id;

  const { start, end } = calculateArrowEndpoints(arrow, diagrams);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    if (isPointOnArrow(point, arrow, diagrams)) {
      selectItem(arrow.id, "arrow");
    }
  };

  const dx = end.x - start.x;
  const dy = end.y - start.y;

  // Determine L-shape routing: horizontal first if |dx| > |dy|, otherwise vertical first
  const goHorizontalFirst = Math.abs(dx) > Math.abs(dy);

  // Calculate the corner point of the L-shape
  const corner = goHorizontalFirst
    ? { x: end.x, y: start.y } // Horizontal first: go to end.x, then down/up
    : { x: start.x, y: end.y }; // Vertical first: go down/up, then to end.x

  // Calculate arrowhead angle based on the final segment direction
  const finalAngle = goHorizontalFirst
    ? dy >= 0
      ? Math.PI / 2
      : -Math.PI / 2 // Vertical segment
    : dx >= 0
    ? 0
    : Math.PI; // Horizontal segment

  const arrowHeadSize = ARROW_HEAD_SIZE * 2;
  const arrowHead1X =
    end.x - arrowHeadSize * Math.cos(finalAngle - Math.PI / 6);
  const arrowHead1Y =
    end.y - arrowHeadSize * Math.sin(finalAngle - Math.PI / 6);
  const arrowHead2X =
    end.x - arrowHeadSize * Math.cos(finalAngle + Math.PI / 6);
  const arrowHead2Y =
    end.y - arrowHeadSize * Math.sin(finalAngle + Math.PI / 6);

  return (
    <svg
      data-arrow-item
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <g
        onClick={handleClick}
        style={{ cursor: "pointer", pointerEvents: "all" }}
        className={isSelected ? "opacity-100" : "opacity-80"}
      >
        {/* First segment: horizontal or vertical */}
        <line
          x1={start.x}
          y1={start.y}
          x2={corner.x}
          y2={corner.y}
          stroke={isSelected ? "#3b82f6" : arrow.color}
          strokeWidth={
            isSelected ? (arrow.strokeWidth || 2) + 1 : arrow.strokeWidth
          }
          strokeLinecap="round"
        />
        {/* Second segment: the other direction */}
        <line
          x1={corner.x}
          y1={corner.y}
          x2={end.x}
          y2={end.y}
          stroke={isSelected ? "#3b82f6" : arrow.color}
          strokeWidth={
            isSelected ? (arrow.strokeWidth || 2) + 1 : arrow.strokeWidth
          }
          strokeLinecap="round"
        />
        <polygon
          points={`${end.x},${end.y} ${arrowHead1X},${arrowHead1Y} ${arrowHead2X},${arrowHead2Y}`}
          fill={isSelected ? "#3b82f6" : arrow.color}
        />
      </g>
    </svg>
  );
}
