import React, { Component } from 'react';
import Story from '../components/story';
import { client } from './feathers';

class Timeline extends Component {

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
      return <main>
        <h1>Loading</h1>
      </main>;
    } else if(!stories.length) {
      return <main>
        <h1>No posts were found</h1>
      </main>;
    } else {
      return <section className="stories">
        {stories.map(story =>
          (story.posts && story.posts.length) &&
            <Story key={`story-${story.id}`} story={story} />
        )}
      </section>;
    }
  }

}

export default Timeline;
