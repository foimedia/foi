import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { Link, Redirect } from 'react-router-dom';

export default class SmartLink extends Component {
  static contextTypes = {
    router: PropTypes.object
  }
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    }
    this.handleBlockClick = this.handleBlockClick.bind(this);
  }
  findInteractiveAncestor (el) {
    while ((el = el.parentElement) && !el.classList.contains('interactive'));
    return el;
  }
  findLinkAncestor (el) {
    while ((el = el.parentElement) && el.nodeName !== 'A');
    return el;
  }
  isInteractiveNode(el) {
    return el.nodeName === 'A' || this.findLinkAncestor(el) || el.classList.contains('interactive') || this.findInteractiveAncestor(el);
  }
  handleBlockClick (event) {
    const { router } = this.context;
    const { to, location } = this.props;
    const node = findDOMNode(this);
    if(event.target === node || !this.isInteractiveNode(event.target)) {
      if(router !== undefined && router.route.location.pathname !== to) {
        this.setState({
          redirect: true
        });
      } else {
        window.open(event.target.href || foi.public + (to.pathname || to), this.isLocal() ? '_self' : '_blank');
      }
    }
  }
  isLocal () {
    return foi.public.indexOf(location.hostname) !== -1;
  }
  render () {
    const { router } = this.context;
    const { redirect } = this.state;
    const { children, block, to, ...props } = this.props;
    if(block) {
      if(redirect) {
        return <Redirect push to={to} />
      } else {
        return (
          <div onClick={this.handleBlockClick}>{children}</div>
        )
      }
    } else {
      if(router !== undefined) {
        return <Link to={to} {...props}>{children}</Link>
      } else {
        const rel = this.isLocal() ? '' : 'external';
        const target = this.isLocal() ? '_self' : '_blank';
        return <a href={`${foi.public}${to.pathname || to}`} rel={rel} target={target} {...props}>{children}</a>
      }
    }

  }
}
