import React, { Component } from 'react';
import styled from 'styled-components';
import styleUtils from 'services/style-utils';

const Wrapper = styled.header`
  font-family: "Inconsolata", monospace;
  color: #000;
  ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
    padding-top: ${styleUtils.margins[i]}rem;
    padding-left: ${styleUtils.margins[i]}rem;
    padding-right: ${styleUtils.margins[i]}rem;
    margin-bottom: ${styleUtils.margins[i]}rem;
    h2 {
      margin-bottom: ${styleUtils.margins[i]/2}rem;
    }
  `)}
  ${styleUtils.media.tablet`
    padding: 0;
  `}
  ${styleUtils.media.desktop`
    width: 100%;
    display: table;
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
    margin-top: .5rem;
  }
`

export default class ContentHeader extends Component {
  render () {
    return (
      <Wrapper id="content-header">
        <div>
          {this.props.children}
        </div>
      </Wrapper>
    )
  }
}
