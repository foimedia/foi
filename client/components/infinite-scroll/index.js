import React, { Component } from 'react';
import Loader from 'components/loader';

class InfiniteScroll extends Component {
  static defaultProps = {
    loadMore: null,
    hasMore: false,
    threshold: 250
  }
  constructor (props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
  }
  componentDidMount () {
    this.attachListener();
  }
  componentDidUpdate() {
    this.attachListener();
  }
  componentWillUnmount () {
    this.detachListener();
  }
  attachListener () {
    if(!this.props.hasMore) {
      return;
    }
    const elParent = window;
    elParent.addEventListener('scroll', this.handleScroll);
    elParent.addEventListener('resize', this.handleScroll);
  }
  detachListener () {
    const elParent = window;
    elParent.removeEventListener('scroll', this.handleScroll);
    elParent.removeEventListener('resize', this.handleScroll);
  }
  handleScroll () {
    const el = this.scrollComponent;
    const elParent = window;
    let offset;
    const scrollTop = (elParent.pageYOffset !== undefined) ?
      elParent.pageYOffset :
      (document.documentElement || document.body.parentNode || document.body).scrollTop
    offset = this.calculateTopPosition(el) + (el.offsetHeight - scrollTop - window.innerHeight);
    if(offset < Number(this.props.threshold)) {
      this.detachListener();
      if(typeof this.props.loadMore === 'function') {
        this.props.loadMore();
      }
    }
  }
  calculateTopPosition (el) {
    if (!el) {
      return 0;
    }
    return el.offsetTop + this.calculateTopPosition(el.offsetParent);
  }
  render () {
    const {
      children,
      hasMore,
      loadMore,
      threshold,
      ...props
    } = this.props;
    props.ref = (node) => {
      this.scrollComponent = node;
    };
    const childrenArray = [children];
    if(hasMore) {
      childrenArray.push(<Loader size={20} />);
    }
    return React.createElement('div', props, ...childrenArray);
  }
}

export default InfiniteScroll;
