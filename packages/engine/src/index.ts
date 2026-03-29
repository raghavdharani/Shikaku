export * from './types';
export * from './geometry';
export * from './gameplay';
export * from './solver';
import { Board, Rectangle, ValidationResult } from './types';
import {
  getCellsForRectangle,
  isRectangleInsideBoard,
  doRectanglesOverlap,
  containsCell,
  getRectangleArea
} from './geometry';

export function validateSolvedBoard(board: Board, rectangles: Rectangle[]): ValidationResult {
  const errors: string[] = [];
  const occupied = new Set<string>();

  rectangles.forEach((rectangle, index) => {
    // 1. Validate dimensions
    if (rectangle.width <= 0 || rectangle.height <= 0) {
      errors.push(`Rectangle ${index} has invalid dimensions: ${rectangle.width}x${rectangle.height}`);
      return; // Skip further checks for invalid shapes
    }

    // 2. Bound checks
    if (!isRectangleInsideBoard(board, rectangle)) {
      errors.push(`Rectangle ${index} is out of bounds`);
    }

    // 3. Mark cells and overlap checks
    // We check overlaps using pairs with `doRectanglesOverlap` instead of a grid matrix
    // but the set is kept to verify all board cells are covered without O(N) queries
    const cells = getCellsForRectangle(rectangle);
    for (const cell of cells) {
      const key = `${cell.x},${cell.y}`;
      occupied.add(key);
    }

    // Check overlaps explicitly using the logic helper
    for (let j = index + 1; j < rectangles.length; j++) {
      if (doRectanglesOverlap(rectangle, rectangles[j])) {
        errors.push(`Overlap detected between Rectangle ${index} and Rectangle ${j}`);
      }
    }

    const containedClues = board.clues.filter(clue => containsCell(rectangle, clue));

    if (containedClues.length !== 1) {
      errors.push(`Rectangle ${index} must contain exactly one clue`);
      return;
    }

    const area = getRectangleArea(rectangle);
    if (containedClues[0].value !== area) {
      errors.push(`Rectangle ${index} area ${area} does not match clue ${containedClues[0].value}`);
    }
  });

  for (let y = 0; y < board.height; y += 1) {
    for (let x = 0; x < board.width; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) {
        errors.push(`Uncovered cell at ${key}`);
      }
    }
  }

  return {
    isSolved: errors.length === 0,
    errors
  };
}
