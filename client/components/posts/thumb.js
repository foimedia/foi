import React, { Component } from 'react';
import styled from 'styled-components';
import { ProgressiveImage } from 'react-progressive-image-loading';

const Wrapper = styled.div`
  width: 100%;
  padding-top: 100%;
  position: relative;
  background: #666;
  .img {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }
  .fa {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 1em;
    margin-top: -.5em;
    line-height: 1;
    color: #fff;
    text-shadow: 0 0 2rem rgba(0,0,0,.5);
  }
`

export default class PostThumb extends Component {
  getUrl (file) {
    return foi.url + '/files/' + file.file_id + '/' + file.file_name;
  }
  getThumb (index) {
    const { post } = this.props;
    if(post.media && post.media.length) {
      index = index || post.media.length-1;
      if(post.media[index].thumb) {
        return this.getUrl(post.media[index].thumb);
      } else {
        return this.getUrl(post.media[index]);
      }
    }
    return '';
  }
  isVideo () {
    const { post } = this.props;
    return post.type == 'video' || post.type == 'video_note';
  }
  render () {
    const { post } = this.props;
    const src = this.getThumb();
    const preview = this.getThumb(0);
    if(post !== undefined) {
      return (
        <Wrapper>
          <ProgressiveImage
            src={src}
            preview={preview}
            transitionTime={200}
            render={(src, style) =>
              <div className="img" style={Object.assign(style, {
                backgroundImage: `url(${src})`,
              })}
            />}
          />
          {this.isVideo() &&
            <span className="fa fa-play"></span>
          }
        </Wrapper>
      );
    }
    return null;
  }
}
