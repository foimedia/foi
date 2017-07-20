import React, { Component } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import ReactLoading from 'react-loading';

import client from 'services/feathers';

import Bundle from 'components/bundle';

import loadPostText from 'bundle-loader?lazy!./components/text';
import loadPostPhoto from 'bundle-loader?lazy!./components/photo';
import loadPostAudio from 'bundle-loader?lazy!./components/audio';
import loadPostVideo from 'bundle-loader?lazy!./components/video';
import loadPostLocation from 'bundle-loader?lazy!./components/location';

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
          <Bundle load={loadPostText}>
            {PostText => (
              <PostText data={post.content} />
            )}
          </Bundle>
        }
        {(post.type == 'location' || post.type == 'venue') &&
          <Bundle load={loadPostLocation}>
            {PostLocation => (
              <PostLocation data={post.content} />
            )}
          </Bundle>
        }
        {(post.type == 'photo' || post.type == 'sticker') &&
          <Bundle load={loadPostPhoto}>
            {PostPhoto => (
              <PostPhoto data={post.media} caption={post.content} />
            )}
          </Bundle>
        }
        {(post.type == 'video' || post.type == 'video_note') &&
          <Bundle load={loadPostVideo}>
            {PostVideo => (
              <PostVideo data={post.media} caption={post.content} type={post.type} />
            )}
          </Bundle>
        }
        {(post.type == 'audio' || post.type == 'voice') &&
          <Bundle load={loadPostAudio}>
            {PostAudio => (
              <PostAudio data={post.media} />
            )}
          </Bundle>
        }
        {(post.type == 'document') &&
          <ReactLoading className="loader" type={'bubbles'} color={'#999'} width="30px" height="30px" />
        }
      </article>;
    }
  }

}

export default Post;
