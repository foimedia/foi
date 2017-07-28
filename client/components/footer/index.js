import React, { Component } from 'react';
import styled from 'styled-components';
import styleUtils from 'services/style-utils';

const FooterWrapper = styled.footer`
  font-family: 'Inconsolata', monospace;
  text-transform: uppercase;
  margin: 4rem auto;
  color: #999;
  font-size: .7em;
  text-align: center;
  max-width: 700px;
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
      margin: 0 1rem;
    }
    img {
      max-height: 1rem;
    }
  }
  ${styleUtils.media.desktop`
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
  ${styleUtils.media.desktop`
    margin: 4rem 0 4rem 35%;
    width: 55%;
  `}
`

export default class Footer extends Component {
  render() {
    return (
      <FooterWrapper>
        <nav>
          <a href="https://github.com/miguelpeixe/foi/issues/new" rel="external" target="_blank">File an issue</a>
          <a href="https://github.com/miguelpeixe/foi" rel="external" target="_blank">Source code</a>
          <a href="https://foi.media" rel="external" target="_blank"><img src={require('images/logo.svg')} /></a>
        </nav>
      </FooterWrapper>
    )
  }
};
