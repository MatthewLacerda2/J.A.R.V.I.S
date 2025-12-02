export type MediaType = "image" | "video" | "audio" | "text" | "youtube";

export interface MediaItem {
  id: string;
  type: MediaType;
  name: string;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio?: number;
  content?: string; // For text files
  file?: File; // Original file object (optional)
}

export type ResizeHandlePosition =
  | "nw"
  | "ne"
  | "sw"
  | "se"
  | "n"
  | "s"
  | "e"
  | "w";

export interface CanvasBounds {
  width: number;
  height: number;
}
