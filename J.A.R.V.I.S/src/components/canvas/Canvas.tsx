import { useRef, MouseEvent } from 'react';
import { useMediaStore } from '../../stores/useMediaStore';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { MediaItem } from '../../components/media-items/MediaItem';
import { DrawingCanvas } from '../drawing/DrawingCanvas';
import { DrawingToolbar } from '../drawing/DrawingToolbar';
import { useDrawing } from '../../hooks/useDrawing';

export function Canvas() {
  const items = useMediaStore((state) => state.items);
  const clearSelection = useSelectionStore((state) => state.clearSelection);
  const canvasRef = useRef<HTMLDivElement>(null);

  useDrawing(canvasRef);

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
      <DrawingCanvas canvasRef={canvasRef} />
      <DrawingToolbar />
    </div>
  );
}
