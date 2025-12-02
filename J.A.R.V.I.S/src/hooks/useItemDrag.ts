import React from 'react';
import { useState, useCallback, useRef, useEffect } from 'react';
import { MediaItem } from '../types/media';
import { constrainPosition } from '../utils/positionUtils';

interface UseItemDragProps {
  item: MediaItem;
  onPositionChange: (x: number, y: number) => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

export function useItemDrag({ item, onPositionChange, canvasRef }: UseItemDragProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const itemStartPos = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      dragStartPos.current = { x: e.clientX, y: e.clientY };
      itemStartPos.current = { x: item.x, y: item.y };
    },
    [item.x, item.y]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartPos.current || !itemStartPos.current || !canvasRef.current) return;

      const deltaX = e.clientX - dragStartPos.current.x;
      const deltaY = e.clientY - dragStartPos.current.y;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const newX = itemStartPos.current.x + deltaX;
      const newY = itemStartPos.current.y + deltaY;

      const constrained = constrainPosition(
        newX,
        newY,
        item.width,
        item.height,
        canvasRect.width,
        canvasRect.height
      );

      onPositionChange(constrained.x, constrained.y);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartPos.current = null;
      itemStartPos.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, item.width, item.height, onPositionChange, canvasRef]);

  return {
    isDragging,
    dragHandlers: {
      onMouseDown: handleMouseDown,
    },
  };
}
