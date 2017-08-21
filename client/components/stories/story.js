import React, { Component } from 'react';
import styled from 'styled-components';
import Link from 'components/smart-link';
import styleUtils from 'services/style-utils';
import client from 'services/feathers';
import StoryFooter from './components/story-footer';

const Wrapper = styled.div`
  .block-link {
    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }
`

const StoryBox = styled.article`
  border: 1px solid #e4e4e4;
  margin: 0 0 .5rem;
  border-radius: ${styleUtils.radius/3}px;
  position: relative;
  z-index: 1;
  overflow: hidden;
  cursor: pointer;
  ${styleUtils.media.desktop`
    border-radius: ${styleUtils.radius/2}px;
  `}
  ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
    margin-bottom: ${styleUtils.margins[i]}rem;
  `)}
  :hover {
    border-color: #ddd;
    background: #fff;
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
  .story-content {
    min-height: 25px;
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
      <Wrapper>
        <Link to={`/c/${story.chatId}/s/${story.id}`} block className="block-link">
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
        </Link>
      </Wrapper>
    )
  }

}

export default Story;
