import { Level } from '../puzzles/types';

export const intermediateLevel: Level = {
    id: 'intermediate',
    name: 'Intermediate',
    description: 'A step up in complexity. Larger grids and trickier layouts.',
    puzzles: [
        {
            id: 'i1',
            size: [7, 7],
            clues: [
                [3, 0, 14],
                [1, 3, 9],
                [6, 2, 8],
                [0, 6, 6],
                [4, 5, 12]
            ]
        },
        {
            id: 'i2',
            size: [8, 8],
            clues: [
                [0, 0, 16],
                [0, 2, 16],
                [0, 4, 16],
                [0, 6, 16]
            ]
        },
        {
            id: 'i3',
            size: [10, 10],
            clues: [
                [0, 0, 25],
                [5, 0, 25],
                [0, 5, 25],
                [5, 5, 25]
            ]
        }
    ]
};
