import React from 'react';
import { Arrow } from '../../types/diagram';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { useDiagramStore } from '../../stores/useDiagramStore';
import { calculateArrowEndpoints, isPointOnArrow } from '../../utils/arrowUtils';
import { ARROW_HEAD_SIZE } from '../../constants/diagram';

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
      selectItem(arrow.id, 'arrow');
    }
  };

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const angle = Math.atan2(dy, dx);

  const arrowHead1X = end.x - ARROW_HEAD_SIZE * Math.cos(angle - Math.PI / 6);
  const arrowHead1Y = end.y - ARROW_HEAD_SIZE * Math.sin(angle - Math.PI / 6);
  const arrowHead2X = end.x - ARROW_HEAD_SIZE * Math.cos(angle + Math.PI / 6);
  const arrowHead2Y = end.y - ARROW_HEAD_SIZE * Math.sin(angle + Math.PI / 6);

  return (
    <svg
      data-arrow-item
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    >
      <g
        onClick={handleClick}
        style={{ cursor: 'pointer', pointerEvents: 'all' }}
        className={isSelected ? 'opacity-100' : 'opacity-80'}
      >
        <line
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke={isSelected ? '#3b82f6' : arrow.color}
          strokeWidth={isSelected ? (arrow.strokeWidth || 2) + 1 : arrow.strokeWidth}
          strokeLinecap="round"
        />
        <polygon
          points={`${end.x},${end.y} ${arrowHead1X},${arrowHead1Y} ${arrowHead2X},${arrowHead2Y}`}
          fill={isSelected ? '#3b82f6' : arrow.color}
        />
      </g>
    </svg>
  );
}

