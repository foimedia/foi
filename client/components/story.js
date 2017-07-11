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
`;

class Story extends Component {

  constructor (props) {
    super(props);
    this.state = {};
  }

  getPosts () {
    const { story } = this.state;
    if(story !== undefined && story.posts && story.posts.length)
      return story.posts;
    else
      return [];
  }

  componentDidMount () {

    const { story } = this.props;

    this.setState({
      story: Object.assign({}, story),
      posts: Array.isArray(story.posts) ? story.posts.slice() : []
    });

    const storyService = client.service('stories');
    const postService = client.service('posts');
    storyService.on('patched', patchedStory => {
      if(patchedStory.id == story.id) {
        this.setState({ story: patchedStory });
      }
    });
    postService.on('created', newPost => {
      const { story } = this.state;
      if(newPost.storyId == story.id) {
        const { posts } = this.state;
        const newPosts = posts.slice();
        newPosts.push(newPost);
        return this.setState({posts: newPosts});
      }
    });
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.story !== this.state.story;
  }

  render () {
    const { story, posts } = this.state;
    if(story === undefined) {
      return <p>Loading story...</p>;
    } else if(posts !== undefined && posts.length) {
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
        <StoryFooter story={story} posts={posts} />
      </StoryBox>;
    } else {
      return null;
    }

  }

}

export default Story;
