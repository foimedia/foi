import React, { Component } from 'react';
import client from 'services/feathers';
import Loader from 'components/loader';
import StoryComponent from 'components/stories/story';
import Post from 'containers/post';

class Story extends Component {

  constructor (props) {
    super(props);
    this.state = {
      posts: []
    };
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
      return this.setState({ posts: newPosts });
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

  render () {
    const { story, posts } = this.state;
    if(story === undefined) {
      return <Loader size={20} />;
    } else if(posts !== undefined && posts.length) {
      return (
        <StoryComponent story={story} posts={posts}>
          {posts.map(post =>
            <Post key={`post-${post.id}`} post={post} />
          )}
        </StoryComponent>
      );
    } else {
      return null;
    }

  }

}

export default Story;
