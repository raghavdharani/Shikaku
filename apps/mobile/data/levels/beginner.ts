import { Level } from '../puzzles/types';

export const beginnerLevel: Level = {
    id: 'beginner',
    name: 'Beginner',
    description: 'Perfect for learning the ropes. Simple grids and early logic.',
    puzzles: [
        {
            id: 'b1',
            size: [4, 4],
            clues: [
                [0, 0, 4],
                [2, 0, 4],
                [0, 2, 4],
                [2, 2, 4]
            ]
        },
        {
            id: 'b2',
            size: [5, 5],
            clues: [
                [2, 0, 5],
                [1, 2, 6],
                [4, 3, 6],
                [1, 4, 6],
                [3, 4, 2]
            ]
        },
        {
            id: 'b3',
            size: [5, 5],
            clues: [
                [0, 0, 5],
                [1, 0, 5],
                [2, 0, 5],
                [3, 0, 5],
                [4, 0, 5]
            ]
        }
    ]
};
