import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Link } from 'react-router-dom';

export default class SmartLink extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick (event) {
    const node = findDOMNode(this);
    if(event.target !== node && event.target.nodeName == 'A') {
      event.preventDefault();
      window.location = event.target.href;
    }
  }
  isLocal () {
    return foi.url.indexOf(location.hostname) !== -1;
  }
  render () {
    const { router } = this.context;
    const { children, ...props } = this.props;
    if(router !== undefined) {
      return <Link {...props} onClick={this.handleClick}>{children}</Link>
    } else {
      const rel = this.isLocal() ? '' : 'external';
      const target = this.isLocal() ? '' : '_blank';
      return <a href={`${foi.url}${props.to}`} rel={rel} target={target} {...props} onClick={this.handleClick}>{children}</a>
    }

  }
}
