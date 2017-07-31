import React, { Component } from 'react';
import styled from 'styled-components';
import styleUtils from 'services/style-utils';

const Wrapper = styled.header`
  width: 100%;
  color: #000;
  margin-bottom: 2rem;
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
    font-size: 1.7em;
  }
  p.description {
    font-size: .9em;
    color: #999;
    font-family: "Inconsolata", monospace;
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
