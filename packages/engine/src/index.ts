export type Clue = { x: number; y: number; value: number };
export type Rectangle = { x: number; y: number; width: number; height: number };
export type Board = { width: number; height: number; clues: Clue[] };

export type ValidationResult = {
  isSolved: boolean;
  errors: string[];
};

function cellsForRectangle(rectangle: Rectangle) {
  const cells = [] as Array<string>;
  for (let y = rectangle.y; y < rectangle.y + rectangle.height; y += 1) {
    for (let x = rectangle.x; x < rectangle.x + rectangle.width; x += 1) {
      cells.push(`${x},${y}`);
    }
  }
  return cells;
}

export function validateSolvedBoard(board: Board, rectangles: Rectangle[]): ValidationResult {
  const errors: string[] = [];
  const occupied = new Map<string, number>();

  rectangles.forEach((rectangle, index) => {
    const cells = cellsForRectangle(rectangle);
    for (const cell of cells) {
      const count = occupied.get(cell) ?? 0;
      occupied.set(cell, count + 1);
      if (count >= 1) {
        errors.push(`Overlap detected at ${cell}`);
      }
    }

    const containedClues = board.clues.filter(
      clue =>
        clue.x >= rectangle.x &&
        clue.x < rectangle.x + rectangle.width &&
        clue.y >= rectangle.y &&
        clue.y < rectangle.y + rectangle.height
    );

    if (containedClues.length !== 1) {
      errors.push(`Rectangle ${index} must contain exactly one clue`);
      return;
    }

    const area = rectangle.width * rectangle.height;
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
