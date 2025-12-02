import { Undo2 } from 'lucide-react';
import { useDrawingStore } from '../../stores/useDrawingStore';
import { DRAWING_COLORS, MIN_PEN_WIDTH, MAX_PEN_WIDTH } from '../../constants/drawing';
import { cn } from '../../lib/utils';

export function DrawingToolbar() {
  const {
    color,
    penWidth,
    strokes,
    setColor,
    setPenWidth,
    clearAll,
    undoLastStroke,
  } = useDrawingStore();

  const canUndo = strokes.length > 0;

  return (
    <div
      data-drawing-toolbar
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-sm rounded-full px-6 py-4 flex items-center gap-6 border border-white/10 shadow-lg"
    >

      {/* Pen Width Slider */}
      <div className="flex items-center gap-3 min-w-[120px]">
        <span className="text-white text-sm font-medium w-8">{penWidth}</span>
        <input
          type="range"
          min={MIN_PEN_WIDTH}
          max={MAX_PEN_WIDTH}
          value={penWidth}
          onChange={(e) => setPenWidth(Number(e.target.value))}
          className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
          style={{
            background: `linear-gradient(to right, white 0%, white ${((penWidth - MIN_PEN_WIDTH) / (MAX_PEN_WIDTH - MIN_PEN_WIDTH)) * 100}%, rgba(255,255,255,0.2) ${((penWidth - MIN_PEN_WIDTH) / (MAX_PEN_WIDTH - MIN_PEN_WIDTH)) * 100}%, rgba(255,255,255,0.2) 100%)`,
          }}
        />
      </div>

      {/* Separator */}
      <div className="h-8 w-px bg-white/20" />

      {/* Color Picker */}
      <div className="flex items-center gap-2">
        {DRAWING_COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={cn(
              'w-8 h-8 rounded-full border-2 transition-all hover:scale-110',
              color === c
                ? 'border-white scale-110 ring-2 ring-white/50'
                : 'border-white/30 hover:border-white/60'
            )}
            style={{ backgroundColor: c }}
            aria-label={`Select color ${c}`}
          />
        ))}
      </div>

      {/* Separator */}
      <div className="h-8 w-px bg-white/20" />

      {/* Undo Button */}
      <button
        onClick={undoLastStroke}
        disabled={!canUndo}
        className={cn(
          'p-2 rounded-lg transition-colors',
          canUndo
            ? 'text-white hover:bg-white/10'
            : 'text-white/30 cursor-not-allowed'
        )}
        aria-label="Undo last stroke"
      >
        <Undo2 size={20} />
      </button>

      {/* Separator */}
      <div className="h-8 w-px bg-white/20" />

      {/* Clear Button */}
      <button
        onClick={clearAll}
        className="px-4 py-2 text-white text-sm font-medium hover:bg-white/10 rounded-lg transition-colors"
      >
        Clear
      </button>
    </div>
  );
}
