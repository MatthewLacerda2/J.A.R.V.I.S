import React from "react";
import { ResizeHandlePosition } from "../../types/media";

type CornerHandlePosition = "nw" | "ne" | "sw" | "se";

interface ResizeHandleProps {
  position: CornerHandlePosition;
  onMouseDown: (e: React.MouseEvent, position: ResizeHandlePosition) => void;
}

const handleStyles: Record<CornerHandlePosition, React.CSSProperties> = {
  nw: {
    top: "-4px",
    left: "-4px",
    cursor: "nw-resize",
  },
  ne: {
    top: "-4px",
    right: "-4px",
    cursor: "ne-resize",
  },
  sw: {
    bottom: "-4px",
    left: "-4px",
    cursor: "sw-resize",
  },
  se: {
    bottom: "-4px",
    right: "-4px",
    cursor: "se-resize",
  },
};

export function ResizeHandle({ position, onMouseDown }: ResizeHandleProps) {
  const style = handleStyles[position];

  return (
    <div
      className="absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-sm z-10"
      style={style}
      onMouseDown={(e) => onMouseDown(e, position)}
    />
  );
}

interface ResizeHandlesProps {
  onHandleMouseDown: (
    e: React.MouseEvent,
    position: ResizeHandlePosition
  ) => void;
}

export function ResizeHandles({ onHandleMouseDown }: ResizeHandlesProps) {
  const cornerPositions: CornerHandlePosition[] = ["nw", "ne", "sw", "se"];

  return (
    <>
      {cornerPositions.map((position) => (
        <ResizeHandle
          key={position}
          position={position}
          onMouseDown={onHandleMouseDown}
        />
      ))}
    </>
  );
}
