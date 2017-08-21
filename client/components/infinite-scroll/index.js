import React, { Component } from 'react';
import Loader from 'components/loader';

class InfiniteScroll extends Component {
  static defaultProps = {
    loadMore: null,
    hasMore: false,
    threshold: 200,
    useWindow: true
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
  findScrollableAncestor (el) {
    if(el !== undefined && el !== null)
      while ((el = el.parentElement) && !el.classList.contains('scrollable'));
    return el;
  }
  attachListener () {
    if(!this.props.hasMore) {
      return;
    }
    let elParent = window;
    if (this.props.useWindow === false && this.scrollComponent !== null) {
      elParent = this.findScrollableAncestor(this.scrollComponent) || this.scrollComponent.parentElement;
    }
    elParent.addEventListener('scroll', this.handleScroll);
    elParent.addEventListener('resize', this.handleScroll);
  }
  detachListener () {
    let elParent = window;
    if (this.props.useWindow === false && this.scrollComponent !== null) {
      elParent = this.findScrollableAncestor(this.scrollComponent) || this.scrollComponent.parentElement;
    }
    elParent.removeEventListener('scroll', this.handleScroll);
    elParent.removeEventListener('resize', this.handleScroll);
  }
  handleScroll () {
    const el = this.scrollComponent;
    let elParent = window;
    if (this.props.useWindow === false && this.scrollComponent !== null) {
      elParent = this.findScrollableAncestor(this.scrollComponent) || this.scrollComponent.parentElement;
    }
    let offset;

    if (this.props.useWindow) {
      const scrollTop = (scrollEl.pageYOffset !== undefined) ?
       scrollEl.pageYOffset :
       (document.documentElement || document.body.parentNode || document.body).scrollTop;
      if (this.props.isReverse) {
        offset = scrollTop;
      } else {
        offset = this.calculateTopPosition(el) +
                     (el.offsetHeight -
                     scrollTop -
                     window.innerHeight);
      }
    } else if (this.props.isReverse) {
      offset = elParent.scrollTop;
    } else {
      offset = elParent.scrollHeight - elParent.scrollTop - elParent.clientHeight;
    }

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
      useWindow,
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
