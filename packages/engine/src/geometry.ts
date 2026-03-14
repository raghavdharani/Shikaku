import { Cell, Rectangle, Board } from './types';

export function getCellsForRectangle(rectangle: Rectangle): Cell[] {
    const cells: Cell[] = [];
    for (let y = rectangle.y; y < rectangle.y + rectangle.height; y += 1) {
        for (let x = rectangle.x; x < rectangle.x + rectangle.width; x += 1) {
            cells.push({ x, y });
        }
    }
    return cells;
}

export function isRectangleInsideBoard(board: Board, rectangle: Rectangle): boolean {
    return rectangle.x >= 0 &&
        rectangle.y >= 0 &&
        rectangle.x + rectangle.width <= board.width &&
        rectangle.y + rectangle.height <= board.height;
}

export function areCellsEqual(c1: Cell, c2: Cell): boolean {
    return c1.x === c2.x && c1.y === c2.y;
}

export function getRectangleArea(rectangle: Rectangle): number {
    return rectangle.width * rectangle.height;
}

export function doRectanglesOverlap(r1: Rectangle, r2: Rectangle): boolean {
    return !(r1.x + r1.width <= r2.x ||
        r2.x + r2.width <= r1.x ||
        r1.y + r1.height <= r2.y ||
        r2.y + r2.height <= r1.y);
}

export function containsCell(rectangle: Rectangle, cell: Cell): boolean {
    return cell.x >= rectangle.x &&
        cell.x < rectangle.x + rectangle.width &&
        cell.y >= rectangle.y &&
        cell.y < rectangle.y + rectangle.height;
}

export function getRectangleAtCell<T extends Rectangle>(
    boardState: { rectangles: T[] },
    cell: Cell
): T | undefined {
    return boardState.rectangles.find(r => containsCell(r, cell));
}

export function getRectanglesOverlappingRectangle<T extends Rectangle>(
    rectangles: T[],
    target: Rectangle
): T[] {
    return rectangles.filter(r => doRectanglesOverlap(r, target));
}
