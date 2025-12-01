import { ReactNode } from 'react';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';

interface CanvasDropZoneProps {
  onFilesDropped: (files: File[]) => void;
  children: ReactNode;
}

export function CanvasDropZone({ onFilesDropped, children }: Readonly<CanvasDropZoneProps>) {
  const { isDragging, handleDragOver, handleDragLeave, handleDrop } =
    useDragAndDrop(onFilesDropped);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="w-full h-screen overflow-hidden relative" id="app"
    >
        <b>this does </b>

      {children}
      <b>this does not</b>

      {isDragging && (
        <div className="absolute inset-0 bg-blue-500/20 border-4 border-dashed border-blue-500 flex items-center justify-center z-50">
          <div className="text-purple-600 text-2xl font-semibold">Drop files here</div>
        </div>
      )}
    </div>
  );
}
