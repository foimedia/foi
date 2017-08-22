import React, { Component } from 'react';

export default class TGLink extends Component {
  static defaultProps = {
    domain: foi.botName,
    children: `@${foi.botName}`
  }
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
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
    if(this.isFirefox) {
      const iframe = this.linkNode.querySelector('iframe');
      iframe.src = this.linkNode.href;
    } else {
      window.location = this.linkNode.href;
    }
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
        {this.isFirefox &&
          <iframe
            frameBorder="0"
            style={{
              width: 0,
              height: 0,
              border: 0,
              display: 'inline'
            }} />
        }
      </a>
    )
  }
};
