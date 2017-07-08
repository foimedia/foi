import { client } from '../main/feathers';
import React, { Component } from 'react';
import styled from 'styled-components';
import StoryFooter from './story-footer';
import Post from './post/index';
// import Transition from 'react-transition-group/Transition';

const StoryBox = styled.article`
  border: 1px solid #e6e6e6;
  margin: 0 0 1rem;
  border-radius: 3px;
  box-shadow: 0 0 5px rgba(0,0,0,0.05);
  :hover {
    border-color: #d6d6d6;
    box-shadow: 0 0 8px rgba(0,0,0,0.08);
  }
  .story-header {
    padding: 2rem;
    h2 {
      margin: 0;
    }
    border-bottom: 1px solid #eee;
  }
  .post {
    margin: 0 0 1rem;
    &:last-child {
      margin: 0;
    }
    p {
      margin: 0;
    }
  }
  .example-enter {
    opacity: 0.01;
  }

  .example-enter.example-enter-active {
    opacity: 1;
    transition: opacity 500ms ease-in;
  }

  .example-leave {
    opacity: 1;
  }

  .example-leave.example-leave-active {
    opacity: 0.01;
    transition: opacity 300ms ease-in;
  }
`;

class Story extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  getPosts() {
    const { story } = this.state;
    if(story !== undefined && story.posts && story.posts.length)
      return story.posts;
    else
      return [];
  }

  componentDidMount() {
    const { story } = this.props;
    const storyService = client.service('stories');
    this.setState({ story });
    storyService.on('patched', patchedStory => {
      if(patchedStory.id == story.id) {
        this.setState({ story: patchedStory });
      }
    });
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.story !== this.state.story;
  }

  render() {
    const { story } = this.state;
    if(story === undefined) {
      return <p>Loading story...</p>;
    } else {
      const posts = this.getPosts();
      return <StoryBox>
        {story.title &&
          <header className="story-header">
            <h2>{story.title}</h2>
          </header>
        }
        <section className="story-posts">
          {posts.map(post =>
            <Post key={`post-${post.id}`} post={post} />
          )}
        </section>
        <StoryFooter {...this.props} />
      </StoryBox>;
    }

  }

}

export default Story;
