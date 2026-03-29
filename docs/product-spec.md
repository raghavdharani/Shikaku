# Product Spec

## Product vision
Build a mobile-first Shikaku puzzle game that feels clean, fast, and fair on iOS and Android.

## MVP goals
- Let a player start and finish a Shikaku puzzle quickly
- Support sequential difficulty tracks (Beginner, Intermediate, Expert)
- Move users through a pre-built, validated puzzle sequence
- Save progression and difficulty state locally
- Provide clear visual feedback on board state and errors
- Work offline

## Target audience
- Casual puzzle players
- Users who enjoy logic games such as Sudoku, KenKen, and Picross
- Players looking for short, satisfying sessions

## Non-goals for MVP
- Random puzzle generation at runtime
- Multiplayer / Social features
- Cloud sync / Leaderboards
- In-app purchases

## Core user flow
1. **Open app**: Land on Home Screen showing current track progress.
2. **Select Difficulty**: Choose from Beginner, Intermediate, or Expert tracks.
3. **Puzzle Journey**: Start or Resume the sequential puzzle sequence for that track.
4. **Solve board**: Drag or tap to draw rectangles.
5. **Release-to-commit**: Rectangles are placed upon lifting the finger.
6. **Atomic replace**: New rectangles automatically replace any overlapping existing ones.
7. **Submit check**: Tap "Check Solution" to validate the board.
8. **Progression**: After solving, immediately move to the next puzzle in the sequence.

## Progression Model
- **Guided Tracks**: Puzzles are served from a static, pre-validated catalog of ~120 puzzles.
- **Persistence**: User's current index and difficulty are saved. 
- **Victory States**: Meaningful celebration upon solving and completion of a track.

## Validation model
- **Submit-based validation**: The game does *not* validate continuously during play.
- The player places rectangles freely.
- The player must press "Check Solution" to check their answer.
- If solved, the board locks, celebration animations play, and "Next Puzzle" appears.
- If incorrect, a message indicates errors (e.g., overlaps), and the player continues editing.

## Design constraints
- Portrait-first layout
- Glassmorphism and modern Slate/Indigo palette
- Immersive gameplay: Bottom tabs are hidden during puzzle solving.
- Performance: Logic must remain in `@shikaku/engine`.

## Interaction Logic
- **Single Action Modification**: Rectangles are modified only via new placements.
- **No Undo/Redo**: Intentional design decision to keep interaction simple and high-stakes.
- **Overwriting**: Overlapping existing rectangles is the primary way to "delete" or "adjust" paths.