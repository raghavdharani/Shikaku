import * as path from 'path';
import * as fs from 'fs';
import { validateSolvedBoard } from '../src/index';

function loadFixture(relativePath: string) {
    const filePath = path.resolve(__dirname, '..', '..', '..', 'spec', 'fixtures', relativePath);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

describe('validateSolvedBoard', () => {
    it('solves valid fixture cleanly', () => {
        const fixture = loadFixture(path.join('valid', 'minimal-2x2.json'));
        const result = validateSolvedBoard(fixture.board, fixture.rectangles);
        expect(result.isSolved).toBe(true);
        expect(result.errors).toEqual([]);
    });

    it('detects overlap', () => {
        const fixture = loadFixture(path.join('invalid', 'overlap-2x2.json'));
        const result = validateSolvedBoard(fixture.board, fixture.rectangles);
        expect(result.isSolved).toBe(false);
        expect(result.errors.some(e => e.includes('Overlap detected'))).toBe(true);
    });

    it('detects fully out of bounds', () => {
        const fixture = loadFixture(path.join('valid', 'minimal-2x2.json'));
        const result = validateSolvedBoard(fixture.board, [
            { x: -1, y: 0, width: 2, height: 1 },
            { x: 0, y: 1, width: 2, height: 1 }
        ]);
        expect(result.isSolved).toBe(false);
        expect(result.errors.some(e => e.includes('out of bounds'))).toBe(true);
    });

    it('detects partially out of bounds', () => {
        const fixture = loadFixture(path.join('valid', 'minimal-2x2.json'));
        // placing width 3 on a 2x2 board -> extends to x=3 (out of bounds)
        const result = validateSolvedBoard(fixture.board, [
            { x: 0, y: 0, width: 3, height: 1 },
            { x: 0, y: 1, width: 2, height: 1 }
        ]);
        expect(result.isSolved).toBe(false);
        expect(result.errors.some(e => e.includes('out of bounds'))).toBe(true);
    });

    it('detects missing clues or extra clues', () => {
        const fixture = loadFixture(path.join('valid', 'minimal-2x2.json'));
        const result = validateSolvedBoard(fixture.board, [
            { x: 0, y: 0, width: 2, height: 2 } // covers 2 clues
        ]);
        expect(result.isSolved).toBe(false);
        expect(result.errors.some(e => e.includes('must contain exactly one clue'))).toBe(true);
    });

    it('detects uncovered cell', () => {
        const fixture = loadFixture(path.join('valid', 'minimal-2x2.json'));
        const result = validateSolvedBoard(fixture.board, [
            { x: 0, y: 0, width: 2, height: 1 },
            { x: 0, y: 1, width: 1, height: 1 } // cell 1,1 uncovered
        ]);
        expect(result.isSolved).toBe(false);
        expect(result.errors.some(e => e.includes('Uncovered cell at 1,1'))).toBe(true);
    });

    it('detects invalid zero/negative dimensions', () => {
        const fixture = loadFixture(path.join('valid', 'minimal-2x2.json'));
        const result = validateSolvedBoard(fixture.board, [
            { x: 0, y: 0, width: 0, height: 2 },
            { x: 0, y: 1, width: 2, height: -1 }
        ]);
        expect(result.isSolved).toBe(false);
        expect(result.errors.some(e => e.includes('invalid dimensions'))).toBe(true);
    });
});
