# BLOCK MASTER

A mobile-first block puzzle game built with HTML, CSS and vanilla JavaScript.

## Run locally
Open `index.html` in a browser. For PWA/service-worker testing, serve the folder through a local static HTTP server or GitHub Pages (service workers do not run on `file://`).

## Gameplay
- 10×10 board.
- Three pieces per set.
- Drag pieces onto the board using touch or mouse.
- Complete rows and columns to clear them.
- +5 points per placed block.
- Line-clear bonuses and a reward at game over.
- Best score and settings are stored in LocalStorage.

## Project structure
- `js/board.js`: board rules and line clearing.
- `js/pieces.js`: piece library and generation.
- `js/drag-drop.js`: pointer-based drag and drop.
- `js/scoring.js`: points.
- `js/rewards.js`: end-of-round reward.
- `js/storage.js`: persistent data.
- `js/game.js`: game state and rendering.

## Notes
The reward is stored as a separate local coin balance; no shop or coin counter is currently included in the interface. Audio cues are synthesized with Web Audio and are intentionally simple. The Music setting is stored but no background music track is bundled.
