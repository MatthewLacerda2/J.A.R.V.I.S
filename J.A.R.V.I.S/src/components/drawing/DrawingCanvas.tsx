import { RefObject, useEffect, useState } from 'react';
import { useDrawingStore } from '../../stores/useDrawingStore';
import { Stroke } from '../../types/drawing';

interface DrawingCanvasProps {
  canvasRef: RefObject<HTMLDivElement | null>;
}

export function DrawingCanvas({ canvasRef }: DrawingCanvasProps) {
  const { strokes, currentStroke } = useDrawingStore();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const allStrokes = currentStroke ? [...strokes, currentStroke] : strokes;

  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [canvasRef]);

  const pathDataFromPoints = (points: { x: number; y: number }[]): string => {
    if (points.length === 0) return '';
    if (points.length === 1) {
      const p = points[0];
      return `M ${p.x} ${p.y} L ${p.x} ${p.y}`;
    }

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const p = points[i];
      path += ` L ${p.x} ${p.y}`;
    }
    return path;
  };

  if (dimensions.width === 0) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-10"
      width={dimensions.width}
      height={dimensions.height}
      style={{ left: 0, top: 0 }}
    >
      {allStrokes.map((stroke: Stroke) => (
        <path
          key={stroke.id}
          d={pathDataFromPoints(stroke.points)}
          stroke={stroke.color}
          strokeWidth={stroke.width}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ))}
    </svg>
  );
}
