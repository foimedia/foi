import React, { Component } from 'react';
import styled from 'styled-components';

import styleUtils from 'services/style-utils';

const ContentWrapper = styled.section`
  margin: 4rem auto;
  transition: width 200ms ${styleUtils.transition};
  ${styleUtils.media.desktop`
    width: 500px;
  `}
  ${styleUtils.media.desktopHD`
    width: 670px;
  `}
  .loader {
    margin: 2rem auto;
  }
  #content-header {
    margin: 0 0 2rem;
    line-height: 1;
    h2 {
      font-size: 2em;
    }
  }
`;

class Content extends Component {

  render () {
    const { children } = this.props;
    if(children !== undefined) {
      return <ContentWrapper id="content">
        {children}
      </ContentWrapper>;
    } else {
      return null;
    }
  }

};

export default Content;
