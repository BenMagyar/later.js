import React from 'react';

/**
 * Creates an async React component that will be loaded on route change.
 *
 * @param  {Function} loader Function that returns a dynamic import of a
 *                           component.
 * @return {Component}       Component that will render the dynamic import on
 *                           load.
 */
export function asyncComponent(loader) {
  let Component = null;

  class AsyncRouteComponent extends React.Component {

    static load() {
      return loader().then(ResolvedComponent => {
        Component = ResolvedComponent.default || ResolvedComponent;
      });
    }

    state = { Component, }

    constructor(props) {
      super(props);
      this.updateState = this.updateState.bind(this);
    }

    componentWillMount() {
      AsyncRouteComponent.load().then(this.updateState);
    }

    updateState() {
      if (this.state.Component !== Component) {
        this.setState({
          Component,
        });
      }
    }

    render() {
      const { Component: StateComponent  } = this.state;

      if (StateComponent) {
        return <StateComponent {...this.props} />;
      }

      return null;
    }

  }

  return AsyncRouteComponent;
}
