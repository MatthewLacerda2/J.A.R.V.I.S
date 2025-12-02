import { create } from 'zustand';
import { Diagram, Arrow, DiagramToolMode } from '../types/diagram';
import { Point } from '../types/drawing';
import {
  DEFAULT_DIAGRAM_BG_COLOR,
  DEFAULT_DIAGRAM_BORDER_COLOR,
  DEFAULT_DIAGRAM_BORDER_WIDTH,
  DEFAULT_ARROW_COLOR,
  DEFAULT_ARROW_STROKE_WIDTH,
} from '../constants/diagram';

interface DiagramStore {
  toolMode: DiagramToolMode;
  setToolMode: (mode: DiagramToolMode) => void;

  diagrams: Diagram[];
  addDiagram: (diagram: Omit<Diagram, 'id'>) => string;
  updateDiagram: (id: string, updates: Partial<Diagram>) => void;
  deleteDiagram: (id: string) => void;

  arrows: Arrow[];
  addArrow: (arrow: Omit<Arrow, 'id'>) => string;
  updateArrow: (id: string, updates: Partial<Arrow>) => void;
  deleteArrow: (id: string) => void;

  isCreatingRectangle: boolean;
  isCreatingArrow: boolean;
  currentRectangleStart: Point | null;
  currentArrowStart: Point | null;
  currentArrowEnd: Point | null;
}

export const useDiagramStore = create<DiagramStore>((set) => ({
  toolMode: 'none',
  setToolMode: (mode) => set({ toolMode: mode }),

  diagrams: [],
  addDiagram: (diagram) => {
    const id = `diagram-${Date.now()}-${Math.random()}`;
    const newDiagram: Diagram = {
      ...diagram,
      id,
      backgroundColor: diagram.backgroundColor || DEFAULT_DIAGRAM_BG_COLOR,
      borderColor: diagram.borderColor || DEFAULT_DIAGRAM_BORDER_COLOR,
      borderWidth: diagram.borderWidth ?? DEFAULT_DIAGRAM_BORDER_WIDTH,
    };
    set((state) => ({
      diagrams: [...state.diagrams, newDiagram],
    }));
    return id;
  },
  updateDiagram: (id, updates) => {
    set((state) => ({
      diagrams: state.diagrams.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    }));
  },
  deleteDiagram: (id) => {
    set((state) => ({
      diagrams: state.diagrams.filter((d) => d.id !== id),
      arrows: state.arrows.filter(
        (a) => a.startDiagramId !== id && a.endDiagramId !== id
      ),
    }));
  },

  arrows: [],
  addArrow: (arrow) => {
    const id = `arrow-${Date.now()}-${Math.random()}`;
    const newArrow: Arrow = {
      ...arrow,
      id,
      color: arrow.color || DEFAULT_ARROW_COLOR,
      strokeWidth: arrow.strokeWidth ?? DEFAULT_ARROW_STROKE_WIDTH,
    };
    set((state) => ({
      arrows: [...state.arrows, newArrow],
    }));
    return id;
  },
  updateArrow: (id, updates) => {
    set((state) => ({
      arrows: state.arrows.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
  },
  deleteArrow: (id) => {
    set((state) => ({
      arrows: state.arrows.filter((a) => a.id !== id),
    }));
  },

  isCreatingRectangle: false,
  isCreatingArrow: false,
  currentRectangleStart: null,
  currentArrowStart: null,
  currentArrowEnd: null,
}));

