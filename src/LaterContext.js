import React, { createContext, Component } from 'react';

export const serverContext = {
  isLoadingRoute: false,
  hasHandledRoute: true,
};

const LaterContext = createContext(null);

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
