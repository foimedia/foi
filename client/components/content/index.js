import React, { Component } from 'react';
import styled from 'styled-components';
import styleUtils from 'services/style-utils';

const ContentWrapper = styled.section`
  max-width: 670px;
  margin: 2rem auto 0;
  transition: width 200ms ${styleUtils.transition};
  color: #444;
  font-size: 1.2rem;
  min-height: 80%;
  ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
    padding-left: ${styleUtils.margins[i]}rem;
    padding-right: ${styleUtils.margins[i]}rem;
  `)}
  .loader {
    margin: 2rem auto;
  }
  .content-section {
    margin: 0 0 2rem;
    background: #f9f9f9;
    border: 1px solid #eee;
    border-radius: ${styleUtils.radius/3}px;
    overflow: auto;
    font-size: .8em;
    ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
      padding: ${styleUtils.margins[i]}rem;
      h3 {
        margin-bottom: ${styleUtils.margins[i]}rem;
      }
    `)}
    h3 {
      margin-top: 0;
    }
    > :last-child {
      margin-bottom: 0;
    }
  }
  ${styleUtils.media.tablet`
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
    color: #999;
    padding: 2rem 0 0;
    margin: 2rem 0;
    &:first-child {
      border-top: 0;
      padding: 0;
    }
  }
  ul,
  ol {
    max-width: 500px;
  }
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
