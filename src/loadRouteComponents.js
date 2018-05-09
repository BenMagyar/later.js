import { matchRoutes } from 'react-router-config';

/**
 * Collects all asyncComponent(s) from the route collection for a given path.
 *
 * @param  {Array}  routes   react-router-config route configuration.
 * @param  {String} location Future pathname.
 * @return {Promise}         Promise that loads all required components.
 */
export default function loadRouteComponents(routes, location) {
  const branch = matchRoutes(routes, location);
  return Promise.all(branch.map(({ match, route }) => {
    if (route.component && route.component.load) {
      return route.component.load();
    }
    return undefined;
  }));
}
