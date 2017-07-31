import React, { Component } from 'react';
import styled from 'styled-components';
import styleUtils from 'services/style-utils';

const Wrapper = styled.header`
  font-family: "Inconsolata", monospace;
  width: 100%;
  color: #000;
  ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
    margin-bottom: ${styleUtils.margins[i]}rem;
  `)}
  ${styleUtils.media.desktop`
    display: table;
    height: 14rem;
    margin-top: -4rem;
    margin-bottom: 0;
    > div {
      display: table-cell;
      vertical-align: middle;
    }
  `}
  h2 {
    font-size: 1.8em;
  }
  p.description {
    color: #666;
    margin-top: .5rem;
  }
`

export default class ContentHeader {
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
