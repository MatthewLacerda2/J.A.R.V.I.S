import React from 'react';
import { Diagram } from '../../types/diagram';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { useDiagramStore } from '../../stores/useDiagramStore';
import { useDiagramDrag } from '../../hooks/useDiagramDrag';
import { useDiagramResize } from '../../hooks/useDiagramResize';
import { DiagramText } from './DiagramText';

interface DiagramItemProps {
  diagram: Diagram;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

export function DiagramItem({ diagram, canvasRef }: DiagramItemProps) {
  const selectedItemId = useSelectionStore((state) => state.selectedItemId);
  const selectItem = useSelectionStore((state) => state.selectItem);
  const updateDiagram = useDiagramStore((state) => state.updateDiagram);

  const isSelected = selectedItemId === diagram.id;

  const { dragHandlers } = useDiagramDrag({
    diagram,
    onPositionChange: (x, y) => {
      updateDiagram(diagram.id, { x, y });
    },
    canvasRef,
  });

  const { resizeHandlers } = useDiagramResize({
    diagram,
    onResize: (x, y, width, height) => {
      updateDiagram(diagram.id, { x, y, width, height });
    },
    canvasRef,
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectItem(diagram.id, 'diagram');
  };

  const handleTextChange = (text: string) => {
    updateDiagram(diagram.id, { text });
  };

  return (
    <div
      data-diagram-item
      className="absolute cursor-move select-none"
      style={{
        left: `${diagram.x}px`,
        top: `${diagram.y}px`,
        width: `${diagram.width}px`,
        height: `${diagram.height}px`,
        backgroundColor: diagram.backgroundColor,
        border: `${diagram.borderWidth}px solid ${diagram.borderColor}`,
        borderRadius: '4px',
        boxShadow: isSelected ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
      }}
      onClick={handleClick}
      {...dragHandlers}
    >
      <DiagramText
        text={diagram.text}
        onTextChange={handleTextChange}
        width={diagram.width}
        height={diagram.height}
      />
      {isSelected && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize"
          style={{ borderRadius: '0 0 4px 0' }}
          {...resizeHandlers}
        />
      )}
    </div>
  );
}

