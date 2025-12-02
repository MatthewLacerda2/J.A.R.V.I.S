import { MouseEvent } from 'react';
import { Arrow } from '../../types/diagram';
import { ArrowRight, Trash2 } from 'lucide-react';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { useDiagramStore } from '../../stores/useDiagramStore';

interface ArrowListItemProps {
  arrow: Arrow;
}

export function ArrowListItem({ arrow }: Readonly<ArrowListItemProps>) {
  const selectedItemId = useSelectionStore((state) => state.selectedItemId);
  const selectItem = useSelectionStore((state) => state.selectItem);
  const deleteArrow = useDiagramStore((state) => state.deleteArrow);

  const isSelected = selectedItemId === arrow.id;

  const handleClick = () => {
    selectItem(arrow.id, 'arrow');
  };

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure?')) {
      deleteArrow(arrow.id);
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
        <ArrowRight className="w-5 h-5 text-orange-600" />
      </div>
      <div className="flex-1 min-w-0 text-sm truncate text-gray-500 font-semibold">{arrow.name}</div>
      <button
        onClick={(e: MouseEvent) => handleDelete(e)}
        className="shrink-0 p-1 hover:bg-red-100 rounded text-gray-500 hover:text-red-600"
        aria-label="Delete arrow"
      >
        <Trash2 className="w-5 h-5 text-red-500" />
      </button>
    </div>
  );
}

