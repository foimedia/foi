import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';
import Transition from 'react-transition-group/Transition';

const transitionDuration = 400;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
`;

const LoaderWrapper = styled.div`
  text-align: center;
  overflow: hidden;
  transition: all ${transitionDuration}ms ease-in-out;
  &.transition-exited,
  &.transition-entering {
    max-height: 0.01px;
  }
  &.transition-entered,
  &.transition-exiting {
    max-height: 60px;
  }
  span {
    font-size: .7em;
    color: #999;
    font-style: italic;
  }
  img {
    animation ${rotate} 1s linear infinite;
    opacity: 1;
    margin: auto;
    height: auto;
    display: block;
  }
`

export default class Loader extends Component {
  render () {
    const { size, label } = this.props;
    return (
      <Transition
        in
        appear={true}
        enter={true}
        exit={true}
        timeout={transitionDuration}>
        {status => (
          <LoaderWrapper className={`loader transition-${status}`}>
            <img src={require('images/loader.svg')} width={size} />
            <span>{label}</span>
          </LoaderWrapper>
        )}
      </Transition>
    )
  }
}
