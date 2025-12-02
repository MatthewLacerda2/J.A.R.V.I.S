export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  id: string;
  points: Point[];
  color: string;
  width: number;
}

export interface DrawingState {
  strokes: Stroke[];
  currentStroke: Stroke | null;
  color: string;
  penWidth: number;
  isDrawing: boolean;
}
