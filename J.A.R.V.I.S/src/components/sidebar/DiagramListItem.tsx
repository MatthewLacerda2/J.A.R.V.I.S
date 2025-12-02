import { MouseEvent } from 'react';
import { Diagram } from '../../types/diagram';
import { Square, Trash2 } from 'lucide-react';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { useDiagramStore } from '../../stores/useDiagramStore';

interface DiagramListItemProps {
  diagram: Diagram;
}

export function DiagramListItem({ diagram }: Readonly<DiagramListItemProps>) {
  const selectedItemId = useSelectionStore((state) => state.selectedItemId);
  const selectItem = useSelectionStore((state) => state.selectItem);
  const deleteDiagram = useDiagramStore((state) => state.deleteDiagram);

  const isSelected = selectedItemId === diagram.id;

  const handleClick = () => {
    selectItem(diagram.id, 'diagram');
  };

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure?')) {
      deleteDiagram(diagram.id);
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
      <div className="shrink-0 text-gray-600">
        <Square className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0 text-sm truncate text-gray-500 font-semibold">{diagram.name}</div>
      <button
        onClick={(e: MouseEvent) => handleDelete(e)}
        className="shrink-0 p-1 hover:bg-red-100 rounded text-gray-500 hover:text-red-600"
        aria-label="Delete diagram"
      >
        <Trash2 className="w-5 h-5 text-red-500" />
      </button>
    </div>
  );
}

