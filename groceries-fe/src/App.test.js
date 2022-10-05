import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

// mock API calls later with: https://testing-library.com/docs/react-testing-library/example-intro/#mock

const clickById = (container, id) => fireEvent(
  // eslint-disable-next-line testing-library/no-node-access
  container.getElementById(id),
  new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  }),
);

test('renders list wrapper', () => {
  render(<App />);
  const wrapper = screen.getByTestId('groceries-wrapper');
  expect(wrapper).toBeInTheDocument();
});

test('reorders list items', () => {
  render(<App />);
  const listItems = screen.getAllByTestId('list-item');
  expect(listItems.length).toBe('6');
  expect(listItems[0].textContent).toBe('Apples 🍏');
  expect(listItems[1].textContent).toBe('Blueberries 🫐');
  expect(listItems[2].textContent).toBe('Kiwi 🥝');
  expect(listItems[3].textContent).toBe('Pineapple 🍍');
  expect(listItems[4].textContent).toBe('Mango 🥭');
  expect(listItems[5].textContent).toBe('Watermelon 🍉');
});

test('changes the order of the list', () => {
  const { container } = render(<App />);
  const listItems = screen.getAllByTestId('list-item');
  expect(listItems.length).toBe('6');
  expect(listItems[0].textContent).toBe('Apples 🍏');
  expect(listItems[1].textContent).toBe('Blueberries 🫐');
  expect(listItems[2].textContent).toBe('Kiwi 🥝');
  expect(listItems[3].textContent).toBe('Pineapple 🍍');
  expect(listItems[4].textContent).toBe('Mango 🥭');
  expect(listItems[5].textContent).toBe('Watermelon 🍉');

  clickById(container, 'Apples 🍏MoveDown');


  clickById(container, 'Kiwi 🥝MoveUp');
  clickById(container, 'Kiwi 🥝MoveUp');

  expect(listItems[2].textContent).toBe('Kiwi 🥝');
  expect(listItems[0].textContent).toBe('Blueberries 🫐');
  expect(listItems[1].textContent).toBe('Apples 🍏');
  expect(listItems[3].textContent).toBe('Pineapple 🍍');
  expect(listItems[4].textContent).toBe('Mango 🥭');
  expect(listItems[5].textContent).toBe('Watermelon 🍉');
});

test('does not change the order if items are already at the start or the end', () => {
  const { container } = render(<App />);
  const listItems = screen.getAllByTestId('list-item');
  expect(listItems.length).toBe('6');
  expect(listItems[0].textContent).toBe('Apples 🍏');
  expect(listItems[1].textContent).toBe('Blueberries 🫐');
  expect(listItems[2].textContent).toBe('Kiwi 🥝');
  expect(listItems[3].textContent).toBe('Pineapple 🍍');
  expect(listItems[4].textContent).toBe('Mango 🥭');
  expect(listItems[5].textContent).toBe('Watermelon 🍉');

  clickById(container, 'Apples 🍏MoveUp');
  clickById(container, 'Watermelon 🍉MoveDown');

  expect(listItems[0].textContent).toBe('Apples 🍏');
  expect(listItems[1].textContent).toBe('Blueberries 🫐');
  expect(listItems[2].textContent).toBe('Kiwi 🥝');
  expect(listItems[3].textContent).toBe('Pineapple 🍍');
  expect(listItems[4].textContent).toBe('Mango 🥭');
  expect(listItems[5].textContent).toBe('Watermelon 🍉');
});
