import React from 'react';
import { MediaItem as MediaItemType } from '../../types/media';
import { useMediaStore } from '../../stores/useMediaStore';

interface TextItemProps {
  item: MediaItemType;
}

export function TextItem({ item }: TextItemProps) {
  const updateItem = useMediaStore((state) => state.updateItem);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateItem(item.id, { content: e.target.value });
  };

  return (
    <div className="w-full h-full bg-white rounded border border-gray-300 shadow-sm">
      <textarea
        value={item.content || ''}
        onChange={handleContentChange}
        className="w-full h-full p-3 resize-none border-none outline-none rounded text-sm font-mono"
        placeholder="Text content..."
        draggable={false}
      />
    </div>
  );
}
