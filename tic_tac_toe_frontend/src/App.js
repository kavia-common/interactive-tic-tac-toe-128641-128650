import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

/**
 * Colors from requirements:
 * primary: #3498db (blue)
 * secondary: #2ecc71 (green)
 * accent: #e74c3c (red)
 *
 * This component renders a complete, responsive Tic Tac Toe game with:
 * - Human vs Human and Human vs Computer
 * - Session-based score tracking (localStorage)
 * - Instructions/help modal
 * - Modern, minimal UI with theming via CSS variables
 */

// Helper: all winning lines
const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// PUBLIC_INTERFACE
export function calculateWinner(squares) {
  /** Determine winner and winning line for highlighting. */
  for (const [a, b, c] of WIN_LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

function getEmptyIndices(board) {
  return board.map((v, i) => (v ? null : i)).filter((v) => v !== null);
}

// PUBLIC_INTERFACE
export function computeAiMove(board, aiPlayer = 'O', humanPlayer = 'X') {
  /**
   * Basic AI:
   * 1. Take winning move if available.
   * 2. Block opponent winning move.
   * 3. Take center if open.
   * 4. Take a corner if open.
   * 5. Otherwise take any available side.
   */
  const empties = getEmptyIndices(board);
  if (empties.length === 0) return null;

  // 1. Win if possible
  for (const idx of empties) {
    const next = [...board];
    next[idx] = aiPlayer;
    if (calculateWinner(next).winner === aiPlayer) return idx;
  }

  // 2. Block human winning move
  for (const idx of empties) {
    const next = [...board];
    next[idx] = humanPlayer;
    if (calculateWinner(next).winner === humanPlayer) return idx;
  }

  // 3. Take center
  if (board[4] == null) return 4;

  // 4. Take a corner
  const corners = [0, 2, 6, 8].filter((i) => board[i] == null);
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];

  // 5. Take any side
  const sides = [1, 3, 5, 7].filter((i) => board[i] == null);
  if (sides.length) return sides[Math.floor(Math.random() * sides.length)];

  return empties[0];
}

// PUBLIC_INTERFACE
export default function App() {
  /** Root application with theme control and layout container. */
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    /** Toggle between light and dark data-theme. */
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="app-shell">
      <header className="ttt-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden>◻</span>
          <h1 className="title">Tic Tac Toe</h1>
        </div>
        <div className="header-actions">
          <ThemePreview />
          <button className="btn ghost" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </header>

      <main className="container">
        <Game />
      </main>

      <footer className="ttt-footer">
        <span>Built with React • Minimal UI</span>
      </footer>
    </div>
  );
}

function ThemePreview() {
  return (
    <div className="theme-chip" title="App theme colors">
      <span className="swatch primary" />
      <span className="swatch secondary" />
      <span className="swatch accent" />
    </div>
  );
}

function Game() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [mode, setMode] = useState('human'); // 'human' | 'ai'
  const [scores, setScores] = useState(() => {
    const saved = window.localStorage.getItem('ttt-scores');
    return saved ? JSON.parse(saved) : { X: 0, O: 0, draws: 0 };
  });
  const [showHelp, setShowHelp] = useState(false);

  const { winner, line } = useMemo(() => calculateWinner(board), [board]);
  const isBoardFull = board.every((s) => s != null);
  const finished = Boolean(winner) || isBoardFull;

  // persist scores
  useEffect(() => {
    window.localStorage.setItem('ttt-scores', JSON.stringify(scores));
  }, [scores]);

  // Handle AI move when it's O's turn and mode is ai
  useEffect(() => {
    if (!finished && mode === 'ai' && !xIsNext) {
      const timer = setTimeout(() => {
        const idx = computeAiMove(board, 'O', 'X');
        if (idx != null) {
          onPlay(idx);
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [board, mode, xIsNext, finished]);

  useEffect(() => {
    // update scores at end
    if (finished) {
      if (winner === 'X') setScores((s) => ({ ...s, X: s.X + 1 }));
      else if (winner === 'O') setScores((s) => ({ ...s, O: s.O + 1 }));
      else if (!winner && isBoardFull) setScores((s) => ({ ...s, draws: s.draws + 1 }));
    }
  }, [finished, winner, isBoardFull]);

  const statusText = (() => {
    if (winner) return `Winner: ${winner}`;
    if (isBoardFull) return "It's a draw!";
    return `Next player: ${xIsNext ? 'X' : 'O'}`;
  })();

  function onPlay(index) {
    if (finished || board[index]) return;
    const next = [...board];
    next[index] = xIsNext ? 'X' : 'O';
    setBoard(next);
    setXIsNext(!xIsNext);
  }

  function resetBoard() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }

  function resetScores() {
    setScores({ X: 0, O: 0, draws: 0 });
  }

  function changeMode(newMode) {
    setMode(newMode);
    resetBoard();
  }

  return (
    <>
      <section className="panel">
        <div className="row between">
          <div className="mode-toggle" role="group" aria-label="Game mode">
            <button
              className={`btn small ${mode === 'human' ? 'active' : ''}`}
              onClick={() => changeMode('human')}
            >
              Human vs Human
            </button>
            <button
              className={`btn small ${mode === 'ai' ? 'active' : ''}`}
              onClick={() => changeMode('ai')}
            >
              Human vs Computer
            </button>
          </div>

          <div className="scores" aria-live="polite">
            <span className="pill">
              X: <strong>{scores.X}</strong>
            </span>
            <span className="pill">
              O: <strong>{scores.O}</strong>
            </span>
            <span className="pill">
              Draws: <strong>{scores.draws}</strong>
            </span>
          </div>
        </div>

        <div className="status">{statusText}</div>
      </section>

      <Board squares={board} onSquareClick={onPlay} winningLine={line} />

      <section className="controls">
        <button className="btn primary" onClick={resetBoard}>New Round</button>
        <button className="btn accent" onClick={resetScores}>Reset Scores</button>
        <button className="btn secondary" onClick={() => setShowHelp(true)}>Help / Instructions</button>
      </section>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </>
  );
}

function Board({ squares, onSquareClick, winningLine }) {
  return (
    <div className="board" role="grid" aria-label="Tic Tac Toe board">
      {squares.map((value, idx) => {
        const isWinning = winningLine?.includes(idx);
        return (
          <Square
            key={idx}
            value={value}
            onClick={() => onSquareClick(idx)}
            highlight={isWinning}
            aria-label={`Square ${idx + 1}: ${value ? value : 'empty'}`}
          />
        );
      })}
    </div>
  );
}

function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`square ${highlight ? 'win' : ''}`}
      onClick={onClick}
      role="gridcell"
    >
      {value}
    </button>
  );
}

function HelpModal({ onClose }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Instructions">
      <div className="modal">
        <h2>How to Play</h2>
        <ul className="instructions">
          <li>Choose a mode: play against another human or the computer.</li>
          <li>Players take turns placing X and O on the 3x3 grid.</li>
          <li>The first to align three in a row (horizontally, vertically, or diagonally) wins.</li>
          <li>If all squares are filled without a winner, it's a draw.</li>
          <li>Use "New Round" to start a new game or "Reset Scores" to clear session totals.</li>
        </ul>
        <button className="btn primary" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
