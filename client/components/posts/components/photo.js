import React, { Component } from 'react';
import styled from 'styled-components';
import { ProgressiveImage } from 'react-progressive-image-loading';

import styleUtils from 'services/style-utils';

import PostMedia from '../media';

const PhotoBox = styled.div`
  margin: 0 auto;
  img, .img {
    width: auto;
    height: auto;
    max-width: 100%;
    display: block;
    margin: 0 auto .5rem;
    overflow: hidden;
    box-sizing: border-box;
    ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
      margin-bottom: ${styleUtils.margins[i]}rem;
    `)}
  }
  .caption {
    color: #666;
    font-size: .8em;
    ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
      margin-top: -${styleUtils.margins[i]/2}rem;
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
      ar = file.height / file.width;
    }
    return ar;
  }

  getWindowAspectRatio () {
    return window.innerHeight / window.innerWidth;
  }

  getWidthRatio (ar) {
    // Detect window aspect ratio for better view of vertical photos
    const windowAr = this.getWindowAspectRatio();
    if(ar > 1 && windowAr < 1.4) {
      return 1/ar;
    }
    return 1;
  }

  render() {
    const { caption } = this.props;
    const ar = this.getPhotoAspectRatio();
    const wr = this.getWidthRatio(ar);
    const src = this.getFileUrl();
    const preview = this.getFileUrl(0);
    return (
      <PhotoBox style={{width: `${wr*100}%`}}>
        <ProgressiveImage
          src={src}
          preview={preview}
          transitionTime={200}
          render={(source, style) => {
            return (
              <div className="img" style={Object.assign(style, {
                backgroundImage: `url(${src})`,
                paddingBottom: `${ar*100}%`,
                backgroundSize: 'cover'
              })}
              />
            )}
          }
        />
        {typeof caption == 'string' &&
          <p className="caption">{caption}</p>
        }
      </PhotoBox>
    )
  }

}

export default PostPhoto;
