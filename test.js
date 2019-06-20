import { Map } from 'immutable';
import { Store, StoreProvider } from './index';

const mockComponent = () => ({ setState: jest.fn( f => f({data: Map()}, {})) })

describe('Store', () => {
  test('setting component field', () => {
    const component = {};
    const store = new Store(component);
    expect(store.component).toBe(component);
  })

  test('setting inital values', () => {
    const values = {foo: 'bar'};
    const store = new Store({}, values);
    expect(store.component.state.data).toEqual(Map({foo: 'bar'}));
  })

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
  })

  test('updates by passing in a key value pair', () => {
    const component = mockComponent();
    const store = new Store(component);
    store.update('testKey', 'testValue');

    expect(component.setState.mock.results[0].value)
      .toEqual({ data: Map({testKey: 'testValue'})});
    
  });
});
