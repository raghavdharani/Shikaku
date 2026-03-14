import { Board, Rectangle, BoardState } from './types';
import { doRectanglesOverlap, getRectanglesOverlappingRectangle } from './geometry';

// -----------------------------------------------------
// 1. Core State Models
// -----------------------------------------------------

/** Represents a rectangle placed on the board by a user, with a unique identifier. */
export type PlacedRectangle = Rectangle & {
    id: string;
};

/** Placement strategies when overlaps are detected. */
export type PlacementPolicy = 'reject' | 'replace' | 'allow';

/** Represents a single, contiguous user intent transaction that mutated the board state. */
export type UserAction =
    | { type: 'PLACE'; added: PlacedRectangle }
    | { type: 'REMOVE'; removed: PlacedRectangle }
    | { type: 'REPLACE'; removed: PlacedRectangle[]; added: PlacedRectangle };

/** Defines a stack-based structure for tracking history */
export type UndoRedoState = {
    /** Actions that have been played. The last element is the most recent complete user action. */
    past: UserAction[];
    /** Actions that were undone and can be redone. The last element is the next redo. */
    future: UserAction[];
};

/** The complete snapshot of a game in progress. */
export type GameState = {
    board: Board;
    rectangles: PlacedRectangle[];
    history: UndoRedoState;
};

/** A serializable snapshot omitting strict history for saving across sessions flexibly. */
export type ProgressSnapshot = {
    board: Board;
    rectangles: PlacedRectangle[];
    past: UserAction[];
};

// -----------------------------------------------------
// 2. Pure Functions for State Manipulation
// -----------------------------------------------------

/** Initializes a fresh game state for a given board. */
export function createGameState(board: Board): GameState {
    return {
        board,
        rectangles: [],
        history: {
            past: [],
            future: []
        }
    };
}

/**
 * Places a rectangle onto the board.
 * Allows passing a PlacementPolicy to decide what to do if an overlap occurs.
 * Defaults to 'replace' which strips overlapping blocks and commits a single REPLACE transaction.
 */
export function placeRectangle(
    state: GameState,
    rectangle: PlacedRectangle,
    policy: PlacementPolicy = 'replace'
): GameState {
    const overlappingRects = getRectanglesOverlappingRectangle(state.rectangles, rectangle);

    if (overlappingRects.length > 0) {
        if (policy === 'reject') {
            return state; // Do nothing if rejection policy acts.
        }

        if (policy === 'replace') {
            const newRectangles = state.rectangles.filter(r => !doRectanglesOverlap(r, rectangle));
            const replaceAction: UserAction = { type: 'REPLACE', removed: overlappingRects, added: rectangle };

            return {
                ...state,
                rectangles: [...newRectangles, rectangle],
                history: {
                    past: [...state.history.past, replaceAction],
                    future: [] // Placing a new piece voids the redo history
                }
            };
        }
        // if 'allow', falls through to pure place
    }

    // 'allow' policy OR no overlaps
    const placeAction: UserAction = { type: 'PLACE', added: rectangle };
    return {
        ...state,
        rectangles: [...state.rectangles, rectangle],
        history: {
            past: [...state.history.past, placeAction],
            future: []
        }
    };
}

/** Removes a rectangle by its ID. */
export function removeRectangle(state: GameState, id: string): GameState {
    const target = state.rectangles.find(r => r.id === id);
    if (!target) return state; // Nothing to remove

    return {
        ...state,
        rectangles: state.rectangles.filter(r => r.id !== id),
        history: {
            past: [...state.history.past, { type: 'REMOVE', removed: target }],
            future: []
        }
    };
}

/** Pops the last move off the past stack and reverses its effect. */
export function undo(state: GameState): GameState {
    if (state.history.past.length === 0) return state;

    const newPast = [...state.history.past];
    const lastAction = newPast.pop()!;

    const newFuture = [...state.history.future, lastAction];
    let newRectangles = [...state.rectangles];

    if (lastAction.type === 'PLACE') {
        // Reverse a placement by removing it
        newRectangles = newRectangles.filter(r => r.id !== lastAction.added.id);
    } else if (lastAction.type === 'REMOVE') {
        // Reverse a removal by re-placing it
        newRectangles.push(lastAction.removed);
    } else if (lastAction.type === 'REPLACE') {
        // Reverse a replace by removing the new piece and bringing the old ones back
        newRectangles = newRectangles.filter(r => r.id !== lastAction.added.id);
        newRectangles.push(...lastAction.removed);
    }

    return {
        ...state,
        rectangles: newRectangles,
        history: { past: newPast, future: newFuture }
    };
}

/** Pops the last move off the future stack and re-applies its effect. */
export function redo(state: GameState): GameState {
    if (state.history.future.length === 0) return state;

    const newFuture = [...state.history.future];
    const nextAction = newFuture.pop()!;

    const newPast = [...state.history.past, nextAction];
    let newRectangles = [...state.rectangles];

    if (nextAction.type === 'PLACE') {
        newRectangles.push(nextAction.added);
    } else if (nextAction.type === 'REMOVE') {
        newRectangles = newRectangles.filter(r => r.id !== nextAction.removed.id);
    } else if (nextAction.type === 'REPLACE') {
        const removedIds = new Set(nextAction.removed.map(r => r.id));
        newRectangles = newRectangles.filter(r => !removedIds.has(r.id));
        newRectangles.push(nextAction.added);
    }

    return {
        ...state,
        rectangles: newRectangles,
        history: { past: newPast, future: newFuture }
    };
}

// -----------------------------------------------------
// 3. Serialization
// -----------------------------------------------------

export function serializeProgress(state: GameState): string {
    const snapshot: ProgressSnapshot = {
        board: state.board,
        rectangles: state.rectangles,
        past: state.history.past
    };
    return JSON.stringify(snapshot);
}

export function restoreProgress(serializedData: string): GameState {
    const parsed = JSON.parse(serializedData) as ProgressSnapshot;
    return {
        board: parsed.board,
        rectangles: parsed.rectangles,
        history: {
            past: parsed.past || [],
            future: [] // redo states are intentionally dropped across sessions
        }
    };
}
