import React from 'react';
import isFunction from 'lodash/isFunction';
import isPlainObject from 'lodash/isPlainObject';
import isUndefined from 'lodash/isUndefined';
import { Map } from 'immutable';

export class Store {
  constructor(component, initialValue = {}) {
    this.component = component;
    component.state = { data: Map(initialValue) }
  }

  update() {
    if (isPlainObject(arguments[0]) || Map.isMap(arguments[0])) {

      this.component.setState(state => {
	return { data: state.data.merge(arguments[0]) };
      });

    } else if (isFunction(arguments[0])) {

      this.component.setState( (state, props) => {
	return { data: arguments[0](state.data, props) };
      });

    } else if (arguments[0] && !isUndefined(arguments[1])) {

      this.component.setState(state => {
	return { data: state.data.set(arguments[0], arguments[1]) };
      });

    } else {
      throw "Invalid arguments to updateState(). It must be called with with an plain object, a function, or a key-value pair."
    }
  }

  get(k) {
    return this.component.state.data.get(k);
  }
}

export class StoreProvider extends React.Component {
  constructor(props) {
    super(props);
    this.store = new Store(this, props.initialValue || {});
  }

  render() {
    return React.createElement(React.Fragment, null, this.props.render(this.store));
  }
}
