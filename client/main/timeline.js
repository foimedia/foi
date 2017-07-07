import React, { Component } from 'react';
import client from './feathers';
import Story from '../components/story';

class Timeline extends Component {

  render() {
    const { posts } = this.props;

    return <main>
      {posts.map(post => <Story key={post.id} posts={post} />)}
    </main>;
  }

}

export default Timeline;
