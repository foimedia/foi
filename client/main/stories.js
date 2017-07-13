import { client } from './feathers';
import React, { Component } from 'react';
import styled from 'styled-components';
import Story from '../components/story';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import Transition from 'react-transition-group/Transition';
import ReactLoading from 'react-loading';

const StoriesWrapper = styled.section`
  max-width: 500px;
  margin: 0 auto;
  .fade {
    transition: all 200ms linear;
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
    this.state = {};
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

  fetchStories () {

    const storyService = client.service('stories');
    const postService = client.service('posts');

    const promises = [];

    // Stories
    promises.push(storyService.find({
      query: {
        $sort: {
          createdAt: -1
        }
      }
    }));

    // Posts not assigned to any story
    promises.push(postService.find({
      query: {
        storyId: {
          $in: [false,undefined,null]
        },
        $sort: {
          sentAt: -1
        }
      }
    }));

    Promise.all(promises).then(res => {
      // Concat stories and storified posts
      const stories = res[0].data.concat(this.handlePosts(res[1].data));
      this.setState({
        // Set state with descending date sort
        stories: stories.sort((a,b) => {
          return -(new Date(a.createdAt) - new Date(b.createdAt))
        })
      });
    });

  }

  componentDidMount () {

    const postService = client.service('posts');
    const storyService = client.service('stories');

    this.fetchStories();

    // Add new single-post story
    postService.on('created', newPost => {
      const { stories } = this.state;
      if(!newPost.storyId) {
        const newStories = stories.slice();
        newStories.unshift(this.storifyPost(newPost));
        return this.setState({stories: newStories});
      }
    });

    // Add new story
    storyService.on('created', newStory => {
      const { stories } = this.state;
      const newStories = stories.slice();
      newStories.unshift(newStory);
      return this.setState({stories: newStories});
    });

  }

  render () {
    const { stories } = this.state;
    if(stories === undefined) {
      return <ReactLoading className="loader" type={'bubbles'} color={'#999'} width="50" height="50" />;
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
