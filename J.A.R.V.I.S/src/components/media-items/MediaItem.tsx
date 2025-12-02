import React from 'react';
import { MediaItem as MediaItemType } from '../../types/media';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { useMediaStore } from '../../stores/useMediaStore';
import { useItemDrag } from '../../hooks/useItemDrag';
import { ImageItem } from './ImageItem';
import { VideoItem } from './VideoItem';
import { AudioItem } from './AudioItem';
import { TextItem } from './TextItem';

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

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectItem(item.id, 'media');
  };

  const renderMediaContent = () => {
    switch (item.type) {
      case 'image':
        return <ImageItem item={item} />;
      case 'video':
        return <VideoItem item={item} />;
      case 'audio':
        return <AudioItem item={item} />;
      case 'text':
        return <TextItem item={item} />;
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
        border: isSelected ? '3px solid #3b82f6' : '2px solid transparent',
        borderRadius: '4px',
        boxShadow: isSelected ? '0 0 0 2px rgba(59, 130, 246, 0.3)' : 'none',
      }}
      onClick={handleClick}
      {...dragHandlers}
    >
      {renderMediaContent()}
    </div>
  );
}
