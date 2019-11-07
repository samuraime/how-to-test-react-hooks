import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import useCounter from '../useCounter';

function Counter() {
  const { count, increment } = useCounter();

  return (
    <button onClick={increment}>{count}</button>
  );
}

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('should increment counter', () => {
  // Test first render and effect
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  expect(button.textContent).toBe('0');

  // Test second render and effect
  act(() => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  expect(button.textContent).toBe('1');
});
