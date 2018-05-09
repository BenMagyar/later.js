import React from 'react';

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
