export interface Diagram {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

export interface Arrow {
  id: string;
  name: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startDiagramId: string | null;
  endDiagramId: string | null;
  color?: string;
  strokeWidth?: number;
}

export type DiagramToolMode = 'none' | 'rectangle' | 'arrow';