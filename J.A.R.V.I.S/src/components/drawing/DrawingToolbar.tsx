import { Pencil, PencilOff, Undo2 } from "lucide-react";
import { useEffect } from "react";
import {
  DRAWING_COLORS,
  MAX_PEN_WIDTH,
  MIN_PEN_WIDTH,
} from "../../constants/drawing";
import { cn } from "../../lib/utils";
import { useDiagramStore } from "../../stores/useDiagramStore";
import { useDrawingStore } from "../../stores/useDrawingStore";

export function DrawingToolbar() {
  const {
    color,
    penWidth,
    strokes,
    isEnabled,
    setColor,
    setPenWidth,
    toggleEnabled,
    clearAll,
    undoLastStroke,
  } = useDrawingStore();
  const setDiagramToolMode = useDiagramStore((state) => state.setToolMode);

  const handleToggleEnabled = () => {
    const newEnabledState = !isEnabled;
    toggleEnabled();
    if (newEnabledState) {
      // Turning drawing on, disable diagram tools
      setDiagramToolMode("none");
    }
    // If turning drawing off, don't change diagram mode
  };

  const canUndo = strokes.length > 0;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+Z (Windows/Linux) or Cmd+Z (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        // Prevent default browser undo behavior
        e.preventDefault();
        if (canUndo) {
          undoLastStroke();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [canUndo, undoLastStroke]);

  return (
    <div
      data-drawing-toolbar
      className="fixed bottom-5 translate-x-1/4 z-50 backdrop-blur-sm rounded-full flex items-center gap-6"
    >
      <div className="flex items-center gap-3 min-w-[120px]">
        <span className="text-white text-lg font-medium w-8">{penWidth}</span>
        <input
          type="range"
          min={MIN_PEN_WIDTH}
          max={MAX_PEN_WIDTH}
          value={penWidth}
          onChange={(e) => setPenWidth(Number(e.target.value))}
          className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
          style={{
            background: `linear-gradient(to right, white 0%, white ${
              ((penWidth - MIN_PEN_WIDTH) / (MAX_PEN_WIDTH - MIN_PEN_WIDTH)) *
              100
            }%, rgba(255,255,255,0.2) ${
              ((penWidth - MIN_PEN_WIDTH) / (MAX_PEN_WIDTH - MIN_PEN_WIDTH)) *
              100
            }%, rgba(255,255,255,0.2) 100%)`,
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        {DRAWING_COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={cn(
              "w-7 h-7 rounded-full border-2 transition-all hover:scale-100",
              color === c
                ? "border-white scale-100 ring-2 ring-white/50"
                : "border-white/30 hover:border-white/60 hover:border-3"
            )}
            style={{ backgroundColor: c }}
            aria-label={`Select color ${c}`}
          />
        ))}
      </div>

      <button
        onClick={undoLastStroke}
        disabled={!canUndo}
        className={cn(
          "p-2 rounded-lg transition-colors",
          canUndo
            ? "text-white hover:bg-white/10"
            : "text-white/30 cursor-not-allowed"
        )}
        aria-label="Undo last stroke"
      >
        <Undo2 size={20} />
      </button>

      <button
        onClick={clearAll}
        className=" py-2 text-white text-lg font-medium hover:bg-white/10 rounded-lg transition-colors"
      >
        Clear
      </button>

      <button
        onClick={handleToggleEnabled}
        className={cn(
          "p-2 rounded-lg transition-colors",
          isEnabled
            ? "bg-white/20 text-white"
            : "text-white/70 hover:bg-white/10 hover:text-white"
        )}
        aria-label={isEnabled ? "Disable drawing" : "Enable drawing"}
      >
        {isEnabled ? <Pencil size={20} /> : <PencilOff size={20} />}
      </button>
    </div>
  );
}
