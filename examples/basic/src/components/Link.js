import React from 'react';
import { connectLink } from 'later.js';

const Link = ({ to, children, isLoadingRoute, onClick }) => (
  <a href={to} onClick={onClick}>
    {isLoadingRoute ? 'loading...' : children}
  </a>
);

export default connectLink(Link, 'onClick');
