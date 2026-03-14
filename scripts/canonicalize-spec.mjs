import fs from 'node:fs';
import path from 'node:path';

const inputPath = path.resolve('spec/shikaku.rules.json');
const outputPath = path.resolve('spec/canonicalized.rules.json');

function sortDeep(value) {
  if (Array.isArray(value)) {
    return value.map(sortDeep);
  }
  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortDeep(value[key]);
        return acc;
      }, {});
  }
  return value;
}

const raw = fs.readFileSync(inputPath, 'utf8');
const parsed = JSON.parse(raw);
const canonical = sortDeep(parsed);
fs.writeFileSync(outputPath, `${JSON.stringify(canonical, null, 2)}\n`);
console.log(`Canonical spec written to ${outputPath}`);
