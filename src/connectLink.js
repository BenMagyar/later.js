import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import loadRouteData from './loadRouteData';
import loadRouteComponents from './loadRouteComponents';
import LaterContext from './LaterContext';

export function connectRouteData(WrappedComponent) {
  return function(props) {
    return (
      <LaterContext.Consumer>
        {context => <WrappedComponent {...context} {...props} />}
      </LaterContext.Consumer>
    );
  }
}

export function connectLink(WrappedComponent, eventHandler, onError) {
  const ConnectLink = (props) => {
    function load(e) {
      e.preventDefault();
      Promise.resolve(props[eventHandler] ? props[eventHandler]() : null)
        .then(shouldRoute => {
          if (shouldRoute !== false) {
            Promise.all([
              ...loadRouteData(props.routes, props.to, props.resolveRoute),
              loadRouteComponents(props.routes, props.to)
            ]).then(() => {
              props.setHasHandledRoute(true, () => {
                props.history.push(props.to);
              });
            });
          }
        })
        .catch((e) => onError && onError(e));
      return false;
    }
    const handler = { [eventHandler]: load }
    return (
      <WrappedComponent {...props} {...handler} />
    );
  }
  return withRouter(connectRouteData(ConnectLink));
};
