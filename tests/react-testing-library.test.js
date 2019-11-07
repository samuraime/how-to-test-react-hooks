import React from 'react';
import { render, fireEvent, waitForElement } from '@testing-library/react';
import useCounter from '../useCounter';

function Counter() {
  const { count, increment } = useCounter();

  return (
    <button data-testid="button" onClick={increment}>{count}</button>
  );
}

it('should increment counter', () => {
  const { getByTestId } = render(<Counter />);

  const button = getByTestId('button');
  expect(button.textContent).toBe('0');

  fireEvent.click(button)
  expect(button.textContent).toBe('1');
});
