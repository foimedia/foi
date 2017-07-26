import React, { Component } from 'react';
import styled from 'styled-components';

import styleUtils from 'services/style-utils';

const ContentWrapper = styled.section`
  margin: 4rem auto;
  transition: width 200ms ${styleUtils.transition};
  .loader {
    margin: 2rem auto;
  }
  #content-header {
    margin: 0 0 1rem;
    h2 {
      font-size: 2em;
    }
  }
  ${styleUtils.media.desktop`
    width: 500px;
    margin: 4rem auto;
    #content-header {
      margin: 0 0 2rem;
    }
  `}
  ${styleUtils.media.desktopHD`
    width: 600px;
  `}
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
