import { Board, Rectangle, Clue } from './types';
import { isRectangleInsideBoard, containsCell, doRectanglesOverlap } from './geometry';

export interface SolverResult {
    solutions: Rectangle[][];
    isValidArea: boolean;
    clueSum: number;
    boardArea: number;
}

/**
 * Gets all possible rectangles for a given clue that fit on the board
 * and do not contain any other clues.
 */
export function getPossibleRectanglesForClue(board: Board, clue: Clue): Rectangle[] {
    const results: Rectangle[] = [];
    const { x: cx, y: cy, value } = clue;

    // Find all pairs (w, h) such that w * h = value
    for (let w = 1; w <= value; w++) {
        if (value % w === 0) {
            const h = value / w;

            // w and h must fit within board dimensions
            if (w > board.width || h > board.height) continue;

            // Find all positions (x, y) such that this rectangle contains (cx, cy)
            // x must be in [cx - w + 1, cx]
            // y must be in [cy - h + 1, cy]
            for (let x = Math.max(0, cx - w + 1); x <= Math.min(cx, board.width - w); x++) {
                for (let y = Math.max(0, cy - h + 1); y <= Math.min(cy, board.height - h); y++) {
                    const rect: Rectangle = { x, y, width: w, height: h };

                    // Check if rectangle contains other clues
                    const otherClues = board.clues.filter(c =>
                        c.x !== cx || c.y !== cy
                    ).some(c => containsCell(rect, c));

                    if (!otherClues) {
                        results.push(rect);
                    }
                }
            }
        }
    }

    return results;
}

/**
 * Solves a Shikaku board using backtracking.
 * Returns a SolverResult containing all found solutions and area metadata.
 */
export function solveBoard(board: Board, limit: number = 2): SolverResult {
    const boardArea = board.width * board.height;
    const clueSum = board.clues.reduce((sum, c) => sum + c.value, 0);
    const isValidArea = boardArea === clueSum;

    const solutions: Rectangle[][] = [];

    // Generate possibilities for each clue
    const possibilities = board.clues.map(clue => getPossibleRectanglesForClue(board, clue));

    // If any clue has 0 possibilities, it's unsolvable
    if (possibilities.some(p => p.length === 0)) {
        return { solutions: [], isValidArea, clueSum, boardArea };
    }

    const currentRects: Rectangle[] = [];

    function backtrack(clueIndex: number) {
        if (solutions.length >= limit) return;

        if (clueIndex === board.clues.length) {
            solutions.push([...currentRects]);
            return;
        }

        for (const rect of possibilities[clueIndex]) {
            // Check overlap with already placed rectangles
            const hasOverlap = currentRects.some(r => doRectanglesOverlap(r, rect));

            if (!hasOverlap) {
                currentRects.push(rect);
                backtrack(clueIndex + 1);
                currentRects.pop();
            }
        }
    }

    backtrack(0);

    return {
        solutions,
        isValidArea,
        clueSum,
        boardArea
    };
}
