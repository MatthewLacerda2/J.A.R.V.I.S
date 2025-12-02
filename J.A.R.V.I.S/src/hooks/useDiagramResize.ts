import React from 'react';
import { useState, useCallback, useRef, useEffect } from 'react';
import { Diagram } from '../types/diagram';
import { constrainPosition } from '../utils/positionUtils';
import { MIN_DIAGRAM_WIDTH, MIN_DIAGRAM_HEIGHT } from '../constants/diagram';
import { useDiagramStore } from '../stores/useDiagramStore';

interface UseDiagramResizeProps {
  diagram: Diagram;
  onResize: (x: number, y: number, width: number, height: number) => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

export function useDiagramResize({ diagram, onResize, canvasRef }: UseDiagramResizeProps) {
  const toolMode = useDiagramStore((state) => state.toolMode);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartPos = useRef<{ x: number; y: number } | null>(null);
  const diagramStartState = useRef<{ x: number; y: number; width: number; height: number } | null>(
    null
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (toolMode !== 'none') return;
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      resizeStartPos.current = { x: e.clientX, y: e.clientY };
      diagramStartState.current = {
        x: diagram.x,
        y: diagram.y,
        width: diagram.width,
        height: diagram.height,
      };
    },
    [diagram, toolMode]
  );

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeStartPos.current || !diagramStartState.current || !canvasRef.current) return;

      const deltaX = e.clientX - resizeStartPos.current.x;
      const deltaY = e.clientY - resizeStartPos.current.y;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const newWidth = Math.max(MIN_DIAGRAM_WIDTH, diagramStartState.current.width + deltaX);
      const newHeight = Math.max(MIN_DIAGRAM_HEIGHT, diagramStartState.current.height + deltaY);

      const constrained = constrainPosition(
        diagramStartState.current.x,
        diagramStartState.current.y,
        newWidth,
        newHeight,
        canvasRect.width,
        canvasRect.height
      );

      const finalWidth = Math.min(newWidth, canvasRect.width - constrained.x);
      const finalHeight = Math.min(newHeight, canvasRect.height - constrained.y);

      onResize(constrained.x, constrained.y, finalWidth, finalHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      resizeStartPos.current = null;
      diagramStartState.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, onResize, canvasRef]);

  return {
    isResizing,
    resizeHandlers: {
      onMouseDown: handleMouseDown,
    },
  };
}

