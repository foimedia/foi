import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class Headers extends Component {
  shouldComponentUpdate (nextProps) {
    // Helmet update on preact-compat causes infinite loop.
    // See: https://github.com/nfl/react-helmet/issues/287
    // See: https://github.com/developit/preact-compat/issues/391
    return false;
  }
  render () {
    return (
      <Helmet>
        <title>FOI - Publishing Bot</title>
        <meta name="description" content="Real-time coverage of events for journalists and activists." />
      </Helmet>
    )
  }
};

const mapStateToProps = (state, ownProps) => {
  return {}
};

export default withRouter(connect(mapStateToProps)(Headers));
