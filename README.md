# simplestore

simplestore is a simple centralized state store for react.

The `Store` has two methods `update()` and `get()`

`update` changes the state. There are 3 ways to use this function.

*note*: regular object literals are used in these examples but the state is actually an immutable-js `Map`.

If called with object it will deeply merge that object with the current state

``` js
// state = { a: 1, b: { c: 3 } }
store.update({ b: { d: 4 } })
// state = { a: 1, b: { c: 3, d: 4 } }
```

If called with a function it will call that function with two arguments -- the current state and props -- just like react's setState. It will replace the entire state with the return value of the function.

``` js
// state = { count: 1 }
const updater = (state) => state.set('count', state.get('count') + 1 );
store.update(updater)
// state = { count: 2 }
```

`store.update` can also be called with a key value pair

``` js
// state = { a: 'a' }
store.update('b', 'b')
// state = { a: 'a', b: 'b' }
```

To use simplestore, the entire app can be wrapped with the component `StoreProvider`. An initial value for the store can optionally be set with the prop "initialValue".

``` js
import React from 'react';
import ReactDOM from 'react-dom';
import { StoreProvider } from './index';

const Count = ({store}) => <p>The count is {store.get('count')}</p>;

const IncreaseCountButton = ({store}) => {
    return <button onClick={() => store.update('count', store.get('count')+ 1)} >Increase Count</button>;
};

const App = ({store}) => {
    return <>
	     <Count store={store} />
	     <IncreaseCountButton store={store} />
	   </>;
}

ReactDOM.render(
	<StoreProvider initialvalue={{count: 0}} render={store => <App store={store} />} />,
	document.body.appendChild(document.createElement('div')),
);

```
