import React from 'react';
import { shallow } from 'enzyme';
import useCounter from '../useCounter';

function Counter() {
  const { count, increment } = useCounter();

  return (
    <button onClick={increment}>{count}</button>
  );
}

it('should increment counter', () => {
  const wrapper = shallow(<Counter />);
  expect(wrapper.find('button').text()).toBe('0');

  wrapper.find('button').simulate('click');
  expect(wrapper.find('button').text()).toBe('1');
});
