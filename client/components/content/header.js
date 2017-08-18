import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import styleUtils from 'services/style-utils';

const Wrapper = styled.header`
  font-family: "Inconsolata", monospace;
  color: #000;
  background: #fff;
  border-bottom: 1px solid #eee;
  ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
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
    padding-top: 4rem;
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
    font-size: .8em;
    border-top: 1px solid #eee;
    background: #fff;
    a {
      background: #fff;
      padding-top: .25rem;
      padding-bottom: .25rem;
      text-transform: uppercase;
      display: inline-block;
      margin: -1px 0 0;
      border-top: 1px solid #eee;
      border-right: 1px solid #eee;
      color: #999;
      &:hover,
      &:active,
      &:focus {
        color: #333;
      }
      &.active {
        background: ${styleUtils.color};
        border-color: ${styleUtils.color};
        color: #fff;
      }
    }
    ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
      margin-left: -${styleUtils.margins[i]*2}rem;
      margin-right: -${styleUtils.margins[i]*2}rem;
      margin-bottom: -${styleUtils.margins[i]}rem;
      margin-top: ${styleUtils.margins[i]}rem;
      padding: 0;
      a {
        padding: ${styleUtils.margins[i]}rem ${styleUtils.margins[i]*2}rem;
        .fa {
          margin-right: ${styleUtils.margins[i]/2}rem;
        }
      }
    `)}
    ${styleUtils.media.tablet`
      font-size: .7em;
      border-top: 0;
      background: transparent;
      margin: .5rem 0 0;
      padding: 0;
      a {
        border: 0;
        margin: 0 1rem 0 0;
        padding: .5rem 1.5rem;
        border-radius: ${styleUtils.radius/3}px;
      }
    `}
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
