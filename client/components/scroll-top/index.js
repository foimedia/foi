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
    const { scrollHistory, location } = this.props;
    const scrollTop = scrollHistory[location.key];
    const body = document.getElementsByTagName('BODY')[0];
    if(
      !this.isModal(prevProps.location) &&
      !this.cameFromModal(prevProps.location)
    ) {
      if(scrollTop !== undefined && scrollTop > 0) {
        // Set min-height to prevent scroll restoration mispositioning from async load of inner content
        body.style['min-height'] = (scrollTop + window.innerHeight) + 'px';
        // Run scroll after next UI thread is available (time to render children components and have the scroll available)
        setTimeout(function() {
          window.scrollTo(0, scrollTop);
        });
      } else {
        body.style['min-height'] = null;
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
