import { useDiagramStore } from '../stores/useDiagramStore';
import { useDrawingStore } from '../stores/useDrawingStore';

export function useDiagram() {
  const toolMode = useDiagramStore((state) => state.toolMode);
  const setToolMode = useDiagramStore((state) => state.setToolMode);
  const setDrawingEnabled = useDrawingStore((state) => state.setEnabled);

  const handleSetToolMode = (mode: 'none' | 'rectangle' | 'arrow') => {
    setToolMode(mode);
    if (mode !== 'none') {
      setDrawingEnabled(false);
    }
  };

  return {
    toolMode,
    setToolMode: handleSetToolMode,
  };
}

