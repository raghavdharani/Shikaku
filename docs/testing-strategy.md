# Testing Strategy

## Goal
Use the spec as the source of truth while proving behavior with automated tests.

## Layers
1. **Spec validation**
   - Ensure `spec/shikaku.rules.json` matches `spec/shikaku.schema.json`
2. **Engine unit tests**
   - Validate puzzle rules in pure TypeScript
3. **Property-based tests**
   - Add later for generator and solver invariants
4. **Component tests**
   - Add in the mobile app once UI exists
5. **End-to-end flows**
   - Add Maestro scenarios for smoke coverage

## What the spec hash is for
- Stable fingerprint of the canonical rules file
- Useful for traceability and reproducibility
- Not a substitute for tests
