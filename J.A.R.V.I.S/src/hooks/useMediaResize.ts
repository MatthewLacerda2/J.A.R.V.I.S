import React, { useCallback, useEffect, useRef, useState } from "react";
import { MIN_ITEM_SIZE } from "../constants/mediaTypes";
import { MediaItem, ResizeHandlePosition } from "../types/media";
import { constrainPosition } from "../utils/positionUtils";

interface UseMediaResizeProps {
  item: MediaItem;
  onResize: (x: number, y: number, width: number, height: number) => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

export function useMediaResize({
  item,
  onResize,
  canvasRef,
}: UseMediaResizeProps) {
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartPos = useRef<{ x: number; y: number } | null>(null);
  const itemStartState = useRef<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const handlePosition = useRef<ResizeHandlePosition | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, position: ResizeHandlePosition) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      resizeStartPos.current = { x: e.clientX, y: e.clientY };
      itemStartState.current = {
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height,
      };
      handlePosition.current = position;
    },
    [item]
  );

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (
        !resizeStartPos.current ||
        !itemStartState.current ||
        !canvasRef.current ||
        !handlePosition.current
      )
        return;

      const deltaX = e.clientX - resizeStartPos.current.x;
      const deltaY = e.clientY - resizeStartPos.current.y;
      const position = handlePosition.current;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const startState = itemStartState.current;

      // Calculate aspect ratio for proportional scaling (except text items)
      const maintainAspectRatio = item.type !== "text";
      const aspectRatio =
        maintainAspectRatio && item.aspectRatio
          ? item.aspectRatio
          : startState.width / startState.height;

      let newX = startState.x;
      let newY = startState.y;
      let newWidth = startState.width;
      let newHeight = startState.height;

      // Handle different resize positions
      switch (position) {
        case "nw": // Top-left
          if (maintainAspectRatio) {
            const scale = Math.min(
              (startState.width - deltaX) / startState.width,
              (startState.height - deltaY) / startState.height
            );
            newWidth = Math.max(MIN_ITEM_SIZE.width, startState.width * scale);
            newHeight = newWidth / aspectRatio;
            newX = startState.x + (startState.width - newWidth);
            newY = startState.y + (startState.height - newHeight);
          } else {
            newWidth = Math.max(MIN_ITEM_SIZE.width, startState.width - deltaX);
            newHeight = Math.max(
              MIN_ITEM_SIZE.height,
              startState.height - deltaY
            );
            newX = startState.x + (startState.width - newWidth);
            newY = startState.y + (startState.height - newHeight);
          }
          break;
        case "ne": // Top-right
          if (maintainAspectRatio) {
            const scale = Math.min(
              (startState.width + deltaX) / startState.width,
              (startState.height - deltaY) / startState.height
            );
            newWidth = Math.max(MIN_ITEM_SIZE.width, startState.width * scale);
            newHeight = newWidth / aspectRatio;
            newY = startState.y + (startState.height - newHeight);
          } else {
            newWidth = Math.max(MIN_ITEM_SIZE.width, startState.width + deltaX);
            newHeight = Math.max(
              MIN_ITEM_SIZE.height,
              startState.height - deltaY
            );
            newY = startState.y + (startState.height - newHeight);
          }
          break;
        case "sw": // Bottom-left
          if (maintainAspectRatio) {
            const scale = Math.min(
              (startState.width - deltaX) / startState.width,
              (startState.height + deltaY) / startState.height
            );
            newWidth = Math.max(MIN_ITEM_SIZE.width, startState.width * scale);
            newHeight = newWidth / aspectRatio;
            newX = startState.x + (startState.width - newWidth);
          } else {
            newWidth = Math.max(MIN_ITEM_SIZE.width, startState.width - deltaX);
            newHeight = Math.max(
              MIN_ITEM_SIZE.height,
              startState.height + deltaY
            );
            newX = startState.x + (startState.width - newWidth);
          }
          break;
        case "se": // Bottom-right
          if (maintainAspectRatio) {
            const scale = Math.min(
              (startState.width + deltaX) / startState.width,
              (startState.height + deltaY) / startState.height
            );
            newWidth = Math.max(MIN_ITEM_SIZE.width, startState.width * scale);
            newHeight = newWidth / aspectRatio;
          } else {
            newWidth = Math.max(MIN_ITEM_SIZE.width, startState.width + deltaX);
            newHeight = Math.max(
              MIN_ITEM_SIZE.height,
              startState.height + deltaY
            );
          }
          break;
        case "n": // Top edge
          if (maintainAspectRatio) {
            const scale = (startState.height - deltaY) / startState.height;
            newHeight = Math.max(
              MIN_ITEM_SIZE.height,
              startState.height * scale
            );
            newWidth = newHeight * aspectRatio;
            newY = startState.y + (startState.height - newHeight);
            newX = startState.x + (startState.width - newWidth) / 2;
          } else {
            newHeight = Math.max(
              MIN_ITEM_SIZE.height,
              startState.height - deltaY
            );
            newY = startState.y + (startState.height - newHeight);
          }
          break;
        case "s": // Bottom edge
          if (maintainAspectRatio) {
            const scale = (startState.height + deltaY) / startState.height;
            newHeight = Math.max(
              MIN_ITEM_SIZE.height,
              startState.height * scale
            );
            newWidth = newHeight * aspectRatio;
            newX = startState.x + (startState.width - newWidth) / 2;
          } else {
            newHeight = Math.max(
              MIN_ITEM_SIZE.height,
              startState.height + deltaY
            );
          }
          break;
        case "e": // Right edge
          if (maintainAspectRatio) {
            const scale = (startState.width + deltaX) / startState.width;
            newWidth = Math.max(MIN_ITEM_SIZE.width, startState.width * scale);
            newHeight = newWidth / aspectRatio;
            newY = startState.y + (startState.height - newHeight) / 2;
          } else {
            newWidth = Math.max(MIN_ITEM_SIZE.width, startState.width + deltaX);
          }
          break;
        case "w": // Left edge
          if (maintainAspectRatio) {
            const scale = (startState.width - deltaX) / startState.width;
            newWidth = Math.max(MIN_ITEM_SIZE.width, startState.width * scale);
            newHeight = newWidth / aspectRatio;
            newX = startState.x + (startState.width - newWidth);
            newY = startState.y + (startState.height - newHeight) / 2;
          } else {
            newWidth = Math.max(MIN_ITEM_SIZE.width, startState.width - deltaX);
            newX = startState.x + (startState.width - newWidth);
          }
          break;
      }

      // Constrain to canvas bounds
      const constrained = constrainPosition(
        newX,
        newY,
        newWidth,
        newHeight,
        canvasRect.width,
        canvasRect.height
      );

      // Adjust dimensions if position was constrained
      const finalWidth = Math.min(newWidth, canvasRect.width - constrained.x);
      const finalHeight = Math.min(
        newHeight,
        canvasRect.height - constrained.y
      );

      onResize(constrained.x, constrained.y, finalWidth, finalHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      resizeStartPos.current = null;
      itemStartState.current = null;
      handlePosition.current = null;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, onResize, canvasRef, item.type, item.aspectRatio]);

  return {
    isResizing,
    handleMouseDown,
  };
}
