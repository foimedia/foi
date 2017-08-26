import React, { Component } from 'react';
import styled from 'styled-components';
import Transition from 'react-transition-group/Transition';
import styleUtils from 'services/style-utils';

const transitionDuration = 200;

const Wrapper = styled.span`
  font-family: "Inconsolata", monospace;
  font-size: .7em;
  text-align: center;
  background: #222;
  color: #fff;
  text-transform: uppercase;
  transition: all ${transitionDuration}ms ease-in-out;
  &.transition-exited,
  &.transition-entering {
    max-height: 0.01px;
    padding: 0.01rem;
  }
  &.transition-entered,
  &.transition-exiting {
    max-height: 60px;
    ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
      padding: ${styleUtils.margins[i]}rem;
    `)}
  }
  .fa {
    margin-right: 1rem;
    color: red;
  }
`

export default class OfflineNotice extends Component {
  render () {
    return (
      <Transition
        in
        appear={true}
        enter={true}
        exit={true}
        timeout={transitionDuration}>
        {status => (
          <Wrapper className={`loader transition-${status}`}>
            <span className="fa fa-signal"></span>
            You are offline
          </Wrapper>
        )}
      </Transition>
    )
  }
}
