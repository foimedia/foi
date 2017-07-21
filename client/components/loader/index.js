import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';
import ReactLoading from 'react-loading';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
`;

const LoaderWrapper = styled.div`
  img {
    animation ${rotate} 1s linear infinite;
    opacity: .2;
    margin: auto;
    height: auto;
    display: block;
  }
`

export default class Loader extends Component {
  render () {
    const { size } = this.props;
    return (
      <LoaderWrapper className="loader">
        <img src={require('images/loader.svg')} width={size} />
      </LoaderWrapper>
    )
  }
}
