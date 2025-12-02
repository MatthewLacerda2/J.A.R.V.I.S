import { useEffect, RefObject } from 'react';
import { useDrawingStore } from '../stores/useDrawingStore';
import { Point } from '../types/drawing';

export function useDrawing(canvasRef: RefObject<HTMLDivElement | null>) {
  const {
    startStroke,
    addPointToStroke,
    endStroke,
    isDrawing,
    isEnabled,
  } = useDrawingStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getPointFromEvent = (e: MouseEvent | TouchEvent): Point | null => {
      if (!canvasRef.current) return null;

      const rect = canvasRef.current.getBoundingClientRect();
      if (e instanceof MouseEvent) {
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      } else {
        const touch = e.touches[0] || e.changedTouches[0];
        return {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        };
      }
    };

    const handleStart = (e: MouseEvent | TouchEvent) => {
      if (!isEnabled) return;

      // Don't start drawing if clicking on media items or their children
      const target = e.target as HTMLElement;
      if (target.closest('[data-media-item]')) {
        return;
      }

      // Don't start drawing if clicking on the toolbar
      if (target.closest('[data-drawing-toolbar]')) {
        return;
      }

      e.preventDefault();
      const point = getPointFromEvent(e);
      if (point) {
        startStroke(point);
      }
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      e.preventDefault();
      const point = getPointFromEvent(e);
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
    canvas.addEventListener('mousedown', handleStart);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);

    // Touch events
    canvas.addEventListener('touchstart', handleStart, { passive: false });
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    return () => {
      canvas.removeEventListener('mousedown', handleStart);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      canvas.removeEventListener('touchstart', handleStart);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [canvasRef, startStroke, addPointToStroke, endStroke, isDrawing, isEnabled]);
}
