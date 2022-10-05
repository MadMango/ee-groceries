import { render, screen } from '@testing-library/react';
import App from './App';

test('renders dummy page', () => {
  render(<App />);
  const intro = screen.getByText(/this is about to become/i);
  expect(intro).toBeInTheDocument();
});
