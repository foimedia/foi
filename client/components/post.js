import React, { Component } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import PostText from './post-text';
import PostPhoto from './post-photo';
import PostAudio from './post-audio';
import PostVideo from './post-video';
import PostLocation from './post-location';

const PostBox = styled.article`
  max-width: 600px;
  border: 1px solid #e6e6e6;
  margin: 0 auto 1rem;
  border-radius: 3px;
  box-shadow: 0 0 5px rgba(0,0,0,0.05);
  :hover {
    border-color: #d6d6d6;
    box-shadow: 0 0 8px rgba(0,0,0,0.08);
  }
  p {
    margin: 0;
  }
`;

const PostBoxContent = styled.section``;

const PostBoxFooter = styled.footer`
  background: #f6f6f6;
  padding: 1rem 2rem;
  font-size: .8em;
  color: #999;
  border-radius: 0 0 3px 3px;
  p {
    display: inline-block;
    margin: 0 1rem 0 0;
    &.small,
    .small {
      font-size: .8em;
      font-style: italic;
    }
    &:after {
      content: '\00b7';
      display: inline-block;
      margin-left: 1rem;
      font-weight: 600;
    }
    &:last-child {
      margin: 0;
      &:after {
        content: '';
      }
    }
  }
`;

class Post extends Component {

  getDate() {
    const { post } = this.props;
    return this.getFormatted(post.sentAt);
  }

  getEditedDate() {
    const { post } = this.props;
    return this.getFormatted(post.editedAt);
  }

  getFormatted(d) {
    const now = moment();
    const date = moment(d);
    if(now.isSame(date, 'day')) {
      return date.fromNow();
    } else {
      return date.format('LLL');
    }
  }

  render() {
    const { post } = this.props;

    return <PostBox>
      <PostBoxContent>
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
      </PostBoxContent>
      <PostBoxFooter>
        <p>{post.creator.first_name} {post.creator.last_name}</p>
        {(post.creator.id !== post.user.id) &&
          <p className="publisher small">
            Published by {' '}
            <span>{post.user.first_name} {post.user.last_name}</span>
          </p>
        }
        <p>
          {this.getDate()}
          {post.sentAt !== post.editedAt &&
            <span className="small">{' '} (edited {this.getEditedDate()})</span>
          }
        </p>
      </PostBoxFooter>
    </PostBox>;
  }

}

export default Post;
