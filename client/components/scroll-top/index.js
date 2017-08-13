import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class ScrollToTop extends Component {
  isModal (prevLocation) {
    const { location } = this.props;
    return !(
      location !== prevLocation &&
      (!location.state || !location.state.modal) &&
      (!prevLocation.state || prevLocation.state.modal)
    )
  }
  cameFromModal (prevLocation) {
    const { location } = this.props;
    return (
      location !== prevLocation &&
      prevLocation.state && prevLocation.state.modal
    );
  }
  componentDidUpdate(prevProps) {
    const { scrollHistory } = this.props;
    const { key } = this.props.location;
    if(
      !this.isModal(prevProps.location) &&
      !this.cameFromModal(prevProps.location)
    ) {
      if(scrollHistory[key]) {
        // Run scroll after next UI thread is available (time to render children components and have the scroll available)
        setTimeout(function() {
          window.scrollTo(0, scrollHistory[key]);
        });
      } else {
        window.scrollTo(0, 0);
      }
    }
  }
  render() {
    return null;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    scrollHistory: state.context.scrollHistory
  }
};

export default withRouter(connect(mapStateToProps)(ScrollToTop));
