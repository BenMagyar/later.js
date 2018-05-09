import React from 'react';
import { renderRoutes } from 'react-router-config';
import { StatusConsumer } from 'later.js';

export default ({ route }) => (
  <div className="app">
    <style jsx>{`
      :global(body) {
        height: 100%;
        margin: 0;
      }
      .app {
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Linotype, Helvetica Neue, Arial, sans-serif;
        padding: 50px;
        text-align: center;
        width: 100%;
      }
      .loading-bar {
        position: fixed;
        top: 0;
        height: 5px;
        width:100%;
      }
    `}</style>
    <StatusConsumer>
      {({ isLoadingRoute }) => (
        isLoadingRoute &&
          <div className='loading-bar'>
            Loading
          </div>
      )}
    </StatusConsumer>
    {renderRoutes(route.routes)}
  </div>
);
