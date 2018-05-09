import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import loadRouteData from './loadRouteData';
import loadRouteComponents from './loadRouteComponents';
import LaterContext from './LaterContext';

/**
 * Connects a component to the LaterContext context.
 *
 * @param  {Component} WrappedComponent React component to provide context to.
 * @return {Component}                  Wrapped React component.
 */
export function connectRouteData(WrappedComponent) {
  return function(props) {
    return (
      <LaterContext.Consumer>
        {context => <WrappedComponent {...context} {...props} />}
      </LaterContext.Consumer>
    );
  }
}

/**
 * Allows for components to be used as links with internal status updates.
 *
 * @param  {Component} WrappedComponent React component to wrap.
 * @param  {String}    eventHandler     Event handler name that should push to
 *                                      history state.
 * @param  {Function}  onError          Function to call on an error.
 * @return {Component}                  Wrapped React component.
 */
export function connectLink(WrappedComponent, eventHandler, onError) {

  class ConnectLink extends Component {

      state = {
        routeError: null,
      }

      constructor(props) {
        super(props);
        this.load = this.load.bind(this);
      }

      /**
       * Loads and possibly switches to the specified route.
       *
       * @param  {Event} e Triggering event.
       */
      load(e) {
        e.preventDefault();

        // weird to spread so many out.
        const p = this.props;
        Promise.resolve(p[eventHandler] ? p[eventHandler]() : null)
          .then(shouldRoute => {
            // Check if it should route or not depending on the resolved
            // status.
            if (shouldRoute !== false) {
              Promise.all([
                ...loadRouteData(p.routes, p.to, p.resolveRoute),
                loadRouteComponents(p.routes, p.to)
              ]).then(() => {
                // Wait before pushing state so it doesn't accidentally fall
                // as an unmanaged route change.
                p.setHasHandledRoute(true, () => {
                  p.history.push(p.to);
                });
              });
            }
          })
          .catch((error) => {
            if (onError) {
              onError(error);
            }
            this.setState({ routeError: error });
          });
      }

      render() {
        const passedProps = {
          [eventHandler]: this.load,
          routeError: this.state.routeError,
        };
        return <WrappedComponent {...this.props} {...passedProps} />;
      }

  }

  return withRouter(connectRouteData(ConnectLink));
};
