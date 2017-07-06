import React, { Component } from 'react';
import client from './feathers';
import Post from '../components/post';

class Timeline extends Component {

  render() {
    const { posts } = this.props;

    return <main>
      {posts.map(post => <Post key={post.id} post={post} />)}
    </main>;
  }

}

export default Timeline;
