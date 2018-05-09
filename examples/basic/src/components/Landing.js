import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import WrappedLink from './Link';

export default () => (
  <div className="root">
    <h1>Hello (from home).</h1>
    <WrappedLink to="/about">
      Inevitable-Link to About
    </WrappedLink>
    &nbsp;/&nbsp;
    <RouterLink to="/about">
      React-Router Link to About
    </RouterLink>
    &nbsp;/&nbsp;
    <a href="/about">
      Anchor to About
    </a>
    &nbsp;/&nbsp;
    <WrappedLink to="/about" onClick={() => false}>
      Link that Cancels Redirect
    </WrappedLink>
    &nbsp;/&nbsp;
    <WrappedLink to="/about" onClick={() => Promise.resolve(false)}>
      Link with Promise that Cancels Redirect
    </WrappedLink>
  </div>
);
