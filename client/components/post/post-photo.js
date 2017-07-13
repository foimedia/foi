import React, { Component } from 'react';
import styled from 'styled-components';
import PostMedia from './post-media';
import { ProgressiveImage } from 'react-progressive-image-loading';

const PhotoBox = styled.div`
  img, .img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 400px;
    display: block;
    margin: 0 auto 1.5rem;
    overflow: hidden;
    box-sizing: border-box;
  }
  .caption {
    margin: -.5rem 1.5rem 1.5rem;
    color: #666;
    font-size: .8em;
    font-size: italic;
  }
`;

class PostPhoto extends PostMedia {

  getPhotoAspectRatio () {
    const file = this.getFile();
    return file.height / file.width * 100;
  }

  render() {
    const { caption } = this.props;
    const ar = this.getPhotoAspectRatio();
    return <PhotoBox>
      <ProgressiveImage
        src={this.getFileUrl()}
        preview={this.getFileUrl(0)}
        transitionTime={200}
        render={(src, style) =>
          <div className="img" style={Object.assign(style, {
            backgroundImage: `url(${src})`,
            paddingBottom: `${ar}%`,
            backgroundSize: 'cover'
          })}
        />}
      />
      {typeof caption == 'string' &&
        <p className="caption">{caption}</p>
      }
    </PhotoBox>;
  }

}

export default PostPhoto;
