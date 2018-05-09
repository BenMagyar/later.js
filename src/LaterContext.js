import React, { createContext, Component } from 'react';

/**
 *  Simple server-context that does not require state management.
 */
export const serverContext = {
  isLoadingRoute: false,
  hasHandledRoute: true,
};

const LaterContext = createContext(null);

/**
 * Creates a LaterContext provider that manages if/when/how routes are updated.
 *
 * @param  {Array}     routes       react-router-config route configuration.
 * @param  {Function}  resolveRoute Function that resolves a route's loadData
 *                                  property.
 * @return {Component}              React Later-context provider component.
 */
export function createLaterProvider(routes, resolveRoute) {
  class LaterContextProvider extends Component {

    state = {
      hasHandledRoute: false,
      isLoadingRoute: false,
    }

    constructor(props) {
      super(props);
      this.setHasHandledRoute = this.setHasHandledRoute.bind(this);
      this.setIsLoadingRoute = this.setIsLoadingRoute.bind(this);
    }

    setHasHandledRoute(hasHandledRoute, done) {
      this.setState({ hasHandledRoute }, done);
    }

    setIsLoadingRoute(isLoadingRoute) {
      this.setState({ isLoadingRoute });
    }


    render() {
      const { children } = this.props;
      const { hasHandledRoute, isLoadingRoute } = this.state;
      const context = {
          routes,
          resolveRoute,
          hasHandledRoute,
          setHasHandledRoute: this.setHasHandledRoute,
          isLoadingRoute,
          setIsLoadingRoute: this.setIsLoadingRoute,
      };
      return (
        <LaterContext.Provider value={context}>
          {children}
        </LaterContext.Provider>
      )
    }

  }

  return LaterContextProvider;
}

export default LaterContext;
