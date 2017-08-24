import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { updateContext } from 'actions/context';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class ScrollManager extends Component {
  constructor(props) {
    super(props);
    this.watchScroll = this.watchScroll.bind(this);
  }
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
      scroll = findDOMNode(this.props.node);
      height = scroll ? scroll.firstChild : null;
    }
    return {
      scroll,
      height
    }
  }
  componentWillReceiveProps (nextProps) {
    const nodes = this.getNodes();
    const scroll = this.currentScroll;
    const { scrollHistory, location } = this.props;
    if((scroll > 0 || scrollHistory[location.key]) && scrollHistory[location.key] !== scroll) {
      this.props.updateContext('scrollHistory', {
        [location.key]: scroll
      });
    }
    nodes.scroll.removeEventListener('scroll', this.watchScroll);
  }
  watchScroll (ev) {
    this.currentScroll = ev.target == window ? (
      window.pageYOffset || document.documentElement.scrollTop
    ) : ev.target.scrollTop;
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
        if(nodes.height) {
          nodes.height.style['min-height'] = null;
        }
        if(nodes.scroll) {
          nodes.scroll.scrollTop = 0;
        }
      }
    }
    nodes.scroll.addEventListener('scroll', this.watchScroll);
  }
  componentWillUnmount () {
    nodes.scroll.removeEventListener('scroll', this.watchScroll);
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
