import { MediaItem as MediaItemType } from '../../types/media';

interface AudioItemProps {
  item: MediaItemType;
}

export function AudioItem({ item }: AudioItemProps) {
  return (
    <div className="w-full h-full flex flex-col justify-start p-2">
      <p className="text-lg text-gray-300 font-semibold mb-2">{item.name}</p>
      <audio controls loop className="w-full">
        <source src={item.url} type="audio/mpeg" />
      </audio>
    </div>
  );
}
