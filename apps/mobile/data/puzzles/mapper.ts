import { Board, Clue } from '@shikaku/engine';
import { RawPuzzle } from './types';

export function mapRawPuzzleToBoard(raw: RawPuzzle): Board {
    const clues: Clue[] = raw.clues.map(([x, y, value]) => ({
        x,
        y,
        value
    }));

    return {
        width: raw.size[0],
        height: raw.size[1],
        clues
    };
}
