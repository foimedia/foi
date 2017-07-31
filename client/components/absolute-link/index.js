import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class AbsoluteLink extends Component {
  isLocal () {
    return foi.url.indexOf(location.hostname) !== -1;
  }
  render () {
    const { router } = this.context;
    const { to, children } = this.props;
    if(router !== undefined) {
      return <Link {...this.props}>{children}</Link>
    } else {
      const rel = this.isLocal() ? '' : 'external';
      const target = this.isLocal() ? '' : '_blank';
      return <a href={`${foi.url}${to}`} rel={rel} target={target}>{children}</a>
    }

  }
}
