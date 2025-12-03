import React, { ReactNode, useState } from "react";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import { useMediaStore } from "../../stores/useMediaStore";
import { isValidYouTubeUrl } from "../../utils/youtubeUtils";

interface CanvasDropZoneProps {
  onFilesDropped: (files: File[]) => void;
  onImageUrl?: (url: string) => void;
  onYouTubeUrl?: (url: string) => void;
  children: ReactNode;
}

export function CanvasDropZone({
  onFilesDropped,
  onImageUrl,
  onYouTubeUrl,
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
  const mediaItems = useMediaStore((state) => state.items);
  const hasNoMediaFiles = mediaItems.length === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = imageUrl.trim();
    if (!url) return;

    // Check if it's a YouTube URL
    if (isValidYouTubeUrl(url) && onYouTubeUrl) {
      onYouTubeUrl(url);
      setImageUrl("");
      return;
    }

    // Otherwise, try as image URL
    if (onImageUrl) {
      onImageUrl(url);
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

      {hasNoMediaFiles && !isDragging && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div className="text-gray-300/50 text-xl font-semibold max-w-xl text-center leading-snug">
            Drag and drop images, videos, audio and text files here
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="absolute top-4 left-4 z-40">
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Add image or YouTube links here"
          className="px-4 py-2.5 rounded-lg border border-gray-500 bg-black/25 text-white placeholder:text-gray-500 min-w-[300px] focus:outline-none"
        />
      </form>
    </div>
  );
}
