export type Cell = { x: number; y: number };
export type Clue = Cell & { value: number };
export type Rectangle = { x: number; y: number; width: number; height: number };

export type Board = { width: number; height: number; clues: Clue[] };

export type BoardState = {
    board: Board;
    rectangles: Rectangle[];
};

export type ValidationResult = {
    isSolved: boolean;
    errors: string[];
};
