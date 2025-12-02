import { useMediaStore } from '../../stores/useMediaStore';
import { useDiagramStore } from '../../stores/useDiagramStore';
import { MediaListItem } from './MediaListItem';
import { DiagramListItem } from './DiagramListItem';
import { ArrowListItem } from './ArrowListItem';

export function MediaList() {
  const items = useMediaStore((state) => state.items);
  const diagrams = useDiagramStore((state) => state.diagrams);
  const arrows = useDiagramStore((state) => state.arrows);

  const totalCount = items.length + diagrams.length + arrows.length;

  if (totalCount === 0) {
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
      {diagrams.map((diagram) => (
        <DiagramListItem key={diagram.id} diagram={diagram} />
      ))}
      {arrows.map((arrow) => (
        <ArrowListItem key={arrow.id} arrow={arrow} />
      ))}
    </div>
  );
}
