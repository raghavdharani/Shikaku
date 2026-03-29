import * as fs from 'fs';
import * as path from 'path';
import { solveBoard } from '../../packages/engine/src/solver';
import { Board, Clue, Rectangle } from '../../packages/engine/src/types';

interface RawPuzzle {
    id: string;
    size: [number, number];
    clues: [number, number, number][];
}

/**
 * Generates a valid Shikaku puzzle by partitioning a grid.
 */
function generatePuzzle(width: number, height: number, id: string): RawPuzzle {
    interface SubRect {
        x: number;
        y: number;
        w: number;
        h: number;
    }

    let rects: SubRect[] = [{ x: 0, y: 0, w: width, h: height }];

    // Target average area based on difficulty/size
    const targetAvgArea = Math.max(4, Math.floor((width * height) / (width < 8 ? 5 : 10)));
    const maxRects = Math.floor((width * height) / targetAvgArea);

    while (rects.length < maxRects) {
        // Pick a random rect to split
        const idx = Math.floor(Math.random() * rects.length);
        const r = rects[idx];

        let canSplitH = r.h >= 2;
        let canSplitW = r.w >= 2;

        if (!canSplitH && !canSplitW) continue;

        // Bias split direction
        let splitH = canSplitH;
        if (canSplitH && canSplitW) splitH = Math.random() > 0.5;

        if (splitH) {
            const splitAt = 1 + Math.floor(Math.random() * (r.h - 1));
            rects.splice(idx, 1,
                { x: r.x, y: r.y, w: r.w, h: splitAt },
                { x: r.x, y: r.y + splitAt, w: r.w, h: r.h - splitAt }
            );
        } else {
            const splitAt = 1 + Math.floor(Math.random() * (r.w - 1));
            rects.splice(idx, 1,
                { x: r.x, y: r.y, w: splitAt, h: r.h },
                { x: r.x + splitAt, y: r.y, w: r.w - splitAt, h: r.h }
            );
        }
    }

    const clues: [number, number, number][] = rects.map(r => {
        const cx = r.x + Math.floor(Math.random() * r.w);
        const cy = r.y + Math.floor(Math.random() * r.h);
        return [cx, cy, r.w * r.h];
    });

    return {
        id,
        size: [width, height],
        clues
    };
}

function convertToBoard(raw: RawPuzzle): Board {
    return {
        width: raw.size[0],
        height: raw.size[1],
        clues: raw.clues.map(c => ({ x: c[0], y: c[1], value: c[2] }))
    };
}

async function run() {
    const catalogDir = path.join(__dirname, '../data/catalog');
    if (!fs.existsSync(catalogDir)) fs.mkdirSync(catalogDir, { recursive: true });

    const configs = [
        { key: 'beginner', count: 30, minSize: 5, maxSize: 7 },
        { key: 'intermediate', count: 40, minSize: 8, maxSize: 10 },
        { key: 'expert', count: 50, minSize: 12, maxSize: 15 }
    ];

    for (const config of configs) {
        console.log(`Generating ${config.key} track...`);
        const puzzles: RawPuzzle[] = [];
        let generated = 0;

        while (puzzles.length < config.count) {
            const size = config.minSize + Math.floor(Math.random() * (config.maxSize - config.minSize + 1));
            // Ensure some variation in aspect ratio
            const w = size;
            const h = size + (Math.random() > 0.7 ? 1 : 0);

            const candidate = generatePuzzle(w, h, `${config.key.charAt(0)}${puzzles.length + 1}`);
            const board = convertToBoard(candidate);
            const result = solveBoard(board, 2);

            // We only keep unique puzzles
            if (result.solutions.length === 1) {
                puzzles.push(candidate);
                generated++;
                if (generated % 10 === 0) console.log(`  Produced ${generated}/${config.count}...`);
            }
        }

        fs.writeFileSync(
            path.join(catalogDir, `${config.key}.json`),
            JSON.stringify(puzzles, null, 2)
        );
    }

    console.log('\n✨ Catalog generation complete!');
}

run().catch(console.error);
