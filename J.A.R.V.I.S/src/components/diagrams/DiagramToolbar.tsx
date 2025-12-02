import { BowArrow, GitCompareArrows, GitPullRequestArrow, RectangleEllipsis, SquareArrowUp, WindArrowDownIcon } from 'lucide-react';
import { useDiagram } from '../../hooks/useDiagram';
import { cn } from '../../lib/utils';

export function DiagramToolbar() {
  const { toolMode, setToolMode } = useDiagram();

  return (
    <div
      data-diagram-toolbar
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-3 border border-white/10 shadow-lg"
    >
      <button
        onClick={() => setToolMode(toolMode === 'rectangle' ? 'none' : 'rectangle')}
        className={cn(
          'p-2 rounded-lg transition-colors',
          toolMode === 'rectangle'
            ? 'bg-white/20 text-white'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        )}
        aria-label="Rectangle tool"
      >
        <RectangleEllipsis size={20} />
      </button>

      <button
        onClick={() => setToolMode(toolMode === 'arrow' ? 'none' : 'arrow')}
        className={cn(
          'p-2 rounded-lg transition-colors',
          toolMode === 'arrow'
            ? 'bg-white/20 text-white'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        )}
        aria-label="Arrow tool"
      >
        <BowArrow size={20} />
      </button>
    </div>
  );
}

