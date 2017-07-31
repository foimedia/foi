import React, { Component } from 'react';
import styled from 'styled-components';
import styleUtils from 'services/style-utils';
import client from 'services/feathers';
import StoryFooter from './components/story-footer';

const StoryBox = styled.article`
  border: 1px solid #e4e4e4;
  margin: 0 0 .5rem;
  border-radius: ${styleUtils.radius/3}px;
  position: relative;
  z-index: 1;
  overflow: hidden;
  ${styleUtils.media.desktop`
    border-radius: ${styleUtils.radius/2}px;
  `}
  ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
    margin-bottom: ${styleUtils.margins[i]}rem;
  `)}
  :hover {
    border-color: #ddd;
  }
  .story-header {
    padding: 1.5rem;
    ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
      padding: ${styleUtils.margins[i]}rem;
    `)}
    h2 {
      margin: 0;
    }
    border-bottom: 1px solid #eee;
  }
  .post {
    margin: 0 0 .5rem;
    ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
      margin-bottom: ${styleUtils.margins[i]}rem;
    `)}
    &:last-child {
      margin: 0;
    }
    .loader {
      margin: 2rem auto;
    }
  }
`;

class Story extends Component {

  render () {
    const { story } = this.props;
    return (
      <StoryBox id={`story-${story.id}`} className="story-item">
        {story.title &&
          <header className="story-header">
            <h2>{story.title}</h2>
          </header>
        }
        <section className="story-content">
          {this.props.children}
        </section>
        <StoryFooter {...this.props} />
      </StoryBox>
    )
  }

}

export default Story;
