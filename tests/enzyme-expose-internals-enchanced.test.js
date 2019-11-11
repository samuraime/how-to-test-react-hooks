import React from 'react';
import { shallow } from 'enzyme';
import useCounter from '../useCounter';

function renderHook(hook) {
  let result = { current: null };

  function Counter() {
    const currentResult = hook();

    result.current = currentResult;

    return null;
  }

  shallow(<Counter />);

  return result;
};

it('should increment counter', () => {
  const result = renderHook(useCounter);
  
  expect(result.current.count).toBe(0);

  result.current.increment();

  expect(result.current.count).toBe(1);
});
