import React, { Component } from 'react';
import styled from 'styled-components';
import StoryFooter from './story-footer';
import Post from './post/index';

const StoryBox = styled.article`
  max-width: 600px;
  border: 1px solid #e6e6e6;
  margin: 0 auto 1rem;
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
`;

class Story extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  getPosts() {
    const { story } = this.props;
    return story.posts;
  }

  render() {
    const { story } = this.props;
    const posts = this.getPosts();
    return <StoryBox>
      {story.title &&
        <header className="story-header">
          <h2>{story.title}</h2>
        </header>
      }
      <section className="story-posts">
        {posts.map(post =>
          <Post key={post.id} post={post} />
        )}
      </section>
      <StoryFooter {...this.props} />
    </StoryBox>;

  }

}

export default Story;
