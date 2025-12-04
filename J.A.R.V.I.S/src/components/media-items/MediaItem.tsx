import React from "react";
import { useItemDrag } from "../../hooks/useItemDrag";
import { useMediaResize } from "../../hooks/useMediaResize";
import { useMediaStore } from "../../stores/useMediaStore";
import { useSelectionStore } from "../../stores/useSelectionStore";
import { MediaItem as MediaItemType } from "../../types/media";
import { ResizeHandles } from "../resize-handle/ResizeHandle";
import { AudioItem } from "./AudioItem";
import { ImageItem } from "./ImageItem";
import { TextItem } from "./TextItem";
import { VideoItem } from "./VideoItem";
import { YouTubeItem } from "./YouTubeItem";

interface MediaItemProps {
  item: MediaItemType;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

export function MediaItem({ item, canvasRef }: MediaItemProps) {
  const selectedItemId = useSelectionStore((state) => state.selectedItemId);
  const selectItem = useSelectionStore((state) => state.selectItem);
  const updateItem = useMediaStore((state) => state.updateItem);

  const isSelected = selectedItemId === item.id;

  const { dragHandlers } = useItemDrag({
    item,
    onPositionChange: (x, y) => {
      updateItem(item.id, { x, y });
    },
    canvasRef,
  });

  const { handleMouseDown } = useMediaResize({
    item,
    onResize: (x, y, width, height) => {
      updateItem(item.id, { x, y, width, height });
    },
    canvasRef,
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectItem(item.id, "media");
  };

  const renderMediaContent = () => {
    switch (item.type) {
      case "image":
        return <ImageItem item={item} />;
      case "video":
        return <VideoItem item={item} />;
      case "audio":
        return <AudioItem item={item} />;
      case "text":
        return <TextItem item={item} />;
      case "youtube":
        return <YouTubeItem item={item} />;
      default:
        return null;
    }
  };

  return (
    <div
      data-media-item
      className="absolute cursor-move select-none"
      style={{
        left: `${item.x}px`,
        top: `${item.y}px`,
        width: `${item.width}px`,
        height: `${item.height}px`,
        zIndex: isSelected ? 1000 : 1,
        border: isSelected ? "3px solid #3b82f6" : "2px solid transparent",
        borderRadius: "4px",
        boxShadow: isSelected ? "0 0 0 2px rgba(59, 130, 246, 0.3)" : "none",
      }}
      onClick={handleClick}
      {...dragHandlers}
    >
      {renderMediaContent()}
      {isSelected && <ResizeHandles onHandleMouseDown={handleMouseDown} />}
    </div>
  );
}
