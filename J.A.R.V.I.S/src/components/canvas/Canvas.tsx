import { useRef, MouseEvent } from 'react';
import { useMediaStore } from '../../stores/useMediaStore';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { MediaItem } from '../../components/media-items/MediaItem';
import { DrawingCanvas } from '../drawing/DrawingCanvas';
import { DrawingToolbar } from '../drawing/DrawingToolbar';
import { DiagramCanvas } from '../diagrams/DiagramCanvas';
import { DiagramToolbar } from '../diagrams/DiagramToolbar';
import { useDrawing } from '../../hooks/useDrawing';
import { useDiagramCreation } from '../../hooks/useDiagramCreation';
import { useArrowCreation } from '../../hooks/useArrowCreation';

export function Canvas() {
  const items = useMediaStore((state) => state.items);
  const clearSelection = useSelectionStore((state) => state.clearSelection);
  const canvasRef = useRef<HTMLDivElement>(null);

  useDrawing(canvasRef);
  useDiagramCreation(canvasRef);
  useArrowCreation(canvasRef);

  const handleCanvasClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      clearSelection();
    }
  };

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-screen bg-black/95 overflow-hidden"
      style={{ position: 'relative' }}
      onClick={handleCanvasClick}
    >
      {items.map((item) => (
        <MediaItem key={item.id} item={item} canvasRef={canvasRef} />
      ))}
      <DiagramCanvas canvasRef={canvasRef} />
      <DrawingCanvas canvasRef={canvasRef} />
      <DiagramToolbar />
      <DrawingToolbar />
    </div>
  );
}
