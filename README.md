# How to test react hooks? (How to test components that use Hooks?)

## TLDR

> Rules of Hooks: [Only Call Hooks from React Functions](https://reactjs.org/docs/hooks-rules.html#only-call-hooks-from-react-functions)

If you need to test a custom Hook, you can do so by creating a component in your test, and using your Hook from it. Then you can test the component you wrote. (copied).

Even though hooks are just JavaScript functions, they will work only inside React components. You cannot just invoke them and write tests against what a hook returns. You have to wrap them inside a React component and test the values that it returns. (copied as well).

### Test returns of hooks OR Test components that use hooks?

As `react-hooks-testing-library` said

- When to

  - You're writing a library with one or more custom hooks that are not directly tied a component
  - You have a complex hook that is difficult to test through component interactions

- When not to

  - Your hook is defined along side a component and is only used there
  - Your hook is easy to test by just testing the components using it

If you are one of the following, please read on.

  - you don't know how to test a component
  - you want to reduce the boilerplate
  - you have a complex hook that is difficult to test through component interactions

## Test react built-in hooks

- [packages/react-reconciler/src/__tests__/ReactHooks-test.internal.js](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/__tests__/ReactHooks-test.internal.js)
- [packages/react-reconciler/src/__tests__/ReactHooksWithNoopRenderer-test.internal.js](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/__tests__/ReactHooksWithNoopRenderer-test.internal.js)

## Testing Libraries

Most of the libraries here are for testing components, not for testing the return value of hooks.
But We can write a helper function that exposes the result of hooks from inside the component, I will show that by `enzyme`.

I will use following `useCounter` to show how to test. 

```js
import { useState, useCallback } from 'react';

function useCounter() {
  const [count, setCount] = useState(0);
  const increment = useCallback(() => setCount((x) => x + 1), []);

  return { count, increment };
}

export default useCounter;
```

### [react-dom/test-utils](https://reactjs.org/docs/test-utils.html)

the easiest and most verbose solution, don't need to intro any libraries.
[official example](https://reactjs.org/docs/hooks-faq.html#how-to-test-components-that-use-hooks)

```js
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
```

### [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)

This solution is similar to `react-dom/test-utils`, just in order to reduce the boilerplate.

```js
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
```

### [Enzyme](https://airbnb.io/enzyme/)

- Test component

This solution is similar to `react-dom/test-utils` as well.

```js
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

```

- Test returns of hooks

This demo can only cover simple scenarios, see the next demo for a more robust solution.

```js
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
```

Obviously, we can abstract out the render logic

```js
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
```

### [react-hooks-testing-library](https://github.com/testing-library/react-hooks-testing-library)

#### When to use this library

- You're writing a library with one or more custom hooks that are not directly tied a component
- You have a complex hook that is difficult to test through component interactions

#### When not to use this library

- Your hook is defined along side a component and is only used there
- Your hook is easy to test by just testing the components using it

```js
import { renderHook, act } from '@testing-library/react-hooks';
import useCounter from '../useCounter';

it('should increment counter', () => {
  const { result } = renderHook(() => useCounter());

  expect(result.current.count).toBe(0);

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

## Run the demo

```sh
yarn test
```

## Reference

- [How to test components that use Hooks?](https://reactjs.org/docs/hooks-faq.html#how-to-test-components-that-use-hooks)
- [react-testing-library](https://testing-library.com/docs/react-testing-library/intro)
- [react-hooks-testing-library](https://github.com/testing-library/react-hooks-testing-library)
- [Article: React Hooks: What's going to happen to my tests?](https://kentcdodds.com/blog/react-hooks-whats-going-to-happen-to-my-tests)
- [Article: React Hooks: Test custom hooks with Enzyme](https://dev.to/flexdinesh/react-hooks-test-custom-hooks-with-enzyme-40ib)

## License

MIT
