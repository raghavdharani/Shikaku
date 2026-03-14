import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const canonicalPath = path.resolve('spec/canonicalized.rules.json');
const hashPath = path.resolve('spec/spec-hash.txt');

if (!fs.existsSync(canonicalPath)) {
  throw new Error('Canonical spec not found. Run spec:canonicalize first.');
}

const content = fs.readFileSync(canonicalPath);
const digest = crypto.createHash('sha256').update(content).digest('hex');
fs.writeFileSync(hashPath, `${digest}\n`);
console.log(`Spec hash written to ${hashPath}`);
