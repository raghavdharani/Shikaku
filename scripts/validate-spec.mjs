import fs from 'node:fs';
import path from 'node:path';

const schemaPath = path.resolve('spec/shikaku.schema.json');
const specPath = path.resolve('spec/shikaku.rules.json');

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));

function fail(message) {
  console.error(`Spec validation failed: ${message}`);
  process.exit(1);
}

for (const requiredKey of schema.required ?? []) {
  if (!(requiredKey in spec)) {
    fail(`Missing required top-level key: ${requiredKey}`);
  }
}

if (!Array.isArray(spec.game?.platforms) || spec.game.platforms.length === 0) {
  fail('game.platforms must be a non-empty array');
}

if (!Array.isArray(spec.board?.allowedSizes) || spec.board.allowedSizes.length === 0) {
  fail('board.allowedSizes must be a non-empty array');
}

if (!Array.isArray(spec.difficultyTiers) || spec.difficultyTiers.length === 0) {
  fail('difficultyTiers must be a non-empty array');
}

console.log('Spec validation passed');
