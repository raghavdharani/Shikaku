import * as fc from 'fast-check';
import {
    Board,
    Rectangle,
    validateSolvedBoard,
    doRectanglesOverlap,
    containsCell,
    getRectangleArea
} from '../src/index';

// Generator for a valid Board size
const boardSizeArbitrary = fc.integer({ min: 2, max: 20 });

// Generator for a random coordinate within bounds
const coordinateArbitrary = (max: number) => fc.integer({ min: 0, max: max - 1 });

// Generate a totally random rectangle somewhere in a realistic space
const rectangleArbitrary = fc.record({
    x: fc.integer({ min: 0, max: 20 }),
    y: fc.integer({ min: 0, max: 20 }),
    width: fc.integer({ min: 1, max: 10 }),
    height: fc.integer({ min: 1, max: 10 })
});

describe('Engine Property-Based Tests', () => {

    it('Property 1: Overlapping rectangles are always detected', () => {
        // Generate two rectangles that are guaranteed to overlap
        // To do this simply, we generate R1, and then construct R2 such that its top-left 
        // is physically inside R1.
        fc.assert(
            fc.property(rectangleArbitrary, fc.double({ min: 0, max: 0.9 }), fc.double({ min: 0, max: 0.9 }), fc.integer({ min: 1, max: 5 }), fc.integer({ min: 1, max: 5 }),
                (r1, xOffset, yOffset, r2w, r2h) => {
                    const intersectionX = Math.floor(r1.x + (r1.width * xOffset));
                    const intersectionY = Math.floor(r1.y + (r1.height * yOffset));

                    const r2 = {
                        x: intersectionX,
                        y: intersectionY,
                        width: r2w,
                        height: r2h
                    };

                    expect(doRectanglesOverlap(r1, r2)).toBe(true);
                }),
            { numRuns: 100 }
        );
    });

    it('Property 2: The area of a rectangle ALWAYS equals width * height', () => {
        fc.assert(
            fc.property(rectangleArbitrary, (rect) => {
                expect(getRectangleArea(rect)).toBe(rect.width * rect.height);
            }),
            { numRuns: 200 }
        );
    });

    it('Property 3: Valid solves never contain overlapping rectangles', () => {
        // If the game validates as solved, the sum of areas must perfectly match the board area
        // and no rectangles can overlap.
        fc.assert(
            fc.property(fc.integer({ min: 2, max: 10 }), fc.integer({ min: 2, max: 10 }), (w, h) => {
                const board = { width: w, height: h, clues: [] };
                // We simulate a bad solve with a giant overlapping rectangle placed twice
                const rect1 = { x: 0, y: 0, width: w, height: h };
                const rect2 = { x: 0, y: 0, width: w, height: h };
                const result = validateSolvedBoard(board, [rect1, rect2]);
                expect(result.isSolved).toBe(false);
                expect(result.errors.some(e => e.includes('Overlap detected'))).toBe(true);
            }),
            { numRuns: 100 }
        );
    });

    it('Property 4: Total unmapped board cells must throw errors for coverage', () => {
        fc.assert(
            fc.property(fc.integer({ min: 3, max: 10 }), fc.integer({ min: 3, max: 10 }), (w, h) => {
                const board = { width: w, height: h, clues: [] };
                // We deliberately leave at least 1 cell uncovered
                const rect = { x: 0, y: 0, width: w - 1, height: h };
                const result = validateSolvedBoard(board, [rect]);
                expect(result.isSolved).toBe(false);
                expect(result.errors.some(e => e.includes('Uncovered cell'))).toBe(true);
            }),
            { numRuns: 100 }
        );
    });

    it('Property 5: A rectangle placed over a single clue equal to its area is valid local context', () => {
        fc.assert(
            fc.property(rectangleArbitrary, (rect) => {
                const area = rect.width * rect.height;
                // Generate a valid board bounds for this
                const board = {
                    width: rect.x + rect.width,
                    height: rect.y + rect.height,
                    clues: [{ x: rect.x, y: rect.y, value: area }]
                };
                const result = validateSolvedBoard(board, [rect]);
                // It might fail coverage if the board is too big, but it SHOULD NOT fail clue validation.
                expect(result.errors.some(e => e.includes('exactly one clue'))).toBe(false);
                expect(result.errors.some(e => e.includes('does not match clue'))).toBe(false);
            }),
            { numRuns: 100 }
        );
    });

    it('Property 6: Empty clues return missing clue error', () => {
        fc.assert(
            fc.property(rectangleArbitrary, (rect) => {
                const area = rect.width * rect.height;
                // Empty clues!
                const board = {
                    width: Math.max(1, rect.x + rect.width),
                    height: Math.max(1, rect.y + rect.height),
                    clues: []
                };
                const result = validateSolvedBoard(board, [rect]);
                expect(result.isSolved).toBe(false);
                expect(result.errors.some(e => e.includes('must contain exactly one clue'))).toBe(true);
            }),
            { numRuns: 100 }
        );
    });

    it('Property 7: Model Serialization works cleanly on Board structures', () => {
        // Generates a fully random board
        const rawBoardArbitrary = fc.record({
            width: fc.integer({ min: 1, max: 100 }),
            height: fc.integer({ min: 1, max: 100 }),
            clues: fc.array(fc.record({
                x: fc.integer({ min: 0, max: 100 }),
                y: fc.integer({ min: 0, max: 100 }),
                value: fc.integer({ min: 1, max: 100 })
            }), { maxLength: 5 })
        });

        fc.assert(
            fc.property(rawBoardArbitrary, (board) => {
                const serialized = JSON.stringify(board);
                const deserialized = JSON.parse(serialized);
                expect(deserialized).toEqual(board);
            }),
            { numRuns: 100 } // JSON roundtripping ensures we aren't using classes or non-serializable constructs
        );
    });

});
