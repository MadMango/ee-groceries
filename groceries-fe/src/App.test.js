import { render, screen } from '@testing-library/react';
import App from './App';
import groceries from './fixtures/groceries.json';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
const server = setupServer(
  rest.get('http://localhost:5000/groceries', (req, res, ctx) => {
    return res(ctx.json(groceries));
  }),
);

// establish API mocking before all tests
beforeAll(() => server.listen());
// reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers());
// clean up once the tests are done
afterAll(() => server.close());

test('renders list wrapper and list items', async () => {
  render(<App />);
  const wrapper = screen.getByTestId('groceries-wrapper');
  expect(wrapper).toBeInTheDocument();
});
