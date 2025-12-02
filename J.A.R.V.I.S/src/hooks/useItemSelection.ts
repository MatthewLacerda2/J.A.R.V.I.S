import { useEffect } from 'react';
import { useSelectionStore } from '../stores/useSelectionStore';
import { useMediaStore } from '../stores/useMediaStore';
import { useDiagramStore } from '../stores/useDiagramStore';

export function useItemSelection() {
  const selectedItemId = useSelectionStore((state) => state.selectedItemId);
  const selectionType = useSelectionStore((state) => state.selectionType);
  const selectItem = useSelectionStore((state) => state.selectItem);
  const clearSelection = useSelectionStore((state) => state.clearSelection);
  const deleteItem = useMediaStore((state) => state.deleteItem);
  const deleteDiagram = useDiagramStore((state) => state.deleteDiagram);
  const deleteArrow = useDiagramStore((state) => state.deleteArrow);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedItemId) {
          if (selectionType === 'media') {
            deleteItem(selectedItemId);
          } else if (selectionType === 'diagram') {
            deleteDiagram(selectedItemId);
          } else if (selectionType === 'arrow') {
            deleteArrow(selectedItemId);
          }
          clearSelection();
        }
      } else if (e.key === 'Escape') {
        clearSelection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedItemId, selectionType, deleteItem, deleteDiagram, deleteArrow, clearSelection]);

  return {
    selectedItemId,
    selectionType,
    selectItem,
    clearSelection,
  };
}
