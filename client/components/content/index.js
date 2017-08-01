import React, { Component } from 'react';
import styled from 'styled-components';
import styleUtils from 'services/style-utils';

const ContentWrapper = styled.section`
  max-width: 670px;
  margin: 2rem auto 0;
  transition: width 200ms ${styleUtils.transition};
  color: #444;
  ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
    margin-top: ${styleUtils.margins[i]}rem;
    padding-left: ${styleUtils.margins[i]}rem;
    padding-right: ${styleUtils.margins[i]}rem;
    h3 {
      padding: ${styleUtils.margins[i]*2}rem 0 0;
      margin: ${styleUtils.margins[i]*2}rem 0;
    }
  `)}
  .loader {
    margin: 2rem auto;
  }
  .content-section {
    background: #fff;
    border: 1px solid #e4e4e4;
    border-radius: ${styleUtils.radius/3}px;
    overflow: auto;
    font-size: .8em;
    h3 {
      font-size: .8em;
      color: #aaa;
      margin-top: 0;
      border-bottom: 1px solid #e4e4e4;
      .fa {
        color: #666;
      }
    }
    > :last-child {
      margin-bottom: 0;
    }
    ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
      padding: ${styleUtils.margins[i]}rem;
      margin: 0 0 ${styleUtils.margins[i]}rem;
      h3 {
        padding-bottom: ${styleUtils.margins[i]}rem;
        margin-bottom: ${styleUtils.margins[i]/2}rem;
        .fa {
          margin-right: ${styleUtils.margins[i]/2}rem;
        }
      }
    `)}
    ${styleUtils.media.tablet`
      h3 {
        font-size: 1em;
      }
    `}
  }
  ${styleUtils.media.tablet`
    font-size: 1.2em;
    margin-top: 4rem;
  `}
  ${styleUtils.media.desktop`
    max-width: 700px;
    margin-left: 35%;
    margin-right: 0;
    width: 55%;
  `}
  h3 {
    border-top: 1px solid #ccc;
    &:first-child {
      border-top: 0;
      padding-top: 0;
    }
  }
  ul,
  ol {
    max-width: 500px;
  }
  ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
    hr {
      margin: ${styleUtils.margins[i]*2}rem 0;
    }
  `)}
`;

class Content extends Component {

  render () {
    const { children } = this.props;
    if(children !== undefined) {
      return (
        <ContentWrapper id="content">
          {children}
        </ContentWrapper>
      );
    } else {
      return null;
    }
  }

};

export default Content;
