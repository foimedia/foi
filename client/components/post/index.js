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
    this.service = client.service('posts');
    this.updatePost = this.updatePost.bind(this);
  }

  updatePost (newPost) {
    const { post } = this.props;
    if(newPost.id == post.id) {
      this.setState({ post: newPost });
    }
  }

  componentDidMount() {
    const { post } = this.props;
    this.setState({ post: Object.assign({}, post) });
    this.service.on('patched', this.updatePost);
    this.service.on('updated', this.updatePost);
  }

  componentWillUnmount () {
    this.service.off('patched', this.updatePost);
    this.service.off('updated', this.updatePost);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.post !== this.state.post;
  }

  render() {

    const { post } = this.state;

    if(post == undefined) {
      return <ReactLoading className="loader" type={'bubbles'} color={'#999'} width="30px" height="30px" />;
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
          <ReactLoading className="loader" type={'bubbles'} color={'#999'} width="30px" height="30px" />
        }
      </article>;
    }
  }

}

export default Post;
