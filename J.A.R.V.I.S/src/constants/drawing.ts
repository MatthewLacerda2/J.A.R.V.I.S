export const DRAWING_COLORS = [
  '#BBBBBB', // White
  '#000000', // Black
  '#FF0000', // Red
  '#00BB00', // Green
  '#0000DD', // Blue
  '#BB00BB', // Magenta
] as const;

export const DEFAULT_COLOR = DRAWING_COLORS[0]; // White
export const MIN_PEN_WIDTH = 2;
export const MAX_PEN_WIDTH = 40;
export const DEFAULT_PEN_WIDTH = 10;
