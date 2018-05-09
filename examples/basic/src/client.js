import { hydrate } from 'later.js';
import routes from './routes';
import { createStore } from './state';
import resolveRoute from './resolveRoute';

hydrate({
  routes,
  createStore,
  resolveRoute,
});

if (module.hot) {
  module.hot.accept();
}
