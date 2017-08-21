import React, { Component } from 'react';
import styled from 'styled-components';
import styleUtils from 'services/style-utils';

const FooterWrapper = styled.footer`
  display: flex;
  flex: 0 0 auto;
  flex-shrink: 0;
  justify-content: flex-end;
  font-family: 'Inconsolata', monospace;
  text-transform: uppercase;
  color: #999;
  font-size: .7em;
  text-align: right;
  box-sizing: border-box;
  z-index: 10;
  width: 100%;
  border-top: 1px solid #ddd;
  ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
    padding: ${styleUtils.margins[i]}rem ${styleUtils.margins[i]*2}rem;
  `)}
  nav {
    display: block;
    float: right;
    line-height: 1rem;
    a,
    img {
      float: left;
      line-height: 1rem;
      display: inline-block;
    }
    a {
      margin: 0 0 0 1rem;
      font-weight: 700;
    }
    img {
      max-height: 1rem;
    }
  }
`

export default class Footer extends Component {
  render() {
    return (
      <FooterWrapper>
        <nav>
          <a href="https://github.com/miguelpeixe/foi/issues/new" rel="external" target="_blank">File an issue</a>
          <a href={`https://github.com/miguelpeixe/foi/tree/${foi.VERSION}`} rel="external" target="_blank">
            Version {foi.VERSION}
          </a>
          <a href="https://foi.media" rel="external" target="_blank"><img src={require('images/logo.svg')} /></a>
        </nav>
      </FooterWrapper>
    )
  }
};
