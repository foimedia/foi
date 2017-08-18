import React, { Component } from 'react';
import { updateContext } from 'actions/context';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class ScrollManager extends Component {
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
  getNodes () {
    let scroll = window;
    let height = document.getElementsByTagName('BODY')[0];
    if(this.props.node) {
      scroll = this.props.node.base;
      height = this.props.node.base.firstChild;
    }
    return {
      scroll,
      height
    }
  }
  getScroll () {
    const nodes = this.getNodes();
    return (
      nodes.scroll == window ? (
        window.pageYOffset || (document.documentElement.scrollTop)
      ) : nodes.scroll.scrollTop
    );

  }
  componentWillReceiveProps (nextProps) {
    const scroll = this.getScroll();
    const { scrollHistory, location } = this.props;
    if((scroll > 0 || scrollHistory[location.key]) && scrollHistory[location.key] !== scroll) {
      this.props.updateContext('scrollHistory', {
        [location.key]: scroll
      });
    }
  }
  componentDidUpdate (prevProps) {
    const nodes = this.getNodes();
    const { scrollHistory, location } = this.props;
    const scrollTop = scrollHistory[location.key];
    if(
      !this.isModal(prevProps.location) &&
      !this.cameFromModal(prevProps.location)
    ) {
      if(scrollTop !== undefined && scrollTop > 0) {
        // Set min-height to prevent scroll restoration mispositioning from async load of inner content
        nodes.height.style['min-height'] = (
            scrollTop + nodes.scroll.scrollHeight
          ) + 'px';
        nodes.scroll.scrollTop = scrollTop;
      } else {
        nodes.height.style['min-height'] = null;
        nodes.scroll.scrollTop = 0;
      }
    }
  }
  render () {
    return null;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    scrollHistory: state.context.scrollHistory
  }
};

const mapDispatchToProps = {
  updateContext
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ScrollManager));
