import React, { Component } from 'react';

export default class TGLink extends Component {
  static defaultProps = {
    domain: foi.botName,
    children: `@${foi.botName}`
  }
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  getParams (props) {
    return Object.keys(props).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(props[key]);
    }).join('&');
  }
  // Using iframe src to load `tg://` scheme.
  // Fixes firefox bug that disconnects socket.io when loading
  // the custom scheme url with default _self target.
  handleClick (event) {
    event.preventDefault();
    this.linkNode.querySelector('iframe').src = this.linkNode.href;
  }
  render () {
    const { children, className, ...props } = this.props;
    return (
      <a
        className={className}
        href={`tg://resolve?${this.getParams(props)}`}
        ref={ node => this.linkNode = node }
        onClick={this.handleClick}
        >
        {children}
        <iframe style={{display: 'none'}}></iframe>
      </a>
    )
  }
};
