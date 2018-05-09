import { matchRoutes } from 'react-router-config';

export default function loadRouteComponents(routes, location) {
  const branch = matchRoutes(routes, location);
  return Promise.all(branch.map(({ match, route }) => {
    if (route.component && route.component.load) {
      return route.component.load();
    }
    return undefined;
  }));
}
