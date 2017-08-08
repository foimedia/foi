import React, { Component } from 'react';

import Loader from 'components/loader';
import Bundle from 'components/bundle';

import loadPostText from 'bundle-loader?lazy!./components/text';
import loadPostPhoto from 'bundle-loader?lazy!./components/photo';
import loadPostAudio from 'bundle-loader?lazy!./components/audio';
import loadPostVideo from 'bundle-loader?lazy!./components/video';
import loadPostLocation from 'bundle-loader?lazy!./components/location';

class Post extends Component {

  render() {

    const { post, ...props } = this.props;

    return (
      <article className="post">
        {post.type == 'text' &&
          <Bundle load={loadPostText}>
            {PostText => (
              <PostText data={post.content} {...props} />
            )}
          </Bundle>
        }
        {(post.type == 'location' || post.type == 'venue') &&
          <Bundle load={loadPostLocation}>
            {PostLocation => (
              <PostLocation data={post.content} {...props} />
            )}
          </Bundle>
        }
        {(post.type == 'photo' || post.type == 'sticker') &&
          <Bundle load={loadPostPhoto}>
            {PostPhoto => (
              <PostPhoto data={post.media} caption={post.content} {...props} />
            )}
          </Bundle>
        }
        {(post.type == 'video' || post.type == 'video_note') &&
          <Bundle load={loadPostVideo}>
            {PostVideo => (
              <PostVideo data={post.media} caption={post.content} type={post.type} {...props} />
            )}
          </Bundle>
        }
        {(post.type == 'audio' || post.type == 'voice') &&
          <Bundle load={loadPostAudio}>
            {PostAudio => (
              <PostAudio data={post.media} {...props} />
            )}
          </Bundle>
        }
        {(post.type == 'document') &&
          <Loader size={20} />
        }
      </article>
    )
  }

}

export default Post;
