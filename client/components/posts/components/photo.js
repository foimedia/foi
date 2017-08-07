import React, { Component } from 'react';
import styled from 'styled-components';
import { ProgressiveImage } from 'react-progressive-image-loading';

import styleUtils from 'services/style-utils';

import PostMedia from '../media';

const PhotoBox = styled.div`
  img, .img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 400px;
    display: block;
    margin: 0 auto .5rem;
    overflow: hidden;
    box-sizing: border-box;
    ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
      margin-bottom: ${styleUtils.margins[i]}rem;
    `)}
  }
  .caption {
    margin: 0 .5rem .5rem;
    color: #666;
    font-size: .8em;
    ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
      margin-left: ${styleUtils.margins[i]}rem;
      margin-right: ${styleUtils.margins[i]}rem;
      margin-bottom: ${styleUtils.margins[i]}rem;
    `)}
  }
`;

class PostPhoto extends PostMedia {

  getPhotoAspectRatio () {
    const file = this.getFile();
    let ar = 0;
    if(file !== undefined && file.width) {
      ar = file.height / file.width * 100;
    }
    return ar;
  }

  render() {
    const { caption } = this.props;
    const ar = this.getPhotoAspectRatio();
    const src = this.getFileUrl();
    const preview = this.getFileUrl(0);
    return <PhotoBox>
      <ProgressiveImage
        src={src}
        preview={preview}
        transitionTime={200}
        render={(source, style) => {
          return (
            <div className="img" style={Object.assign(style, {
              backgroundImage: `url(${src})`,
              paddingBottom: `${ar}%`,
              backgroundSize: 'cover'
            })}
            />
          )}
        }
      />
      {typeof caption == 'string' &&
        <p className="caption">{caption}</p>
      }
    </PhotoBox>;
  }

}

export default PostPhoto;
