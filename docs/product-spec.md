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
3. Solve puzzle by dragging or tapping on the board to draw rectangles
4. Rectangles are placed upon lifting the finger (release-to-commit)
5. Tap-and-release on a single cell commits a 1x1 rectangle
6. Overlapping existing rectangles are replaced by the new placement
7. Tap "Submit Puzzle" to check for errors/solved status
8. Complete puzzle and view results

## Validation model
- **Submit-based validation:** The game does *not* validate continuously during play.
- The player places rectangles freely.
- The player must press "Submit Puzzle" to check their answer.
- If solved, the board locks and shows success.
- If incorrect, a message indicates errors, and the player can continue editing.

## Design constraints
- Portrait-first layout
- Touch interactions must work comfortably with one hand
- Puzzle logic must remain outside UI components
- State should be recoverable if the app is backgrounded

## Placement behavior

The default rectangle placement behavior is **atomic replace**.

When a player places a rectangle (via tap or drag) that overlaps one or more existing rectangles:

1. All overlapped rectangles are removed
2. The new rectangle is added
3. This occurs as a single atomic action in history
4. Undo restores all removed rectangles in one step
5. Redo reapplies the replacement in one step

Other placement policies (`reject`, `allow`) exist for testing and experimentation, but MVP gameplay uses `replace`.