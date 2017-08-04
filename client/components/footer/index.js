import React, { Component } from 'react';
import styled from 'styled-components';
import styleUtils from 'services/style-utils';

const FooterWrapper = styled.footer`
  font-family: 'Inconsolata', monospace;
  text-transform: uppercase;
  color: #999;
  font-size: .7em;
  text-align: center;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
    margin-bottom: ${styleUtils.margins[i]*2}rem;
    padding-left: ${styleUtils.margins[i]}rem;
    padding-right: ${styleUtils.margins[i]}rem;
    hr {
      margin: ${styleUtils.margins[i]*2}rem 0;
    }
  `)}
  &:after {
    content: "";
    display: table;
    clear: both;
  }
  nav {
    line-height: 1rem;
    a,
    img {
      display: inline-block;
    }
    a {
      margin: 0 1rem 1rem;
      font-weight: 700;
    }
    img {
      max-height: 1rem;
    }
  }
  ${styleUtils.media.desktop`
    margin-left: 35%;
    width: 55%;
    text-align: inherit;
    p {
      float: left;
    }
    nav {
      float: right;
      a {
        margin: 0 0 0 1rem;
        float: left;
      }
    }
  `}
`

export default class Footer extends Component {
  render() {
    console.log(foi);
    return (
      <FooterWrapper>
        <hr/>
        <nav>
          <a href="https://github.com/miguelpeixe/foi/issues/new" rel="external" target="_blank">File an issue</a>
          <a href="https://github.com/miguelpeixe/foi" rel="external" target="_blank">Source code</a>
          <a href={`https://github.com/miguelpeixe/foi/tree/${foi.VERSION}`} rel="external" target="_blank">
            Version {foi.VERSION}
          </a>
          <a href="https://foi.media" rel="external" target="_blank"><img src={require('images/logo.svg')} /></a>
        </nav>
      </FooterWrapper>
    )
  }
};
