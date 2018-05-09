import React from 'react';
import { connect } from 'react-redux';

const Name = ({ name }) => (
  <h1>
    All about {name}.
  </h1>
);

function mapStateToProps(state) {
  return {
    name: state.about.name,
  }
}

export default connect(mapStateToProps)(Name);
