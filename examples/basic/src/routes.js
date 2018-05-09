import { asyncComponent } from 'later.js';
import App from './components/App';
import Landing from './components/Landing';
import { loadName } from './state';

export default [
  {
    component: App,
    routes: [
      {
        path: '/',
        exact: true,
        component: Landing,
      },
      {
        path: '/about',
        component: asyncComponent(() => import('./components/About')),
        routes: [{
          path: '/about/:name',
          component: asyncComponent(() => import('./components/Name')),
          loadData: loadName,
        }]
      }
    ]
  }
];
