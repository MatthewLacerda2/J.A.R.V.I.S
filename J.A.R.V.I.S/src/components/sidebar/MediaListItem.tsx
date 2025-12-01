import { MouseEvent } from 'react';
import { MediaItem } from '../../types/media';
import { Image, Video, Music, FileText, Trash2 } from 'lucide-react';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { useMediaStore } from '../../stores/useMediaStore';

interface MediaListItemProps {
  item: MediaItem;
}

export function MediaListItem({ item }: Readonly<MediaListItemProps>) {
  const selectedItemId = useSelectionStore((state) => state.selectedItemId);
  const selectItem = useSelectionStore((state) => state.selectItem);
  const deleteItem = useMediaStore((state) => state.deleteItem);

  const isSelected = selectedItemId === item.id;

  const getIcon = () => {
    switch (item.type) {
      case 'image':
        return <Image className="w-5 h-5 text-purple-600" />;
      case 'video':
        return <Video className="w-5 h-5 text-green-600" />;
      case 'audio':
        return <Music className="w-5 h-5 text-yellow-500" />;
      case 'text':
        return <FileText className="w-5 h-5 text-gray-600" />;
      default:
        return null;
    }
  };

  const handleClick = () => {
    selectItem(item.id);
  };

  const handleDelete = (e:MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure?')) {
      deleteItem(item.id);
      if (isSelected) {
        selectItem(null);
      }
    }
  };

  return (
    <div
      className={`flex items-center gap-2 px-2 py-2 hover:bg-gray-100 cursor-pointer rounded ${
        isSelected ? 'bg-gray-900' : ''
      }`}
      onClick={handleClick}
    >
      <div className="shrink-0 text-gray-600">{getIcon()}</div>
      <div className="flex-1 min-w-0 text-sm truncate text-gray-500 font-semibold">{item.name}</div>
      <button
        onClick={(e: MouseEvent) => handleDelete(e)}
        className="shrink-0 p-1 hover:bg-red-100 rounded text-gray-500 hover:text-red-600"
        aria-label="Delete file"
      >
        <Trash2 className="w-5 h-5 text-red-500" />
      </button>
    </div>
  );
}
