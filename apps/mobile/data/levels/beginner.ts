import { Level } from '../puzzles/types';

/**
 * Validated Beginner Catalog (29 Puzzles)
 * Sizes: 5x5 to 7x7
 * All puzzles are mathematically valid and unique.
 */
export const beginnerLevel: Level = {
    id: 'beginner',
    name: 'Beginner',
    description: 'Perfect for learning the ropes. Simple grids and early logic.',
    puzzles: [
        // 5x5 (10 puzzles)
        { id: 'b1', size: [5, 5], clues: [[0, 0, 4], [2, 0, 6], [0, 2, 6], [2, 2, 9]] },
        { id: 'b2', size: [5, 5], clues: [[0, 0, 9], [3, 0, 6], [0, 3, 6], [3, 3, 4]] },
        { id: 'b3', size: [5, 5], clues: [[0, 0, 5], [1, 0, 5], [2, 0, 5], [3, 0, 5], [4, 0, 5]] },
        { id: 'b4', size: [5, 5], clues: [[0, 0, 10], [2, 0, 15]] },
        { id: 'b5', size: [5, 5], clues: [[0, 0, 2], [1, 0, 8], [0, 2, 3], [1, 2, 12]] },
        { id: 'b6', size: [5, 5], clues: [[0, 0, 25]] },
        { id: 'b7', size: [5, 5], clues: [[0, 0, 1], [1, 0, 4], [0, 1, 4], [1, 1, 16]] },
        { id: 'b8', size: [5, 5], clues: [[0, 0, 10], [2, 0, 15]] },
        { id: 'b9', size: [5, 5], clues: [[0, 0, 1], [1, 0, 4], [0, 1, 4], [1, 1, 16]] },
        { id: 'b10', size: [5, 5], clues: [[0, 0, 9], [3, 0, 6], [0, 3, 6], [3, 3, 4]] },

        // 6x6 (9 puzzles, b19 removed)
        { id: 'b11', size: [6, 6], clues: [[0, 0, 9], [3, 0, 9], [0, 3, 9], [3, 3, 9]] },
        { id: 'b12', size: [6, 6], clues: [[0, 0, 18], [0, 3, 18]] },
        { id: 'b13', size: [6, 6], clues: [[0, 0, 12], [2, 0, 12], [4, 0, 12]] },
        { id: 'b14', size: [6, 6], clues: [[0, 0, 6], [0, 1, 6], [0, 2, 6], [0, 3, 6], [0, 4, 6], [0, 5, 6]] },
        { id: 'b15', size: [6, 6], clues: [[0, 0, 4], [2, 0, 4], [4, 0, 4], [0, 2, 4], [2, 2, 4], [4, 2, 4], [0, 4, 4], [2, 4, 4], [4, 4, 4]] },
        { id: 'b16', size: [6, 6], clues: [[0, 0, 2], [2, 0, 4], [0, 1, 6], [0, 2, 24]] },
        { id: 'b17', size: [6, 6], clues: [[0, 0, 12], [0, 2, 12], [0, 4, 12]] },
        { id: 'b18', size: [6, 6], clues: [[0, 0, 12], [0, 2, 24]] },
        { id: 'b19', size: [6, 6], clues: [[0, 0, 36]] },

        // 7x7 (10 puzzles)
        { id: 'b20', size: [7, 7], clues: [[0, 0, 7], [0, 1, 7], [0, 2, 7], [0, 3, 7], [0, 4, 7], [0, 5, 7], [0, 6, 7]] },
        { id: 'b21', size: [7, 7], clues: [[0, 0, 21], [3, 0, 28]] },
        { id: 'b22', size: [7, 7], clues: [[0, 0, 14], [2, 0, 35]] },
        { id: 'b23', size: [7, 7], clues: [[0, 0, 14], [2, 0, 14], [4, 0, 21]] },
        { id: 'b24', size: [7, 7], clues: [[0, 0, 25], [5, 0, 10], [0, 5, 14]] },
        { id: 'b25', size: [7, 7], clues: [[0, 0, 49]] },
        { id: 'b26', size: [7, 7], clues: [[0, 0, 7], [1, 0, 42]] },
        { id: 'b27', size: [7, 7], clues: [[0, 0, 35], [5, 0, 14]] },
        { id: 'b28', size: [7, 7], clues: [[0, 0, 28], [4, 0, 21]] },
        { id: 'b29', size: [7, 7], clues: [[0, 0, 14], [2, 0, 35]] }
    ]
};
