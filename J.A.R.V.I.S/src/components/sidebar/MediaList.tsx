import { useMediaStore } from '../../stores/useMediaStore';
import { MediaListItem } from './MediaListItem';

export function MediaList() {
  const items = useMediaStore((state) => state.items);

  if (items.length === 0) {
    return (
      <div className="text-sm text-gray-500 px-2 py-4 text-center">
        No files yet
      </div>
    );
  }

  return (
    <div className="flex flex-col px-2">
      {items.map((item) => (
        <MediaListItem key={item.id} item={item} />
      ))}
    </div>
  );
}
