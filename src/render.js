import React from 'react';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import LaterContext, { serverContext } from './LaterContext';
import loadRouteData from './loadRouteData';
import loadRouteComponents from './loadRouteComponents';
import DefaultDocument from './Document';


/**
 * Renders or redirects a request on the server.
 *
 * @param {Object}    options               Render options.
 * @param {Object}    options.req           Server request.
 * @param {Object}    options.res           Server response (or an express-like
 *                                          response object).
 * @param {Array}     options.routes        react-router-config route configuration.
 * @param {Object}    options.assets        Assets manifest.
 * @param {Component} options.document      Alternative document.
 * @param {Function}  options.createStore   Function that creates a redux store.
 * @param {Function}  options.resolveRoute  Function that resolves a routes
 *                                          loadData property.
 * @param {Function}  options.appendToHead  Function that returns a React
 *                                          component that will be placed at
 *                                          the end of the document head.
 */
export function render({
  req,
  res,
  routes,
  assets,
  document,
  createStore,
  resolveRoute,
  appendToHead,
}) {
  let context = {};
  const Document = document || DefaultDocument;
  const store = createStore({});
  const localResolve = resolveRoute.bind(this, store);

  return Promise.all([
    ...loadRouteData(routes, req.url, localResolve, { req }),
    loadRouteComponents(routes, req.url)
  ])
    .then(() => {
      const content = renderToString(
        <LaterContext.Provider value={serverContext}>
          <Provider store={store}>
            <StaticRouter location={req.url} context={context}>
              {renderRoutes(routes)}
            </StaticRouter>
          </Provider>
        </LaterContext.Provider>
      );
      if (context.url) {
        res.redirect(301, context.url);
      } else {
        const helmet = Helmet.renderStatic();
        const page = renderToString(
          <Document helmet={helmet}
              data={store.getState()}
              assets={assets}
              content={content}
              appendToHead={appendToHead}
          />
        );
        return ('<!doctype html>' + page);
      }
    });
};
