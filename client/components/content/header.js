import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import styleUtils from 'services/style-utils';

const Wrapper = styled.header`
  font-family: "Inconsolata", monospace;
  color: #000;
  background: #fff;
  border-bottom: 1px solid #e4e4e4;
  ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
    margin: -${styleUtils.margins[i]}rem;
    padding-left: ${styleUtils.margins[i]*2}rem;
    padding-right: ${styleUtils.margins[i]*2}rem;
    padding-top: ${styleUtils.margins[i]}rem;
    padding-bottom: ${styleUtils.margins[i]}rem;
    margin-bottom: ${styleUtils.margins[i]}rem;
    h2,
    .header-icon {
      padding-top: ${styleUtils.margins[i]/2}rem;
      padding-bottom: ${styleUtils.margins[i]/2}rem;
    }
  `)}
  ${styleUtils.media.tablet`
    margin-top: 0;
    margin-left: 0;
    margin-right: 0;
    padding: 0;
    background: transparent;
    border-bottom: 0;
  `}
  ${styleUtils.media.desktop`
    display: table;
    table-layout: auto;
    height: 14rem;
    margin-top: -4rem;
    margin-bottom: 0;
    .header-container {
      display: table-cell;
      vertical-align: middle;
      > div {
        height: 3rem;
      }
    }
    h2 {
      font-size: 2em;
    }
  `}
  .header-icon {
    display: none;
    ${styleUtils.media.desktop`
      display: table-cell;
      vertical-align: middle;
      font-size: 2rem;
      width: 2rem;
      padding-right: 3rem;
      line-height: 1;
      text-align: center;
      color: ${styleUtils.color};
    `}
  }
  h2 {
    font-size: 1.3em;
    a {
      color: inherit;
      &:hover,
      &:active,
      &:focus {
        color: #000;
      }
    }
  }
  p.description {
    color: #666;
  }
  nav {
    font-size: .7em;
    a {
      background: #fff;
      padding-top: .25rem;
      padding-bottom: .25rem;
      border-radius: ${styleUtils.radius/3}px;
      text-transform: uppercase;
      display: inline-block;
      border: 1px solid #e4e4e4;
      color: #999;
      &:hover,
      &:active,
      &:focus {
        color: #333;
      }
      &.active {
        background: ${styleUtils.color};
        color: #fff;
        border-color: transparent;
      }
    }
    ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
      a {
        margin-right: ${styleUtils.margins[i]/3}rem;
        padding-left: ${styleUtils.margins[i]/2}rem;
        padding-right: ${styleUtils.margins[i]/2}rem;
        .fa {
          margin-right: ${styleUtils.margins[i]/2}rem;
        }
      }
    `)}
  }
  ${props => props.icon && css`
    ${styleUtils.media.desktop`
      margin-left: -5rem;
    `}
  `}
  ${props => props.inner && css`
    margin-top: 0;
    height: auto;
    ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
      margin-bottom ${styleUtils.margins[i]}rem;
    `)}
    ${styleUtils.media.desktop`
      margin-top: 0;
      height: auto;
      .header-container {
        > div {
          height: auto;
        }
      }
    `}
  `}
`

export default class ContentHeader extends Component {
  render () {
    const { ...props } = this.props;
    return (
      <Wrapper id={props.inner ? null : 'content-header'} {...props}>
        {props.icon &&
          <span className={`header-icon fa fa-${props.icon}`}></span>
        }
        <div className="header-container">
          <div>
            {this.props.children}
          </div>
        </div>
      </Wrapper>
    )
  }
}
