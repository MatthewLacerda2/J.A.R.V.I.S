import React, { ReactNode, useState } from "react";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";

interface CanvasDropZoneProps {
  onFilesDropped: (files: File[]) => void;
  onImageUrl?: (url: string) => void;
  children: ReactNode;
}

export function CanvasDropZone({
  onFilesDropped,
  onImageUrl,
  children,
}: Readonly<CanvasDropZoneProps>) {
  const {
    isDragging,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useDragAndDrop(onFilesDropped);
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl.trim() && onImageUrl) {
      onImageUrl(imageUrl.trim());
      setImageUrl("");
    }
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="flex-1 h-screen overflow-hidden relative"
      id="app"
    >
      {children}

      {isDragging && (
        <div className="absolute inset-0 bg-blue-500/20 border-4 border-dashed border-blue-500 flex items-center justify-center z-50">
          <div className="text-purple-600 text-2xl font-semibold">
            Drop files here
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="absolute top-4 left-4 z-40">
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Add image links here"
          className="px-4 py-3 rounded-lg border border-gray-500 bg-black/25 text-white placeholder:text-gray-500 min-w-[320px] focus:outline-none"
        />
      </form>
    </div>
  );
}
