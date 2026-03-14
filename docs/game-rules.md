# Game Rules

Shikaku is a rectangle partition puzzle.

## Basic rules
- The board is a rectangular grid.
- Some cells contain clue numbers.
- The player divides the entire grid into non-overlapping rectangles.
- Each rectangle must contain exactly one clue.
- The area of each rectangle must equal the clue number inside it.
- All cells must be covered.

## Interaction assumptions for MVP
- Players create or adjust rectangles using touch interactions.
- Overlapping placements are disallowed.
- The app can optionally highlight invalid rectangles.
- Completion is checked against the full board state.

## Difficulty levers
- Board size
- Shape ambiguity
- Density of clues
- Rectangle factor combinations
- Solver branching complexity
