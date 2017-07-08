import React, { Component } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { client } from '../../main/feathers';

import PostText from './post-text';
import PostPhoto from './post-photo';
import PostAudio from './post-audio';
import PostVideo from './post-video';
import PostLocation from './post-location';

class Post extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { post } = this.props;
    const postService = client.service('posts');
    this.setState({ post });
    postService.on('patched', patchedPost => {
      if(patchedPost.id == post.id) {
        console.log(this);
        this.setState({ post: patchedPost });
      }
    });
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.post !== this.state.post;
  }

  render() {

    const { post } = this.state;

    if(post == undefined) {
      return <p>Loading post</p>;
    } else {
      return <section className="post">
        {post.type == 'text' &&
          <PostText data={post.content} />
        }
        {post.type == 'photo' || post.type == 'sticker' &&
          <PostPhoto data={post.media} />
        }
        {(post.type == 'audio' || post.type == 'voice') &&
          <PostAudio data={post.media} type={post.type} />
        }
        {(post.type == 'video' || post.type == 'video_note') &&
          <PostVideo data={post.media} type={post.type} />
        }
        {post.type == 'location' &&
          <PostLocation data={post.content} />
        }
      </section>;
    }
  }

}

export default Post;
