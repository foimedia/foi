import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';
import Transition from 'react-transition-group/Transition';

const transitionDuration = 200;

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
  margin-left: auto;
  margin-right: auto;
  &.transition-exited,
  &.transition-entering {
    max-height: 0.01px;
    margin-top: 0.01rem;
    margin-bottom: 0.01rem;
  }
  &.transition-entered,
  &.transition-exiting {
    max-height: 55px;
    margin-top: 1rem;
    margin-bottom: 1rem;
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
