import React from 'react';
import { shallow, act } from 'enzyme';
import useCounter from '../useCounter';

function TestHook({ hook, callback }) {
  callback(hook());
  return null;
}

function renderHook(hook) {
  let result = {
    current: null,
  };
  const callback = (hookReturns) => {
    result.current = hookReturns;
  };
  shallow(<TestHook hook={useCounter} callback={callback} />);

  return result;
}

it('should increment counter', () => {
  const result = renderHook(useCounter);

  expect(result.current.count).toBe(0);

  result.current.increment();

  expect(result.current.count).toBe(1);
});
