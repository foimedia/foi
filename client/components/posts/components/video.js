import React, { Component } from 'react';
import styled from 'styled-components';

import styleUtils from 'services/style-utils';

import PostMedia from '../media';

import VideoPlayer from './video-player';

const VideoBox = styled.div`
  .video-container {
    max-width: 100%;
    margin: 0 auto .5rem;
    display: block;
    outline: none;
    ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
      margin-bottom: ${styleUtils.margins[i]}rem;
    `)}
  }
  &.type-video_note {
    .video-container {
      max-width: 320px;
      ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
        margin-top: ${styleUtils.margins[i]}rem;
      `)}
      .video-js,
      video {
        border-radius: 100%;
      }
    }
  }
  .caption {
    margin: 0 .5rem .5rem;
    color: #666;
    font-size: .8em;
    font-size: italic;
    ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
      margin-left: ${styleUtils.margins[i]}rem;
      margin-right: ${styleUtils.margins[i]}rem;
      margin-bottom: ${styleUtils.margins[i]}rem;
    `)}
  }
`;

function gcd (a, b) {
  return (b == 0) ? a : gcd (b, a%b);
}

class PostVideo extends PostMedia {

  isVideoNote () {
    return this.props.type == 'video_note';
  }

  getAspectRatio () {
    const file = this.getFile();
    const w = file.width || 320; // default is video note size
    const h = file.height || 320; // default is video note size
    const r = gcd(w, h);
    return [
      w/r,
      h/r
    ];
  }

  render() {
    const { type, caption } = this.props;
    const file = this.getFile();
    const width = file.width || file['length'];
    const height = file.height || file['length'];
    const ar = this.getAspectRatio();
    return <VideoBox className={`type-${ type }`}>
      <div className="video-container">
        <VideoPlayer
          width={width}
          height={height}
          aspectRatio={`${ar[0]}:${ar[1]}`}
          controls={true}
          sources={this.getVideoSrc()}
          />
      </div>
      {typeof caption == 'string' &&
        <p className="caption">{caption}</p>
      }
    </VideoBox>
  }

}

export default PostVideo;
