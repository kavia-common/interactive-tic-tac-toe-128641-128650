import { render, screen } from '@testing-library/react';
import App from './App';

test('renders title and status', () => {
  render(<App />);
  expect(screen.getByText(/Tic Tac Toe/i)).toBeInTheDocument();
  expect(screen.getByText(/Next player:/i)).toBeInTheDocument();
});
