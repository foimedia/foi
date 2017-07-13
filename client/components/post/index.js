import React, { Component } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import ReactLoading from 'react-loading';
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
    this.setState({ post: Object.assign({}, post) });
    postService.on('patched', patchedPost => {
      if(patchedPost.id == post.id) {
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
      return <ReactLoading className="loader" type={'bubbles'} color={'#999'} width="30" height="30" />;
    } else {
      return <article className="post">
        {post.type == 'text' &&
          <PostText data={post.content} />
        }
        {(post.type == 'location' || post.type == 'venue') &&
          <PostLocation data={post.content} />
        }
        {(post.type == 'photo' || post.type == 'sticker') &&
          <PostPhoto data={post.media} caption={post.content} />
        }
        {(post.type == 'video' || post.type == 'video_note') &&
          <PostVideo data={post.media} caption={post.content} type={post.type} />
        }
        {(post.type == 'audio' || post.type == 'voice') &&
          <PostAudio data={post.media} />
        }
        {(post.type == 'document') &&
          <ReactLoading className="loader" type={'bubbles'} color={'#999'} width="30" height="30" />
        }
      </article>;
    }
  }

}

export default Post;
