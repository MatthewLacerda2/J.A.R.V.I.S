import { Diagram } from '../types/diagram';
import { Point } from '../types/drawing';

export function isPointInDiagram(point: Point, diagram: Diagram): boolean {
  return (
    point.x >= diagram.x &&
    point.x <= diagram.x + diagram.width &&
    point.y >= diagram.y &&
    point.y <= diagram.y + diagram.height
  );
}

export function findDiagramAtPoint(point: Point, diagrams: Diagram[]): Diagram | null {
  return diagrams.find((diagram) => isPointInDiagram(point, diagram)) || null;
}

export function getDiagramCenter(diagram: Diagram): Point {
  return {
    x: diagram.x + diagram.width / 2,
    y: diagram.y + diagram.height / 2,
  };
}

