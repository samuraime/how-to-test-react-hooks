import React from 'react';
import { shallow } from 'enzyme';
import useCounter from '../useCounter';

it('should increment counter', () => {
  let count;
  let increment;

  function Counter() {
    ({ count, increment } = useCounter());

    return count;
  }

  shallow(<Counter />);
  expect(count).toBe(0);
  increment();
  expect(count).toBe(1);

  // const wrapper = shallow(<Counter />);
  // expect(wrapper.text()).toBe('0');
  // increment();
  // expect(wrapper.text()).toBe('0');
});
