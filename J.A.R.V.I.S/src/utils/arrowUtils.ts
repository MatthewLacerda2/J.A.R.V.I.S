import { Arrow, Diagram } from "../types/diagram";
import { Point } from "../types/drawing";
import { getDiagramCenter } from "./diagramUtils";

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
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  // Determine L-shape routing: horizontal first if |dx| > |dy|, otherwise vertical first
  const goHorizontalFirst = Math.abs(dx) > Math.abs(dy);

  // Calculate the corner point of the L-shape
  const corner = goHorizontalFirst
    ? { x: end.x, y: start.y } // Horizontal first: go to end.x, then down/up
    : { x: start.x, y: end.y }; // Vertical first: go down/up, then to end.x

  return `M ${start.x} ${start.y} L ${corner.x} ${corner.y} L ${end.x} ${end.y}`;
}

function isPointOnLineSegment(
  point: Point,
  start: Point,
  end: Point,
  threshold: number = 20
): boolean {
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
    (point.x - projX) * (point.x - projX) +
      (point.y - projY) * (point.y - projY)
  );

  return dist < threshold;
}

export function isPointOnArrow(
  point: Point,
  arrow: Arrow,
  diagrams: Diagram[]
): boolean {
  const { start, end } = calculateArrowEndpoints(arrow, diagrams);
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  // Determine L-shape routing: horizontal first if |dx| > |dy|, otherwise vertical first
  const goHorizontalFirst = Math.abs(dx) > Math.abs(dy);

  // Calculate the corner point of the L-shape
  const corner = goHorizontalFirst
    ? { x: end.x, y: start.y } // Horizontal first: go to end.x, then down/up
    : { x: start.x, y: end.y }; // Vertical first: go down/up, then to end.x

  // Check if point is on either segment of the L-shape
  return (
    isPointOnLineSegment(point, start, corner) ||
    isPointOnLineSegment(point, corner, end)
  );
}
