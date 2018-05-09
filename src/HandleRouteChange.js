import React, { Component } from 'react';
import { Route, withRouter } from 'react-router';
import loadRouteComponents from './loadRouteComponents';
import loadRouteData from './loadRouteData';


/**
 * Handles unmanaged route changes in the React application. Fetching data and
 * components where necessary.
 */
class HandleRouteChange extends Component {

  state = {
    previousLocation: null,
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location !== nextProps.location) {
      // Using nextProps and not this.props here in case of some batched state
      // change?
      if (!nextProps.hasHandledRoute) {
        nextProps.setIsLoadingRoute(true);
        this.setState({ previousLocation: this.props.location });
        Promise.all([
            loadRouteComponents(nextProps.routes, nextProps.location),
            loadRouteData(nextProps.routes, nextProps.location, nextProps.resolveRoute),
        ])
          .then(() => {
            nextProps.setIsLoadingRoute(false);
            nextProps.setHasHandledRoute(false);
            this.setState({ previousLocation: null, });
          })
          .catch((e) => {
            nextProps.setIsLoadingRoute(false, e);
          });
      } else {
        // Reset that the route change was handled
        nextProps.setHasHandledRoute(false);
      }
    }
  }

  render() {
    const { children, location } = this.props;
    const { previousLocation } = this.state;
    return (
      <Route location={previousLocation || location}
        render={() => children}
      />
    );
  }

}

export default withRouter(HandleRouteChange);
