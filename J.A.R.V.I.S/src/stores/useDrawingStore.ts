import { create } from 'zustand';
import { Stroke, Point } from '../types/drawing';
import { DEFAULT_COLOR, DEFAULT_PEN_WIDTH } from '../constants/drawing';

interface DrawingStore {
  strokes: Stroke[];
  currentStroke: Stroke | null;
  color: string;
  penWidth: number;
  isDrawing: boolean;

  setColor: (color: string) => void;
  setPenWidth: (width: number) => void;
  startStroke: (point: Point) => void;
  addPointToStroke: (point: Point) => void;
  endStroke: () => void;
  clearAll: () => void;
  undoLastStroke: () => void;
}

export const useDrawingStore = create<DrawingStore>((set, get) => ({
  strokes: [],
  currentStroke: null,
  color: DEFAULT_COLOR,
  penWidth: DEFAULT_PEN_WIDTH,
  isDrawing: false,

  setColor: (color) => set({ color }),
  setPenWidth: (penWidth) => set({ penWidth }),

  startStroke: (point) => {
    const { color, penWidth } = get();
    const newStroke: Stroke = {
      id: `stroke-${Date.now()}-${Math.random()}`,
      points: [point],
      color,
      width: penWidth,
    };
    set({
      currentStroke: newStroke,
      isDrawing: true,
    });
  },

  addPointToStroke: (point) => {
    const { currentStroke } = get();
    if (currentStroke) {
      set({
        currentStroke: {
          ...currentStroke,
          points: [...currentStroke.points, point],
        },
      });
    }
  },

  endStroke: () => {
    const { currentStroke } = get();
    if (currentStroke && currentStroke.points.length > 0) {
      set((state) => ({
        strokes: [...state.strokes, currentStroke],
        currentStroke: null,
        isDrawing: false,
      }));
    } else {
      set({
        currentStroke: null,
        isDrawing: false,
      });
    }
  },

  clearAll: () => set({ strokes: [], currentStroke: null, isDrawing: false }),

  undoLastStroke: () => {
    set((state) => ({
      strokes: state.strokes.slice(0, -1),
    }));
  },
}));
