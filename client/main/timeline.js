import React, { Component } from 'react';
import client from './feathers';
import Story from '../components/story';

class Timeline extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  updatePosts() {

    const { stories, posts } = this.props;

    if(posts.length) {
      posts.forEach(post => {
        stories.push({
          id: post.id,
          userId: post.userId,
          posts: [post],
          createdAt: post.sentAt
        });
      });
    }
    stories.sort((a,b) => {
      return -(a.createdAt - b.createdAt);
    });

  }

  componentDidMount() {
    const { stories, posts } = this.props;
    this.updatePosts();
    this.setState({ stories });
  }

  render() {
    const { stories } = this.state;
    if(stories && stories.length) {
      return <section className="stories">
        {stories.map(story =>
          (story.posts && story.posts.length) &&
            <Story key={story.id} story={story} />
        )}
      </section>;
    } else {
      return null;
    }
  }

}

export default Timeline;
