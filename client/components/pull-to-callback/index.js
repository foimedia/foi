import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';

export default class PullToCallback extends Component {

  lastTouchY = 0;
  preventPull = false;

  constructor (props) {
    super(props);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
  }

  componentDidMount () {
    this.container = this.findScrollableAncestor(findDOMNode(this));
    document.addEventListener('touchstart', this.handleTouchStart, {
      passive: false
    });
    document.addEventListener('touchmove', this.handleTouchMove, {
      passive: false
    });
  }

  componentWillUnmount () {
    document.removeEventListener('touchstart', this.handleTouchStart);
    document.removeEventListener('touchmove', this.handleTouchMove);
  }

  findScrollableAncestor (el) {
    if(el !== undefined && el !== null)
      while ((el = el.parentElement) && !el.classList.contains('scrollable'));
    return el;
  }

  isModalElement (el) {
    if(el !== undefined && el !== null)
      while ((el = el.parentElement) && !el.classList.contains('modal'));
    return el;
  }

  handleTouchStart (e) {
    if (e.touches.length != 1) return;
    this.lastTouchY = e.touches[0].clientY;
    this.preventPull = this.container.scrollTop == 0;
  }

  handleTouchMove(e) {
    const { callback } = this.props;
    const touchY = e.touches[0].clientY;
    const touchYDelta = touchY - this.lastTouchY;
    this.lastTouchY = touchY;
    if (this.preventPull) {
      // To suppress pull-to-refresh it is sufficient to preventDefault the first overscrolling touchmove.
      this.preventPull = false;
      if (touchYDelta > 0) {
        if(typeof callback == 'function' && !this.isModalElement(e.target))
          callback(e);
        e.preventDefault();
        return;
      }
    }
  }

  render () {
    return <span />;
  }

}
