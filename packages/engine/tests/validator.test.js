const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function validateSolvedBoard(board, rectangles) {
  const errors = [];
  const occupied = new Map();

  function cellsForRectangle(rectangle) {
    const cells = [];
    for (let y = rectangle.y; y < rectangle.y + rectangle.height; y += 1) {
      for (let x = rectangle.x; x < rectangle.x + rectangle.width; x += 1) {
        cells.push(`${x},${y}`);
      }
    }
    return cells;
  }

  rectangles.forEach((rectangle, index) => {
    const cells = cellsForRectangle(rectangle);
    for (const cell of cells) {
      const count = occupied.get(cell) ?? 0;
      occupied.set(cell, count + 1);
      if (count >= 1) {
        errors.push(`Overlap detected at ${cell}`);
      }
    }

    const containedClues = board.clues.filter(
      clue =>
        clue.x >= rectangle.x &&
        clue.x < rectangle.x + rectangle.width &&
        clue.y >= rectangle.y &&
        clue.y < rectangle.y + rectangle.height
    );

    if (containedClues.length !== 1) {
      errors.push(`Rectangle ${index} must contain exactly one clue`);
      return;
    }

    const area = rectangle.width * rectangle.height;
    if (containedClues[0].value !== area) {
      errors.push(`Rectangle ${index} area ${area} does not match clue ${containedClues[0].value}`);
    }
  });

  for (let y = 0; y < board.height; y += 1) {
    for (let x = 0; x < board.width; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) {
        errors.push(`Uncovered cell at ${key}`);
      }
    }
  }

  return {
    isSolved: errors.length === 0,
    errors
  };
}

function loadFixture(relativePath) {
  const filePath = path.resolve(__dirname, '..', '..', '..', 'spec', 'fixtures', relativePath);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

test('valid fixture solves cleanly', () => {
  const fixture = loadFixture(path.join('valid', 'minimal-2x2.json'));
  const result = validateSolvedBoard(fixture.board, fixture.rectangles);
  assert.equal(result.isSolved, true);
  assert.deepEqual(result.errors, []);
});

test('invalid fixture detects overlap', () => {
  const fixture = loadFixture(path.join('invalid', 'overlap-2x2.json'));
  const result = validateSolvedBoard(fixture.board, fixture.rectangles);
  assert.equal(result.isSolved, false);
  assert.ok(result.errors.some(error => error.includes('Overlap detected')));
});
