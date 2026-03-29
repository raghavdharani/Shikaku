import { levels } from '../data/levels';
import { mapRawPuzzleToBoard } from '../data/puzzles/mapper';
import { solveBoard } from '@shikaku/engine';

async function validateAllPuzzles() {
    console.log('🔍 Starting Shikaku Puzzle Validation...\n');

    let totalPuzzles = 0;
    let validPuzzles = 0;
    let brokenPuzzles = 0;

    for (const level of levels) {
        console.log(`📂 Level: ${level.name} (${level.id})`);

        for (const rawPuzzle of level.puzzles) {
            totalPuzzles++;
            const board = mapRawPuzzleToBoard(rawPuzzle);
            const result = solveBoard(board, 2); // Find up to 2 solutions to check uniqueness

            const [width, height] = rawPuzzle.size;
            const sizeStr = `${width}x${height}`;
            const boardArea = width * height;

            let status = '✅ VALID';
            let reason = '';

            if (result.clueSum !== boardArea) {
                status = '❌ BROKEN';
                reason = `Area Mismatch: Clue sum is ${result.clueSum}, but board area is ${boardArea}.`;
            } else if (result.solutions.length === 0) {
                status = '❌ BROKEN';
                reason = 'Unsolvable: No valid Shikaku rectangle configuration found.';
            } else if (result.solutions.length > 1) {
                status = '⚠️  NON-UNIQUE';
                reason = 'Multiple solutions found. Puzzles should ideally have exactly one solution.';
            }

            if (status.startsWith('❌')) {
                brokenPuzzles++;
            } else {
                validPuzzles++;
            }

            console.log(`  [${rawPuzzle.id}] ${sizeStr} - Sum: ${result.clueSum} / Area: ${boardArea} -> ${status}`);
            if (reason) {
                console.log(`      ↳ ${reason}`);
            }
        }
        console.log('');
    }

    console.log('📊 Validation Summary');
    console.log(`   Total:   ${totalPuzzles}`);
    console.log(`   Valid:   ${validPuzzles}`);
    console.log(`   Broken:  ${brokenPuzzles}`);

    if (brokenPuzzles > 0) {
        console.log('\n❌ Validation failed. Please fix the broken puzzles listed above.');
        process.exit(1);
    } else {
        console.log('\n✨ All puzzles passed validation!');
    }
}

validateAllPuzzles().catch(err => {
    console.error('Fatal Validation Error:', err);
    process.exit(1);
});
