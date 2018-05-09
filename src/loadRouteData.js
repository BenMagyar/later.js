import { matchRoutes } from 'react-router-config';

export default function loadRouteData(routes, location, localResolve, ctx) {
  const branch = matchRoutes(routes, location);
  return branch.map(({ match, route }) => {
    if (route.loadData) {
      return localResolve(route.loadData, { ...ctx, match });
    }
    return undefined;
  });
}
