import React, { Component } from 'react';
import { hydrate as reactHydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import loadRouteComponents from './loadRouteComponents';
import HandleRouteChange from './HandleRouteChange';
import LaterContext, { createLaterProvider } from './LaterContext';

/**
 * Hydrates the React application on the client.
 *
 * @param  {Object}   options               Hydration options.
 * @param  {Function} options.createStore   Function that returns a redux store.
 * @param  {Array}    options.routes        react-router-config routes
 *                                          configuration.
 * @param  {Function} options.resolveRoute  Function that resolves a route's
 *                                          loadData property.
 * @param  {Function} options.hydrateMethod Hydration method. children passed 
 *                                          here to provide the ability to wrap
 *                                          the application. 
 */
export function hydrate({ createStore, routes, resolveRoute, hydrateMethod }) {
    const preloadedState = JSON.parse(
      document.getElementById('preloaded-state').textContent
    );
    const store = createStore(preloadedState);
    const storeResolve = resolveRoute.bind(this, store);

    // Allows for links to be created that access route resolution.
    const LaterContextProvider = createLaterProvider(routes, storeResolve);

    loadRouteComponents(routes, window.location.pathname).then(() => {
      hydrateMethod = hydrateMethod || reactHydrate;
      hydrateMethod(
        <LaterContextProvider>
          <LaterContext.Consumer>
            {LaterContext =>
              <Provider store={store}>
                <BrowserRouter>
                  <HandleRouteChange {...LaterContext}>
                    {renderRoutes(routes)}
                  </HandleRouteChange>
                </BrowserRouter>
              </Provider>
            }
          </LaterContext.Consumer>
        </LaterContextProvider>
      , document.getElementById('root'));
    });
};
