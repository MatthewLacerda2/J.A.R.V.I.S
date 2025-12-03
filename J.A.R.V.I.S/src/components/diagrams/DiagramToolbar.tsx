import { BowArrow, RectangleEllipsis } from "lucide-react";
import { useDiagram } from "../../hooks/useDiagram";
import { cn } from "../../lib/utils";

export function DiagramToolbar() {
  const { toolMode, setToolMode } = useDiagram();

  return (
    <div
      data-diagram-toolbar
      className="fixed top-3 right-1/8 -translate-x-1/2 z-50 bg-black/80 rounded-full px-3.5 py-2 flex items-center gap-3 border border-white/10"
    >
      <button
        onClick={() =>
          setToolMode(toolMode === "rectangle" ? "none" : "rectangle")
        }
        className={cn(
          "px-3 py-2 rounded-full transition-colors flex items-center gap-2",
          toolMode === "rectangle"
            ? "bg-white/20 text-white"
            : "text-white/70 hover:bg-white/10 hover:text-white"
        )}
        aria-label="Rectangle tool"
      >
        <RectangleEllipsis size={20} />
        <p className="text-white/70 text-sm text-semibold pr-2">Diagram</p>
      </button>

      <div className="h-6 w-px bg-white/30" />

      <button
        onClick={() => setToolMode(toolMode === "arrow" ? "none" : "arrow")}
        className={cn(
          "px-2 py-1 rounded-full transition-colors flex items-center gap-2",
          toolMode === "arrow"
            ? "bg-white/20 text-white"
            : "text-white/70 hover:bg-white/10 hover:text-white"
        )}
        aria-label="Arrow tool"
      >
        <BowArrow size={20} />
        <span className="text-white/70 text-sm text-semibold pr-2">Arrow</span>
      </button>
    </div>
  );
}
