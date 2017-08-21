import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';
import CSSTransition from 'react-transition-group/CSSTransition';

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
  .transition-exit-active,
  .transition-appear,
  .transition-enter {
    max-height: 0.01px;
  }
  .transition-exit-active,
  .transition-enter-active,
  .transition-appear-active {
    transition: all ${transitionDuration}ms ease-in-out;
  }
  .transition-exit,
  .transition-enter-active,
  .transition-appear-active {
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
      <LoaderWrapper className={`loader`}>
        <CSSTransition
          in
          appear={true}
          timeout={transitionDuration}
          classNames="transition">
          <div>
            <img src={require('images/loader.svg')} width={size} />
            <span>{label}</span>
          </div>
        </CSSTransition>
      </LoaderWrapper>
    )
  }
}
