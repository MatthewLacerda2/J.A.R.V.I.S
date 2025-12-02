import { create } from 'zustand';

export type SelectionType = 'media' | 'diagram' | 'arrow' | null;

interface SelectionStore {
  selectedItemId: string | null;
  selectionType: SelectionType;
  selectItem: (id: string | null, type?: SelectionType) => void;
  clearSelection: () => void;
}

export const useSelectionStore = create<SelectionStore>((set) => ({
  selectedItemId: null,
  selectionType: null,

  selectItem: (id, type = null) => {
    set({ selectedItemId: id, selectionType: type });
  },

  clearSelection: () => {
    set({ selectedItemId: null, selectionType: null });
  },
}));
