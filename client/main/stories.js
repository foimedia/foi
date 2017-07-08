import { client } from './feathers';
import React, { Component } from 'react';
import styled from 'styled-components';
import Story from '../components/story';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import Transition from 'react-transition-group/Transition';

const StoriesWrapper = styled.section`
  max-width: 600px;
  margin: 0 auto;
  .fade {
    transition: all 200ms linear;
  }
  .fade-entering, .fade-exited {
    transform: translate(0, -2rem);
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

    const posts = client.service('posts');
    const stories = client.service('stories');

    const promises = [];

    // Stories
    promises.push(stories.find({
      query: {
        $sort: {
          createdAt: -1
        }
      }
    }));

    // Posts not assigned to any story
    promises.push(posts.find({
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

    const posts = client.service('posts');
    const stories = client.service('stories');

    this.fetchStories();

    // Add new post
    posts.on('created', newPost => {
      const newStories = this.state.stories.slice();
      if(!newPost.storyId) {
        newStories.unshift(this.storifyPost(newPost));
        return this.setState({stories: newStories});
      } else {
        newStories.forEach((story, i) => {
          if(newPost.storyId == story.id) {
            newStories[i].posts = newStories[i].posts || [];
            newStories[i].posts.push(newPost);
          }
        });
        return this.setState({stories: newStories});
      }
    });

    // Add new story
    stories.on('created', newStory => {
      const newStories = this.state.stories.slice();
      newStories.unshift(newStory);
      return this.setState({stories: newStories});
    });

  }

  render () {
    const { stories } = this.state;
    if(stories === undefined) {
      return <h2>Loading</h2>;
    } else if(!stories.length) {
      return <h2>No posts were found</h2>;
    } else {
      const items = stories.map(story => {
        if(story.posts && story.posts.length) {
          return <Transition key={`story-${story.id}`} timeout={200}>
            {(status) => (
              <div className={`fade fade-${status}`}>
                <Story story={story} />
              </div>
            )}
          </Transition>;
        }
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
