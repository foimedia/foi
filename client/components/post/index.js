import React, { Component } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import PostText from './post-text';
import PostPhoto from './post-photo';
import PostAudio from './post-audio';
import PostVideo from './post-video';
import PostLocation from './post-location';

class Post extends Component {

  render() {
    const { post } = this.props;

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

export default Post;
