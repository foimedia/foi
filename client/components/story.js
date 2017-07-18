import { client } from '../main/feathers';
import React, { Component } from 'react';
import styled from 'styled-components';
import StoryFooter from './story-footer';
import Post from './post/index';
import styleUtils from '../style-utils';
// import Transition from 'react-transition-group/Transition';

const StoryBox = styled.article`
  border: 1px solid #e6e6e6;
  margin: 0 0 .5rem;
  border-radius: ${styleUtils.radius}px;
  ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
    margin-bottom: ${styleUtils.margins[i]}rem;
  `)}
  :hover {
    border-color: #d6d6d6;
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

  constructor (props) {
    super(props);
    this.state = {};
    this.storyService = client.service('stories');
    this.postService = client.service('posts');
    this.updateStory = this.updateStory.bind(this);
    this.newStoryPost = this.newStoryPost.bind(this);
  }

  getPosts () {
    const { story } = this.state;
    if(story !== undefined && story.posts && story.posts.length)
      return story.posts;
    else
      return [];
  }

  updateStory (newStory) {
    const { story } = this.props;
    if(newStory.id == story.id) {
      this.setState({ story: newStory });
    }
  }

  newStoryPost (newPost) {
    const { story } = this.state;
    if(newPost.storyId == story.id) {
      const { posts } = this.state;
      const newPosts = posts.slice();
      newPosts.push(newPost);
      return this.setState({posts: newPosts});
    }
  }

  componentDidMount () {

    const { story } = this.props;

    this.setState({
      story: Object.assign({}, story),
      posts: Array.isArray(story.posts) ? story.posts.slice() : []
    });

    this.storyService.on('patched', this.updateStory);
    this.storyService.on('updated', this.updateStory);
    this.postService.on('created', this.newStoryPost);
  }

  componentWillUnmount () {
    this.storyService.off('patched', this.updateStory);
    this.storyService.off('updated', this.updateStory);
    this.postService.off('created', this.newStoryPost);
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
