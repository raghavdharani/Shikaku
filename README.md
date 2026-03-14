# Shikaku

A React Native Shikaku puzzle game with a spec-first workflow.

## Why this repo is structured this way

This repository separates:

- **human-readable product intent** in `docs/`
- **canonical machine-readable rules** in `spec/`
- **pure puzzle logic** in `packages/engine/`
- **mobile app code** in `apps/mobile/`
- **end-to-end test flows** in `e2e/`
- **automation** in `.github/workflows/`

That split makes AI-assisted development safer. The rules live outside the UI, so the puzzle engine can be validated independently and traced back to a canonical specification.

## Repository layout

```text
Shikaku/
  docs/
  spec/
  apps/mobile/
  packages/engine/
  packages/ui/
  packages/test-utils/
  e2e/maestro/
  scripts/
  .github/workflows/
```

## First workflow

1. Update the product spec in `docs/product-spec.md`
2. Update rules in `spec/shikaku.rules.json`
3. Regenerate canonical artifacts
4. Build or update engine logic in `packages/engine/`
5. Write tests before or alongside UI work
6. Add mobile UI in `apps/mobile/`
7. Add smoke flows in `e2e/maestro/`

## Scripts

- `npm run spec:canonicalize` normalizes the rules file
- `npm run spec:hash` generates a SHA-256 fingerprint for the canonical spec
- `npm run spec:sync` runs both
- `npm run validate:spec` validates the rules file against the schema
- `npm run test:engine` runs engine tests

## Notes

- The generated files `spec/canonicalized.rules.json` and `spec/spec-hash.txt` are excluded from Git by default so CI can regenerate and verify them.
- `apps/mobile/` is scaffolded as a placeholder. You can initialize Expo there once you are ready.
