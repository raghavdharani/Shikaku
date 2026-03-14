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
