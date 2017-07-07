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
  p {
    margin: 0;
  }
`;

class Story extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  getPosts() {
    const { posts } = this.props;
    if(!Array.isArray()) {
      return [posts];
    } else {
      return posts;
    }
  }

  render() {
    const posts = this.getPosts();
    return <StoryBox>
      {posts.map(post => <Post key={post.id} post={post} />)}
      <StoryFooter posts={posts} />
    </StoryBox>;

  }

}

export default Story;
