import { beginnerLevel } from './beginner';
import { intermediateLevel } from './intermediate';
import { expertLevel } from './expert';

export const levels = [
    beginnerLevel,
    intermediateLevel,
    expertLevel
];

export type { Level, RawPuzzle, RawClue } from '../puzzles/types';
