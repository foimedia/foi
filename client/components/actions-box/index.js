import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import styled, { css } from 'styled-components';
import styleUtils from 'services/style-utils';
import Transition from 'react-transition-group/Transition';

const Wrapper = styled.nav`
  position: relative;
  .toggler {
    font-size: 1.4em;
    cursor: pointer;
    color: #999;
    &:hover,
    &:active,
    &:focus {
      color: #666;
    }
  }
`

const ActionsBox = styled.div`
  position: absolute;
  right: -.7rem;
  bottom: 1.7rem;
  background: #333;
  border-radius: ${styleUtils.radius/3}px;
  padding-top: .3rem;
  padding-bottom: .3rem;
  border: 1px solid #222;
  line-height: 1;
  max-width: 15em;
  &.fade {
    transition: all 200ms ${styleUtils.transition};
  }
  &.fade-entering, &.fade-exiting {
    transform: translate(0, -.5rem);
    opacity: 0.01;
    display: block;
  }
  &.fade-exited {
    display: none;
  }
  &.fade-entered {
    transform: translate(0, 0);
    opacity: 1;
    display: block;
  }
  ${props => props.active && css`
    display: block;
  `}
  &:after {
    content: '';
    width: .7rem;
    height: .7rem;
    transform: rotate(45deg);
    position: absolute;
    background: #333;
    bottom: -.40rem;
    right: .7rem;
    border-bottom: 1px solid #222;
    border-right: 1px solid #222;
  }
  a {
    padding: .3rem 1rem;
    display: block;
    border-bottom: 1px solid #222;
    white-space: nowrap;
    position: relative;
    z-index: 1;
    color: #999;
    &:hover,
    &:focus {
      background: ${styleUtils.color};
      color: #fff;
    }
    &:last-child {
      border-bottom: 0;
    }
    .fa {
      margin-right: .5rem;
      margin-left: -.25rem;
    }
  }
  ${styleUtils.media.phablet`
    bottom: 2rem;
  `}
  ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
    a {
    }
  `)}
`

export default class Actions extends Component {
  constructor (props) {
    super(props);
    this.state = {
      active: false
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleWindowClick = this.handleWindowClick.bind(this);
  }
  hide () {
    this.setState({active: false});
  }
  show () {
    this.setState({active: true});
  }
  handleClick () {
    this.state.active ? this.hide() : this.show();
  }
  handleWindowClick () {
    const node = findDOMNode(this);
    if(event.target !== node && !node.contains(event.target) && this.state.active)
      this.hide();
  }
  componentDidMount () {
    window.addEventListener('click', this.handleWindowClick);
    window.addEventListener('touchstart', this.handleWindowClick);
  }
  componentWillUnmount () {
    window.removeEventListener('click', this.handleWindowClick);
    window.removeEventListener('touchstart', this.handleWindowClick);
  }
  render () {
    const { active } = this.state;
    return (
      <Wrapper className={`${this.props.className}`}>
        <a href="javascript:void(0);" className="toggler fa fa-ellipsis-h" onClick={this.handleClick}></a>
        <Transition in={active} timeout={200}>
          {(status) => (
            <ActionsBox className={`fade fade-${status}`}>
              {this.props.children}
            </ActionsBox>
          )}
        </Transition>
      </Wrapper>
    )
  }
}
