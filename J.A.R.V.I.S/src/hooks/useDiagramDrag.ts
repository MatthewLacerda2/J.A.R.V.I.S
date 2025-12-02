import React from 'react';
import { useState, useCallback, useRef, useEffect } from 'react';
import { Diagram } from '../types/diagram';
import { constrainPosition } from '../utils/positionUtils';
import { useDiagramStore } from '../stores/useDiagramStore';

interface UseDiagramDragProps {
  diagram: Diagram;
  onPositionChange: (x: number, y: number) => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

export function useDiagramDrag({ diagram, onPositionChange, canvasRef }: UseDiagramDragProps) {
  const toolMode = useDiagramStore((state) => state.toolMode);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const diagramStartPos = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (toolMode !== 'none') return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      dragStartPos.current = { x: e.clientX, y: e.clientY };
      diagramStartPos.current = { x: diagram.x, y: diagram.y };
    },
    [diagram.x, diagram.y, toolMode]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartPos.current || !diagramStartPos.current || !canvasRef.current) return;

      const deltaX = e.clientX - dragStartPos.current.x;
      const deltaY = e.clientY - dragStartPos.current.y;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const newX = diagramStartPos.current.x + deltaX;
      const newY = diagramStartPos.current.y + deltaY;

      const constrained = constrainPosition(
        newX,
        newY,
        diagram.width,
        diagram.height,
        canvasRect.width,
        canvasRect.height
      );

      onPositionChange(constrained.x, constrained.y);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartPos.current = null;
      diagramStartPos.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, diagram.width, diagram.height, onPositionChange, canvasRef]);

  return {
    isDragging,
    dragHandlers: {
      onMouseDown: handleMouseDown,
    },
  };
}

