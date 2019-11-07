import React from 'react';
import { shallow } from 'enzyme';
import useCounter from '../useCounter';

function TestHook({ hook, callback }) {
  callback(hook());
  return null;
}

it('should increment counter', () => {
  let result;

  const callback = (hookReturns) => {
    result = hookReturns;
  };

  shallow(<TestHook hook={useCounter} callback={callback} />);

  expect(result.count).toBe(0);

  result.increment();

  expect(result.count).toBe(1);
});
