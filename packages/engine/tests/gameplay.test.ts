import {
    Board,
    doRectanglesOverlap,
    createGameState,
    placeRectangle,
    removeRectangle,
    undo,
    redo,
    serializeProgress,
    restoreProgress,
    PlacedRectangle
} from '../src/index';

describe('Gameplay State Engine (Transactional)', () => {
    const mockBoard: Board = { width: 5, height: 5, clues: [] };

    it('Initializes correctly', () => {
        const state = createGameState(mockBoard);
        expect(state.rectangles).toEqual([]);
        expect(state.history.past).toEqual([]);
        expect(state.history.future).toEqual([]);
    });

    it('Places a valid rectangle cleanly (1 step = 1 undo)', () => {
        let state = createGameState(mockBoard);
        const rect: PlacedRectangle = { id: '1', x: 0, y: 0, width: 2, height: 2 };

        state = placeRectangle(state, rect);
        expect(state.rectangles).toHaveLength(1);
        expect(state.rectangles[0].id).toBe('1');

        // Ensure atomic history tracking
        expect(state.history.past).toHaveLength(1);
        expect(state.history.past[0].type).toBe('PLACE');
    });

    it('Replacing multiple overlapping rectangles creates a single transaction by default', () => {
        let state = createGameState(mockBoard);
        const r1: PlacedRectangle = { id: '1', x: 0, y: 0, width: 2, height: 2 };
        const r2: PlacedRectangle = { id: '2', x: 2, y: 2, width: 2, height: 2 };
        const rMulti: PlacedRectangle = { id: 'over', x: 1, y: 1, width: 2, height: 2 }; // overlaps both r1 and r2!

        state = placeRectangle(state, r1);
        state = placeRectangle(state, r2);

        // This placement overlaps TWO existing rectangles because of the dimensions
        state = placeRectangle(state, rMulti);

        // r1, r2 are destroyed, rMulti replaces it
        expect(state.rectangles).toHaveLength(1);
        expect(state.rectangles[0].id).toBe('over');

        // History: PLACE 1, PLACE 2, REPLACE (removes 1 and 2, adds over) -> Single Undo Phase!
        expect(state.history.past).toHaveLength(3);
        const replaceAction = state.history.past[2];
        expect(replaceAction.type).toBe('REPLACE');
        if (replaceAction.type === 'REPLACE') {
            expect(replaceAction.removed).toHaveLength(2); // Verify BOTH were batched!
        }

        // Validate atomic undoing
        state = undo(state);
        expect(state.rectangles).toHaveLength(2);
        const activeIds = state.rectangles.map(r => r.id);
        expect(activeIds).toContain('1');
        expect(activeIds).toContain('2');

        // Validate atomic redoing
        state = redo(state);
        expect(state.rectangles).toHaveLength(1);
        expect(state.rectangles[0].id).toBe('over'); // Erased perfectly again!
    });

    it('Rejecting overlapping rectangles creates no history events', () => {
        let state = createGameState(mockBoard);
        const r1: PlacedRectangle = { id: '1', x: 0, y: 0, width: 2, height: 2 };
        const r2: PlacedRectangle = { id: '2', x: 1, y: 1, width: 2, height: 2 };

        state = placeRectangle(state, r1);

        // This fails intentionally since reject is selected
        state = placeRectangle(state, r2, 'reject');

        expect(state.rectangles).toHaveLength(1);
        expect(state.rectangles[0].id).toBe('1');
        expect(state.history.past).toHaveLength(1);
    });

    it('Allowing overlapping rectangles creates a single additive PLACE without history replacements', () => {
        let state = createGameState(mockBoard);
        const r1: PlacedRectangle = { id: '1', x: 0, y: 0, width: 2, height: 2 };
        const r2: PlacedRectangle = { id: '2', x: 1, y: 1, width: 2, height: 2 };

        state = placeRectangle(state, r1);

        // Allow overlapping
        state = placeRectangle(state, r2, 'allow');

        expect(state.rectangles).toHaveLength(2);
        const activeIds = state.rectangles.map(r => r.id);
        expect(activeIds).toContain('1');
        expect(activeIds).toContain('2');

        // Check history
        expect(state.history.past).toHaveLength(2);
        expect(state.history.past[1].type).toBe('PLACE');
        if (state.history.past[1].type === 'PLACE') {
            expect(state.history.past[1].added.id).toBe('2');
        }

        // Undo removes ONLY the newly added rectangle
        state = undo(state);
        expect(state.rectangles).toHaveLength(1);
        expect(state.rectangles[0].id).toBe('1');

        // Redo restores ONLY the newly added rectangle
        state = redo(state);
        expect(state.rectangles).toHaveLength(2);
        const finalActiveIds = state.rectangles.map(r => r.id);
        expect(finalActiveIds).toContain('1');
        expect(finalActiveIds).toContain('2');
    });

    it('Removes a non-overlapping rectangle manually', () => {
        let state = createGameState(mockBoard);
        const rect: PlacedRectangle = { id: 'v1', x: 0, y: 0, width: 2, height: 2 };

        state = placeRectangle(state, rect);
        state = removeRectangle(state, 'v1');

        expect(state.rectangles).toHaveLength(0);
        expect(state.history.past[1].type).toBe('REMOVE');
    });

    it('Progress serialization and restoration preserves state', () => {
        let state = createGameState(mockBoard);
        const r1: PlacedRectangle = { id: 'rA', x: 0, y: 0, width: 2, height: 2 };
        state = placeRectangle(state, r1);

        const serialized = serializeProgress(state);
        expect(typeof serialized).toBe('string');

        const restored = restoreProgress(serialized);
        expect(restored.board).toEqual(mockBoard);
        expect(restored.rectangles).toHaveLength(1);
        expect(restored.rectangles[0].id).toBe('rA');
        expect(restored.history.past).toHaveLength(1);
        expect(restored.history.future).toHaveLength(0);
    });
});
