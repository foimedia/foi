import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class ScrollToTop extends Component {
  isModal (prevLocation) {
    const { location } = this.props;
    return !(
      location !== prevLocation &&
      (!location.state || !location.state.modal) &&
      (!prevLocation.state || !prevProps.location.state.modal)
    )
  }
  componentDidUpdate(prevProps) {
    if (!this.isModal(prevProps.location)) {
      window.scrollTo(0, 0)
    }
  }
  render() {
    return this.props.children
  }
}

export default withRouter(ScrollToTop);
