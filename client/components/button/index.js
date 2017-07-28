import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import styleUtils from 'services/style-utils';
import { Link } from 'react-router-dom';

const styles = css`
  font-family: 'Inconsolata', monospace;
  letter-spacing: 0.06em;
  display: inline-block;
  padding: .5rem 1.5rem;
  border: 1px solid ${styleUtils.color};
  border-radius: 2em;
  margin: 0 0 .5rem;
  cursor: pointer;
  font-size: .8em;
  text-transform: uppercase;
  text-align: center;
  &:hover,
  &:active,
  &:focus {
    color: #333;
    border-color: ${styleUtils.color};
  }
  .fa {
    float: left;
    margin-right: 1rem;
    font-size: 1.5em;
    margin-left: -.8rem;
    line-height: 1;
  }
  ${props => props.primary && css`
    background: ${styleUtils.color};
    color: #fff;
    &:hover,
    &:active,
    &:focus {
      border-color: ${styleUtils.color};
      color: rgba(255,255,255,0.7);
    }
  `}
  ${props => props.small && css`
    padding: .2rem 1rem;
  `}
  ${props => props.block && css`
    display: block;
  `}
  ${props => props.dark && css`
    border-color: #444;
    color: #fff;
    &:hover,
    &:active,
    &:focus {
      color: #aaa;
      border-color: #444;
      .fa {
        color: ${styleUtils.color};
      }
    }
  `}
`

const Button = styled.a`
  ${styles}
`

export const ButtonGroup = styled.nav`
  display: block;
  margin: 0 auto;
  a {
    display: block;
    margin: 0 0 1rem;
    &:last-child {
      margin: 0;
    }
  }
  ${styleUtils.media.phablet`
    max-width: none;
    a {
      display: inline-block;
      margin: 0 2rem 0 0rem;
    }
  `}
  ${props => props.alignright && css`
    ${styleUtils.media.phablet`
      text-align: right;
    `}
  `}
`

export const ButtonLink = styled(Link)`
  ${styles}
`

export default Button;
