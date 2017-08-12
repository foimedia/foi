import React, { Component } from 'react';
import { connect } from 'react-redux';
import { removeStory } from 'actions/stories';
import { canRemove } from 'services/stories';
import Loader from 'components/loader';
import StoryComponent from 'components/stories/story';
import Post from 'components/posts';

class Story extends Component {

  removeStory () {
    if(confirm('Are you sure you\'d like to remove this content?')) {
      this.props.removeStory(this.props.story.id);
    }
  }

  render () {
    const self = this;
    const { auth } = this.props;
    const { story, posts } = this.props;
    if(story !== undefined && posts !== undefined && posts.length) {
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

const getStoryPosts = (story, posts) => {
  return (story !== undefined && story.posts !== undefined) &&
    story.posts.map(id => posts[id]);
};

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.story;
  return {
    auth: state.auth,
    posts: getStoryPosts(state.stories[id], state.posts)
  }
}

const mapDispatchToProps = {
  removeStory
};

export default connect(mapStateToProps, mapDispatchToProps)(Story);
