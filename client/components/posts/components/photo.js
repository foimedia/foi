import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import styled from 'styled-components';
import { ProgressiveImage } from 'react-progressive-image-loading';
import Hammer from 'hammerjs';
import Link from 'components/smart-link';

import styleUtils from 'services/style-utils';

import PostMedia from '../media';

const PhotoBox = styled.div`
  margin: 0 auto;
  .img-container {
    overflow: hidden;
    margin: 0 auto .5rem;
    ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
      margin-bottom: ${styleUtils.margins[i]}rem;
    `)}
  }
  img, .img {
    width: auto;
    height: auto;
    max-width: 100%;
    display: block;
    overflow: hidden;
    box-sizing: border-box;
    &.reset {
      transition: transform 100ms ease-in-out !important;
    }
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

  transform = {}

  constructor(props) {
    super(props);
    this.pinchstart = this.pinchstart.bind(this);
    this.pinchmove = this.pinchmove.bind(this);
    this.pinchend = this.pinchend.bind(this);
    this.result = this.result.bind(this);
  }

  componentDidMount () {
    this.manager = new Hammer(this.img, {
      touchAction: 'pan-y'
    });
    this.manager.get('pinch').set({enable: true});
    this.attachInteraction();
  }

  componentWillUnmount () {
    this.detachInteraction();
    this.manager = null;
  }

  applyTransform (el, transform) {
    this.transform = {...this.transform, ...transform};
    const str = Object.keys(this.transform).reduce((arr, key) => {
      arr.push(`${key}(${this.transform[key]})`);
      return arr;
    }, []).join(' ');
    el.style.webkitTransform = el.style.transform = str;
  }

  pinchstart () {
    this.img.classList.remove('reset');
  }

  pinchmove (ev) {
    if(ev.scale < .5)
      return;
    this.applyTransform(this.img, {
      scale: ev.scale,
      translate: `${ev.deltaX}px, ${ev.deltaY}px`
    });
  }

  pinchend (ev) {
    this.img.classList.add('reset');
    this.applyTransform(this.img, {
      scale: 1,
      translate: '0px, 0px'
    });
  }

  attachInteraction () {
    this.manager.on('pinchstart', this.pinchstart);
    this.manager.on('pinchmove', this.pinchmove);
    this.manager.on('pinchend', this.pinchend);
  }

  detachInteraction () {
    this.manager.off('pinchstart', this.pinchstart);
    this.manager.off('pinchmove', this.pinchmove);
    this.manager.off('pinchend', this.pinchend);
  }

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

  result (source, style) {
    const ar = this.getPhotoAspectRatio();
    const src = this.getFileUrl();
    const comp = (
      <div
        ref={node => this.img = node}
        className="img"
        style={Object.assign(style, {
          transition: 'all 0 linear',
          backgroundImage: `url(${src})`,
          paddingBottom: `${ar*100}%`,
          backgroundSize: 'cover'
        })} />
    );
    if(this.props.link) {
      return (
        <Link to={this.props.link}>{comp}</Link>
      )
    } else {
      return comp;
    }
  }

  render() {
    const { caption } = this.props;
    const ar = this.getPhotoAspectRatio();
    const wr = this.getWidthRatio(ar);
    const src = this.getFileUrl();
    const preview = this.getFileUrl(0);
    return (
      <PhotoBox style={{width: `${wr*100}%`}}>
        <div className="img-container">
          <ProgressiveImage
            src={src}
            preview={preview}
            transitionTime={200}
            render={this.result}
          />
        </div>
        {typeof caption == 'string' &&
          <div className="caption-container">
            <p className="caption">{caption}</p>
          </div>
        }
      </PhotoBox>
    )
  }

}

export default PostPhoto;
