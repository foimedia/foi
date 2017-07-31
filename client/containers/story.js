import React, { Component } from 'react';
import { connect } from 'react-redux';
import client from 'services/feathers';
import { canRemove } from 'services/stories';
import Loader from 'components/loader';
import StoryComponent from 'components/stories/story';
import Post from 'containers/post';

class Story extends Component {

  constructor (props) {
    super(props);
    this.state = {
      posts: []
    };
    this.service = client.service('stories');
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

  removeStory () {
    if(confirm('Are you sure you\'d like to remove this content?')) {
      this.service.remove(this.state.story.id);
    }
  }

  componentDidMount () {

    const { story } = this.props;

    this.setState({
      story: Object.assign({}, story),
      posts: Array.isArray(story.posts) ? story.posts.slice() : []
    });

    this.service.on('patched', this.updateStory);
    this.service.on('updated', this.updateStory);
    this.postService.on('created', this.newStoryPost);
  }

  componentWillUnmount () {
    this.service.off('patched', this.updateStory);
    this.service.off('updated', this.updateStory);
    this.postService.off('created', this.newStoryPost);
  }

  render () {
    const self = this;
    const { auth } = this.props;
    const { story, posts } = this.state;
    if(story === undefined) {
      return <Loader size={20} />;
    } else if(posts !== undefined && posts.length) {
      return (
        <StoryComponent
          story={story}
          posts={posts}
          canRemove={canRemove(story, auth)}
          remove={remove => self.removeStory() }>
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

const mapStateToProps = (state) => {
  return { auth: state.auth }
}

export default connect(mapStateToProps)(Story);
