import React, { Component } from 'react';
import styled from 'styled-components';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import Transition from 'react-transition-group/Transition';

import client from 'services/feathers';
import styleUtils from 'services/style-utils';

import Loader from 'components/loader';

import Story from './components/story';

const StoriesWrapper = styled.section`
  .fade {
    transition: all 200ms ${styleUtils.transition};
  }
  .fade-entering, .fade-exited {
    transform: translate(0, -1.5rem);
    opacity: 0.01;
  }
  .fade-entered, .fade-exiting {
    transform: translate(0, 0);
    opacity: 1;
  }
`;

class Stories extends Component {

  constructor (props) {
    super(props);
    this.state = {
      query: Object.assign({}, props.query),
      stories: undefined
    };

    this.postService = client.service('posts');
    this.storyService = client.service('stories');

    this.newPost = this.newPost.bind(this);
    this.newStory = this.newStory.bind(this);
  }

  handlePosts (posts) {
    let storifiedPosts = [];
    if(posts.length) {
      posts.forEach(post => {
        storifiedPosts.push(this.storifyPost(post));
      });
    }
    return storifiedPosts;
  }

  storifyPost (post) {
    return {
      id: post.id,
      userId: post.userId,
      user: post.user,
      posts: [post],
      createdAt: post.sentAt
    };
  }

  fetchStories (query) {

    // Clear stories state before continuing
    this.setState({
      stories: undefined
    });

    const promises = [];

    // Stories
    promises.push(this.storyService.find({
      query: Object.assign({
        $sort: {
          createdAt: -1
        }
      }, query)
    }));

    // Posts not assigned to any story
    promises.push(this.postService.find({
      query: Object.assign({
        storyId: {
          $in: [undefined,null,false]
        },
        $sort: {
          sentAt: -1
        }
      }, query)
    }));

    return Promise.all(promises).then(res => {
      // Concat stories and storified posts
      const stories = res[0].data.concat(this.handlePosts(res[1].data));
      this.setState({
        // Set state with descending date sort
        stories: stories.sort((a,b) => {
          return -(new Date(a.createdAt) - new Date(b.createdAt))
        })
      });
      return Promise.resolve();
    });

  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextState.query !== this.state.query || nextState.stories !== this.state.stories;
  }

  matchQuery (data) {
    const { query } = this.state;
    let match = true;
    for(var key in query) {
      if(data[key] != query[key]) {
        match = false;
      }
    }
    return match;
  }

  newPost (newPost) {
    const { stories } = this.state;
    if(this.matchQuery(newPost)) {
      if(!newPost.storyId) {
        const newStories = stories.slice();
        newStories.unshift(this.storifyPost(newPost));
        return this.setState({stories: newStories});
      }
    }
  }

  newStory (newStory) {
    const { stories } = this.state;
    if(this.matchQuery(newStory)) {
      const newStories = stories.slice();
      newStories.unshift(newStory);
      return this.setState({stories: newStories});
    }
  }

  componentDidMount () {

    const { query } = this.state;

    this.fetchStories(query).then(() => {
      // Add new single-post story
      this.postService.on('created', this.newPost);
      // Add new story
      this.storyService.on('created', this.newStory);
    });

  }

  componentWillUnmount () {
    this.postService.off('created', this.newPost);
    this.storyService.off('created', this.newStory);
  }

  componentDidUpdate (prevProps, prevState) {
    const { query } = this.state;
    if(JSON.stringify(query) != JSON.stringify(prevState.query)) {
      this.fetchStories(query);
    }
  }

  render () {
    const { stories } = this.state;
    if(stories === undefined) {
      return <Loader size={20} />;
    } else if(!stories.length) {
      return <h2>No posts were found</h2>;
    } else {
      const items = stories.map(story => {
        return <Transition key={`story-${story.id}`} timeout={200}>
          {(status) => (
            <div className={`fade fade-${status}`}>
              <Story story={story} />
            </div>
          )}
        </Transition>;
      });
      return <StoriesWrapper className="stories">
        <TransitionGroup>
          {items}
        </TransitionGroup>
      </StoriesWrapper>;
    }
  }

}

export default Stories;
