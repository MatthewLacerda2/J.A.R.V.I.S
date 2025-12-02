import React, { useState, useEffect } from 'react';
import { useDiagramStore } from '../../stores/useDiagramStore';
import { DiagramItem } from './DiagramItem';
import { ArrowItem } from './ArrowItem';

interface DiagramCanvasProps {
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

export function DiagramCanvas({ canvasRef }: DiagramCanvasProps) {
  const diagrams = useDiagramStore((state) => state.diagrams);
  const arrows = useDiagramStore((state) => state.arrows);
  const isCreatingArrow = useDiagramStore((state) => state.isCreatingArrow);
  const currentArrowStart = useDiagramStore((state) => state.currentArrowStart);
  const currentArrowEnd = useDiagramStore((state) => state.currentArrowEnd);
  const isCreatingRectangle = useDiagramStore((state) => state.isCreatingRectangle);
  const currentRectangleStart = useDiagramStore((state) => state.currentRectangleStart);
  const [currentMousePos, setCurrentMousePos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!isCreatingRectangle || !currentRectangleStart) {
      setCurrentMousePos(null);//FIXME: This is a workaround to avoid the error
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      setCurrentMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isCreatingRectangle, currentRectangleStart, canvasRef]);

  const previewRect =
    isCreatingRectangle && currentRectangleStart && currentMousePos
      ? {
          x: Math.min(currentRectangleStart.x, currentMousePos.x),
          y: Math.min(currentRectangleStart.y, currentMousePos.y),
          width: Math.abs(currentMousePos.x - currentRectangleStart.x),
          height: Math.abs(currentMousePos.y - currentRectangleStart.y),
        }
      : null;

  return (
    <>
      {diagrams.map((diagram) => (
        <DiagramItem key={diagram.id} diagram={diagram} canvasRef={canvasRef} />
      ))}

      {arrows.map((arrow) => (
        <ArrowItem key={arrow.id} arrow={arrow} canvasRef={canvasRef} />
      ))}

      {isCreatingArrow && currentArrowStart && currentArrowEnd && (() => {
        const dx = currentArrowEnd.x - currentArrowStart.x;
        const dy = currentArrowEnd.y - currentArrowStart.y;
        const angle = Math.atan2(dy, dx);
        const ARROW_HEAD_SIZE = 10;
        const arrowHeadSize = ARROW_HEAD_SIZE * 2;
        const arrowHead1X = currentArrowEnd.x - arrowHeadSize * Math.cos(angle - Math.PI / 6);
        const arrowHead1Y = currentArrowEnd.y - arrowHeadSize * Math.sin(angle - Math.PI / 6);
        const arrowHead2X = currentArrowEnd.x - arrowHeadSize * Math.cos(angle + Math.PI / 6);
        const arrowHead2Y = currentArrowEnd.y - arrowHeadSize * Math.sin(angle + Math.PI / 6);

        return (
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 10 }}
          >
            <line
              x1={currentArrowStart.x}
              y1={currentArrowStart.y}
              x2={currentArrowEnd.x}
              y2={currentArrowEnd.y}
              stroke="#888888"
              strokeWidth={2}
              strokeLinecap="round"
            />
            <polygon
              points={`${currentArrowEnd.x},${currentArrowEnd.y} ${arrowHead1X},${arrowHead1Y} ${arrowHead2X},${arrowHead2Y}`}
              fill="#888888"
            />
          </svg>
        );
      })()}

      {previewRect && (
        <div
          className="absolute border-2 border-dashed border-gray-400 pointer-events-none bg-transparent"
          style={{
            left: `${previewRect.x}px`,
            top: `${previewRect.y}px`,
            width: `${previewRect.width}px`,
            height: `${previewRect.height}px`,
            zIndex: 10,
          }}
        />
      )}
    </>
  );
}

