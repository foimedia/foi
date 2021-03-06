import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import styleUtils from 'services/style-utils';
// import Link from 'components/smart-link';
import Link from 'components/smart-link';
import TGLink from 'components/telegram-link';

const styles = css`
  font-family: 'Inconsolata', monospace;
  letter-spacing: 0.06em;
  display: inline-block;
  padding: .7rem 1.5rem;
  border: 1px solid ${styleUtils.color};
  border-radius: 2em;
  margin: 0 0 .5rem;
  cursor: pointer;
  font-size: .8em;
  text-transform: uppercase;
  text-decoration: none;
  text-align: center;
  line-height: 1;
  &:hover,
  &:active,
  &:focus {
    color: #333;
    border-color: ${styleUtils.color};
  }
  .fa {
    float: left;
    margin-right: 1rem;
    font-size: 1.3em;
    margin-left: -.4rem;
    margin-top: -.15rem;
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
  ${props => props.danger && css`
    background: #333;
    border-color: #333;
    color: #fff;
    &:hover,
    &:active,
    &:focus {
      border-color: #000;
      color: rgba(255,255,255,0.7);
    }
  `}
  ${props => props.small && css`
    padding: .3rem .7rem;
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
  margin: 0 auto 2rem;
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

export const ButtonLink = styled(({
  small, block, dark, danger, primary, ...rest
}) => (
  <Link {...rest} />
))`
  ${styles}
`;

export const InputButton = styled.input`
  ${styles}
`

export const TGButton = styled(({
  small, block, dark, danger, primary, ...rest
}) => (
  <TGLink {...rest} />
))`
  ${styles}
`;

export default Button;
