import React, { Component } from 'react';
import styled from 'styled-components';

import styleUtils from 'services/style-utils';

import PostMedia from '../media';

const VideoBox = styled.div`
  &.type-video_note {
    margin: 1.5rem;
    video {
      width: 320px;
      border-radius: 100%;
    }
  }
  video {
    max-width: 100%;
    height: auto;
    margin: 0 auto;
    display: block;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    outline: none;
  }
`;

class PostVideo extends PostMedia {

  isVideoNote() {
    return this.props.type == 'video_note';
  }

  render() {
    const { data, type } = this.props;
    const width = data.length || data.width;
    const height = data.length || data.height;
    return <VideoBox className={`type-${ type }`}>
      <video width={width} height={height} controls={!this.isVideoNote()}>
        <source src={this.getFileUrl()} type={this.getMime()} />
        Your browser does not support the video element.
      </video>
    </VideoBox>
  }

}

export default PostVideo;
