import React, { Component } from 'react';
import ReactLoading from 'react-loading';

export default class Loader extends Component {
  render () {
    const { size } = this.props;
    return <ReactLoading className="loader" type={'bubbles'} color={'#999'} width={`${size}px`} height={`${size}px`} />
  }
}
