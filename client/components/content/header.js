import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import styleUtils from 'services/style-utils';

const Wrapper = styled.header`
  font-family: "Inconsolata", monospace;
  color: #000;
  ${props => props.icon && css`
    ${styleUtils.media.desktop`
      margin-left: -4rem;
    `}
  `}
  ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
    padding-left: ${styleUtils.margins[i]}rem;
    padding-right: ${styleUtils.margins[i]}rem;
    margin-bottom: ${styleUtils.margins[i]}rem;
    h2,
    .header-icon {
      padding-top: ${styleUtils.margins[i]}rem;
      padding-bottom: ${styleUtils.margins[i]}rem;
    }
  `)}
  ${styleUtils.media.tablet`
    padding: 0;
  `}
  ${styleUtils.media.desktop`
    width: 100%;
    display: table;
    table-layout: auto;
    height: 14rem;
    margin-top: -4rem;
    margin-bottom: 0;
    > div {
      display: table-cell;
      vertical-align: middle;
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
      padding-right: 2rem;
      line-height: 1;
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
    ${styleUtils.media.desktop`
      height: 0;
    `}
  }
  nav {
    font-size: .7em;
    ${styleUtils.media.desktop`
      height: 0;
    `}
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
      .fa {
      }
    }
    ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
      a {
        margin-right: ${styleUtils.margins[i]/2}rem;
        padding-left: ${styleUtils.margins[i]/2}rem;
        padding-right: ${styleUtils.margins[i]/2}rem;
        .fa {
          margin-right: ${styleUtils.margins[i]/2}rem;
        }
      }
    `)}
  }
`

export default class ContentHeader extends Component {
  render () {
    const { icon } = this.props;
    return (
      <Wrapper id="content-header" icon={icon}>
        {icon !== undefined &&
          <span className={`header-icon fa fa-${icon}`}></span>
        }
        <div>
          {this.props.children}
        </div>
      </Wrapper>
    )
  }
}
