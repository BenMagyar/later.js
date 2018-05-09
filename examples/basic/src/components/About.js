import React from 'react';
import { renderRoutes } from 'react-router-config';
import Link from './Link';

export default ({ route }) => (
  <div>
    <h1>
      Hello from (about).
    </h1>
    <Link to="/">To Home</Link>
    &nbsp;/&nbsp;
    <Link to="/about/me">To About Me</Link>
    &nbsp;/&nbsp;
    <Link to="/about/you">To About You</Link>
    {renderRoutes(route.routes)}
  </div>
);
