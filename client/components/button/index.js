import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import styleUtils from 'services/style-utils';

const Button = styled.a`
  font-family: 'Inconsolata', monospace;
  letter-spacing: 0.06em;
  display: inline-block;
  padding: .5rem 1.5rem;
  border: 1px solid ${styleUtils.color};
  border-radius: ${styleUtils.radius}px;
  margin: 0 0 .5rem;
  cursor: pointer;
  font-size: .8em;
  text-transform: uppercase;
  text-align: center;
  &:hover {
    color: #333;
  }
  .fa {
    float: left;
    line-height: 1.3;
    font-size: 1.2em;
    margin-right: 1rem;
    margin-left: -.4rem;
  }
  ${props => props.primary && css`
    background: ${styleUtils.color};
    color: #fff;
    &:hover {
      color: rgba(255,255,255,0.7);
    }
  `}
  ${props => props.block && css`
    display: block;
  `}
`

export const ButtonGroup = styled.nav`
  display: block;
  max-width: 300px;
  margin: 0 auto;
  a {
    display: block;
    margin: 0 0 1rem;
  }
  ${styleUtils.media.phablet`
    max-width: none;
    a {
      display: inline-block;
      margin: 0 1rem 1rem 0rem;
    }
  `}
`

export default Button;
