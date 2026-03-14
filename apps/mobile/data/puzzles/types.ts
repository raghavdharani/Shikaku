export type RawClue = [number, number, number]; // [x, y, value]

export interface RawPuzzle {
    id: string;
    size: [number, number]; // [width, height]
    clues: RawClue[];
}

export interface Level {
    id: string;
    name: string;
    description: string;
    puzzles: RawPuzzle[];
}
