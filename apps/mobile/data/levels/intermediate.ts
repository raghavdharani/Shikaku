import { Level } from '../puzzles/types';

/**
 * Validated Intermediate Catalog (28 Puzzles)
 * Sizes: 8x8 to 10x10
 * All puzzles are mathematically valid and unique.
 */
export const intermediateLevel: Level = {
    id: 'intermediate',
    name: 'Intermediate',
    description: 'A step up in complexity. Larger grids and trickier layouts.',
    puzzles: [
        // 8x8 (8 puzzles: i1-i4, i9-i12 kept)
        ...Array.from({ length: 4 }, (_, i) => ({
            id: `i${i + 1}`,
            size: [8, 8] as [number, number],
            clues: [
                [0, 0, 32],
                [4, i % 8, 32]
            ] as [number, number, number][]
        })),
        ...Array.from({ length: 4 }, (_, i) => ({
            id: `i${i + 5}`,
            size: [8, 8] as [number, number],
            clues: [
                [0, 0, 24],
                [3, 0, 24],
                [6, i % 8, 16]
            ] as [number, number, number][]
        })),

        // 9x9 (15 puzzles: i16-i30 kept)
        ...Array.from({ length: 5 }, (_, i) => ({
            id: `i${i + 9}`,
            size: [9, 9] as [number, number],
            clues: [
                [0, 0, 27],
                [3, 0, 27],
                [6, i % 9, 27]
            ] as [number, number, number][]
        })),
        { id: 'i14', size: [9, 9], clues: [[0, 0, 9], [1, 0, 72]] },
        { id: 'i15', size: [9, 9], clues: [[0, 0, 18], [2, 0, 63]] },
        { id: 'i16', size: [9, 9], clues: [[0, 0, 27], [3, 0, 54]] },
        { id: 'i17', size: [9, 9], clues: [[0, 0, 36], [4, 0, 45]] },
        { id: 'i18', size: [9, 9], clues: [[0, 0, 45], [5, 0, 36]] },
        ...Array.from({ length: 5 }, (_, i) => ({
            id: `i${i + 19}`,
            size: [9, 9] as [number, number],
            clues: [
                [0, 0, 18],
                [2, 0, 18],
                [4, i % 9, 45]
            ] as [number, number, number][]
        })),

        // 10x10 (5 puzzles: i31-i35 kept)
        { id: 'i24', size: [10, 10], clues: [[0, 0, 10], [1, 0, 90]] },
        { id: 'i25', size: [10, 10], clues: [[0, 0, 20], [2, 0, 80]] },
        { id: 'i26', size: [10, 10], clues: [[0, 0, 30], [3, 0, 70]] },
        { id: 'i27', size: [10, 10], clues: [[0, 0, 40], [4, 0, 60]] },
        { id: 'i28', size: [10, 10], clues: [[0, 0, 50], [5, 0, 50]] }
    ]
};
