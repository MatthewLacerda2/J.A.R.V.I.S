import { Arrow, Diagram } from '../types/diagram';
import { Point } from '../types/drawing';
import { getDiagramCenter } from './diagramUtils';

export function calculateArrowEndpoints(
  arrow: Arrow,
  diagrams: Diagram[]
): { start: Point; end: Point } {
  let start: Point = { x: arrow.startX, y: arrow.startY };
  let end: Point = { x: arrow.endX, y: arrow.endY };

  if (arrow.startDiagramId) {
    const startDiagram = diagrams.find((d) => d.id === arrow.startDiagramId);
    if (startDiagram) {
      start = getDiagramCenter(startDiagram);
    }
  }

  if (arrow.endDiagramId) {
    const endDiagram = diagrams.find((d) => d.id === arrow.endDiagramId);
    if (endDiagram) {
      end = getDiagramCenter(endDiagram);
    }
  }

  return { start, end };
}

export function getArrowPath(arrow: Arrow, diagrams: Diagram[]): string {
  const { start, end } = calculateArrowEndpoints(arrow, diagrams);
  return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
}

export function isPointOnArrow(point: Point, arrow: Arrow, diagrams: Diagram[]): boolean {
  const { start, end } = calculateArrowEndpoints(arrow, diagrams);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length === 0) return false;

  const t = Math.max(
    0,
    Math.min(
      1,
      ((point.x - start.x) * dx + (point.y - start.y) * dy) / (length * length)
    )
  );

  const projX = start.x + t * dx;
  const projY = start.y + t * dy;
  const dist = Math.sqrt(
    (point.x - projX) * (point.x - projX) + (point.y - projY) * (point.y - projY)
  );

  return dist < 10;
}
