import React from 'react';
import { Map } from 'immutable';
import { Store, StoreProvider } from './index';

import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const mockComponent = () => ({ setState: jest.fn( f => f({data: Map()}, {})) })

describe('Store', () => {
  test('setting component field', () => {
    const component = {};
    const store = new Store(component);
    expect(store.component).toBe(component);
  })

  test('setting initial values', () => {
    const values = {foo: 'bar'};
    const store = new Store({}, values);
    expect(store.component.state.data).toEqual(Map({foo: 'bar'}));
  })

  test('setting globalProps', () => {
    const props = { 'one': 1 };
    const store = new Store({}, null, props);
    expect(store.globalProps).toEqual(Map({one: 1}));
  });

  test('sets blank initial values and global props', () => {
    const store = new Store({})
    expect(store.globalProps).toEqual(Map({}));
    expect(store.component.state.data).toEqual(Map({}));
  });

  test('updates by passing in a plain object', () => {
    const component = mockComponent();
    const store = new Store(component);
    store.update({foo: 'bar' });

    expect(component.setState.mock.calls.length).toBe(1);
    expect(component.setState.mock.results[0].value)
      .toEqual({ data: Map({foo: 'bar'}) });
  })

  test('updates by passing in an immutable map', () => {
    const component = mockComponent();
    const store = new Store(component);
    store.update(Map({foo: 'bar' }));
    
    expect(component.setState.mock.results[0].value)
      .toEqual({ data: Map({foo: 'bar'}) });
  })

  test('updates by passing in a function', () => {
    const updateFunction = (state, props) => state.merge({ one: 1 });
    const component = mockComponent();
    const store = new Store(component);
    store.update(updateFunction);

    expect(component.setState.mock.results[0].value)
      .toEqual({ data: Map({one: 1})});

    expect(component.setState.mock.calls[0][1]).toBeUndefined();
  })

  test('updates by passing in a key value pair', () => {
    const component = mockComponent();
    const store = new Store(component);
    store.update('testKey', 'testValue');

    expect(component.setState.mock.results[0].value)
      .toEqual({ data: Map({testKey: 'testValue'})});
    
  });

  test('calls callback function if provided', () => {
    const callback = jest.fn();
    const component = mockComponent();
    const store = new Store(component);
    store.update({foo: 'bar' }, callback);
    expect(component.setState.mock.calls[0][1]).toBe(callback);
  })
  
});


describe('StoreProvider', () =>{

  const Count = ({store}) => <p>The count is {store.get('count')}</p>;

  const IncreaseCountButton = ({store}) => {
    return <button id="increase-count" onClick={() => store.update('count', store.get('count')+ 1)} >Increase Count</button>;
  };

  const DecreaseCountButton = ({store}) => {
    return <button id="decrease-count" onClick={() => store.update({count: (store.get('count') - 1)}) }>Decrease Count</button>;
  };

  const App = ({store}) => {
    return <>
	     <Count store={store} />
	     <IncreaseCountButton store={store} />
	     <DecreaseCountButton store={store} />
	   </>;
  }

  const createMountedStore = () => {
    let initialValue = { count: 10 };
    return mount(<StoreProvider initialValue={initialValue} render={store => <App store={store} />} />);
  }

  test('buttons change state of wrapper', () => {
    const wrapper = createMountedStore();
    expect(wrapper.state('data').get('count')).toEqual(10);
    wrapper.find('#increase-count').simulate('click');
    expect(wrapper.state('data').get('count')).toEqual(11);
    wrapper.find('#decrease-count').simulate('click');
    expect(wrapper.state('data').get('count')).toEqual(10);
  });

  test('view changes as well', () => {
    const wrapper = createMountedStore();
    expect(wrapper.find('p').first().html()).toEqual("<p>The count is 10</p>");
    wrapper.find('#increase-count').simulate('click');
    expect(wrapper.find('p').first().html()).toEqual("<p>The count is 11</p>");
  })
});

