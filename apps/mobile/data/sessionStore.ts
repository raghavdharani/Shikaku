export type SessionStats = {
    puzzlesSolved: number;
    placementsMade: number;
    undosMade: number;
};

let stats: SessionStats = {
    puzzlesSolved: 0,
    placementsMade: 0,
    undosMade: 0,
};

export const getSessionStats = () => stats;

export const incrementSolved = () => {
    stats.puzzlesSolved += 1;
};

export const incrementPlacements = () => {
    stats.placementsMade += 1;
};

export const incrementUndos = () => {
    stats.undosMade += 1;
};

export const resetSessionStats = () => {
    stats = {
        puzzlesSolved: 0,
        placementsMade: 0,
        undosMade: 0,
    };
};
