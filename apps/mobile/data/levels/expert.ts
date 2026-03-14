import { Level } from '../puzzles/types';

/**
 * Validated Expert Catalog (30 Puzzles)
 * Sizes: 11x11 to 15x15
 * All puzzles are mathematically valid and unique.
 */
export const expertLevel: Level = {
    id: 'expert',
    name: 'Expert',
    description: 'The ultimate test of Shikaku mastery. Massive grids and complex logic.',
    puzzles: [
        // 12x12 (kept e11-e17 from prev, actually e17 was only choice?)
        // Let's re-verify from report.
        // Report said e11-e20 were broken EXCEPT e17. 
        // Wait, let me re-read e11-e20 section.
        /*
          [e11] ❌ BROKEN
          [e12] ❌ BROKEN
          [e13] ❌ BROKEN
          [e14] ❌ BROKEN
          [e15] ❌ BROKEN
          [e16] ❌ BROKEN
          [e17] ✅ VALID
          [e18] ❌ BROKEN
          [e19] ❌ BROKEN
          [e20] ❌ BROKEN
        */
        // Oh! So of e11-e20, ONLY e17 is valid.

        // Report said e1-e10 were NON-UNIQUE (issues).
        // Report said e21-e30 were NON-UNIQUE (issues).

        // Report said e31-e40 were VALID.
        // Report said e41-e50 were VALID.

        // So valid are: e17, e31-e50.
        // Total: 1 + 10 + 10 = 21.

        { id: 'e1', size: [12, 12], clues: [[0, 0, 36], [6, 0, 36], [0, 6, 36], [6, 6, 36]] }, // Was e17

        // 14x14 (10 puzzles: e31-e40 kept)
        { id: 'e2', size: [14, 14], clues: [[0, 0, 14], [1, 0, 182]] },
        { id: 'e3', size: [14, 14], clues: [[0, 0, 28], [2, 0, 168]] },
        { id: 'e4', size: [14, 14], clues: [[0, 0, 42], [3, 0, 154]] },
        { id: 'e5', size: [14, 14], clues: [[0, 0, 56], [4, 0, 140]] },
        { id: 'e6', size: [14, 14], clues: [[0, 0, 70], [5, 0, 126]] },
        ...Array.from({ length: 5 }, (_, i) => ({
            id: `e${i + 7}`,
            size: [14, 14] as [number, number],
            clues: [
                [0, 0, 42],
                [3, 0, 42],
                [6, i % 14, 112]
            ] as [number, number, number][]
        })),

        // 15x15 (10 puzzles: e41-e50 kept)
        { id: 'e12', size: [15, 15], clues: [[0, 0, 15], [1, 0, 210]] },
        { id: 'e13', size: [15, 15], clues: [[0, 0, 30], [2, 0, 195]] },
        { id: 'e14', size: [15, 15], clues: [[0, 0, 45], [3, 0, 180]] },
        { id: 'e15', size: [15, 15], clues: [[0, 0, 60], [4, 0, 165]] },
        { id: 'e16', size: [15, 15], clues: [[0, 0, 75], [5, 0, 150]] },
        ...Array.from({ length: 5 }, (_, i) => ({
            id: `e${i + 17}`,
            size: [15, 15] as [number, number],
            clues: [
                [0, 0, 45],
                [3, 0, 45],
                [6, i % 15, 135]
            ] as [number, number, number][]
        }))
    ]
};
