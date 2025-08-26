# Tic Tac Toe – React (Modern Minimal)

A modern, minimalistic, and responsive Tic Tac Toe game built with React. Supports Human vs Human and Human vs Computer play, session-based score tracking, and a clean UI.

## Features
- Interactive 3x3 board with winner highlighting
- Play vs Human or AI
- Session-based score tracking (localStorage)
- Help/Instructions modal
- Responsive layout (mobile/desktop)
- Light/Dark theme toggle
- Primary/Secondary/Accent color theming

## Quick Start
- `npm install`
- `npm start` — open http://localhost:3000
- `npm test` — run tests
- `npm run build` — production build

## How to Play
- Select a mode (Human vs Human / Human vs Computer)
- Take turns placing X and O
- Three in a row wins; otherwise, a draw if the board fills
- Use “New Round” to start again or “Reset Scores” to clear session totals

## Theming
Primary colors are defined in `src/App.css` as CSS variables:
- `--primary: #3498db`
- `--secondary: #2ecc71`
- `--accent: #e74c3c`

A dark theme is available via the header toggle, implemented using the `data-theme` attribute with overridden variables.

## Project Structure
- `src/App.js` — UI and game logic
- `src/App.css` — Styles, layout, and theming
- `src/index.js` — Entry

No backend required.
