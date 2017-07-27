import React, { Component } from 'react';
import styled from 'styled-components';

import styleUtils from 'services/style-utils';

const ContentWrapper = styled.section`
  max-width: 700px;
  margin: 1rem auto;
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
    margin: 4rem 0 4rem 35%;
    width: 55%;
    #content-header {
      margin: 0 0 2rem;
    }
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
