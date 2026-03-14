# Product Spec

## Product vision
Build a mobile-first Shikaku puzzle game that feels clean, fast, and fair on iOS and Android.

## MVP goals
- Let a player start and finish a Shikaku puzzle quickly
- Support multiple board sizes and difficulty tiers
- Save progress locally
- Provide hints, undo, redo, and puzzle validation feedback
- Work offline

## Target audience
- Casual puzzle players
- Users who enjoy logic games such as Sudoku, KenKen, and Picross
- Players looking for short, satisfying sessions

## Non-goals for MVP
- Multiplayer
- Social sharing
- Cloud sync
- Leaderboards
- In-app purchases

## Core user flow
1. Open app
2. Pick puzzle or difficulty
3. Solve puzzle by marking rectangles on the board
4. Get immediate feedback on invalid placements when enabled
5. Complete puzzle and view results

## Design constraints
- Portrait-first layout
- Touch interactions must work comfortably with one hand
- Puzzle logic must remain outside UI components
- State should be recoverable if the app is backgrounded

## Placement behavior

The default rectangle placement behavior is **replace**.

When a player places a rectangle that overlaps one or more existing rectangles:

1. The overlapping rectangles are removed
2. The new rectangle is added
3. The change is recorded as a single undoable action
4. Undo restores the previous rectangles
5. Redo reapplies the replacement

Other placement policies (`reject`, `allow`) exist for testing and experimentation, but MVP gameplay uses `replace`.