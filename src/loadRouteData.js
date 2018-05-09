import { matchRoutes } from 'react-router-config';

/**
 * Collects all loadRoute properties (and transforms them through localResolve)
 * from the route collection for a given path.
 *
 * @param  {Array}    routes       react-router-config route configuration.
 * @param  {String}   location     Future pathname.
 * @param  {Function} localResolve resolveRoute bound to a given store.
 * @param  {Object}   ctx          Additional context passed from render or
 *                                 hydrate (e.g. the request).
 * @return {Promise}               Promise that loads all required data for a
 *                                 route.
 */
export default function loadRouteData(routes, location, localResolve, ctx) {
  const branch = matchRoutes(routes, location);
  return branch.map(({ match, route }) => {
    if (route.loadData) {
      return localResolve(route.loadData, { ...ctx, match });
    }
    return undefined;
  });
}
