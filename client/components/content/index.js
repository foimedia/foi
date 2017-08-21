import React, { Component } from 'react';
import styled from 'styled-components';
import styleUtils from 'services/style-utils';

const ContentWrapper = styled.section`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  color: #444;
  box-sizing: border-box;
  ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
    h3 {
      padding: ${styleUtils.margins[i]*2}rem 0 0;
      margin: ${styleUtils.margins[i]*2}rem 0;
    }
  `)}
  .loader {
    margin: 1rem auto;
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
      font-weight: 700;
      margin-top: 0;
      border-bottom: 1px solid #e4e4e4;
      .fa {
        color: ${styleUtils.color};
      }
    }
    > :last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: 0;
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
    ${styleUtils.media.desktop`
      border-radius: ${styleUtils.radius/2}px;
    `}
  }
  ${styleUtils.media.tablet`
    font-size: 1.2em;
    padding: 4% 15%;
  `}
  ${styleUtils.media.desktop`
    margin-right: 0;
    padding: 0 4rem 0 8rem;
  `}
  ${styleUtils.media.desktopHD`
    margin-right: 0;
    padding: 0 10rem;
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
`;

class Content extends Component {

  render () {
    const { children } = this.props;
    if(children !== undefined) {
      return (
        <ContentWrapper id="content" className="scrollable">
          {children}
        </ContentWrapper>
      );
    } else {
      return null;
    }
  }

};

export default Content;
