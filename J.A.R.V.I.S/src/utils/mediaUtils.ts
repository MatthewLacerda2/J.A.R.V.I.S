import {
  DEFAULT_ITEM_SIZE,
  TEXT_ITEM_DEFAULT_SIZE,
} from "../constants/mediaTypes";
import { MediaItem } from "../types/media";

export function createObjectURL(file: File): string {
  return URL.createObjectURL(file);
}

export function revokeObjectURL(url: string): void {
  URL.revokeObjectURL(url);
}

export function getMediaDimensions(item: MediaItem): {
  width: number;
  height: number;
} {
  if (item.type === "text") {
    return TEXT_ITEM_DEFAULT_SIZE;
  }
  if (item.type === "youtube") {
    // YouTube videos have a 16:9 aspect ratio by default
    return { width: 576, height: 320 };
  }
  return DEFAULT_ITEM_SIZE;
}

export async function loadImageDimensions(
  url: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = url;
  });
}

export async function loadVideoDimensions(
  url: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.onloadedmetadata = () => {
      resolve({ width: video.videoWidth, height: video.videoHeight });
    };
    video.onerror = reject;
    video.src = url;
  });
}
