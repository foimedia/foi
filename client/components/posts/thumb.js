import React, { Component } from 'react';
import styled from 'styled-components';
import { ProgressiveImage } from 'react-progressive-image-loading';

import 'font-awesome/css/font-awesome.css';

const Wrapper = styled.div`
  width: 100%;
  padding-top: 100%;
  position: relative;
  .img {
    background-size: cover;
    background-repeat: no-repeat;
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
  constructor (props) {
    super(props);
    this.getStyle = this.getStyle.bind(this);
  }
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
  getStyle (thumb) {
    return {
      backgroundImage: `url(${thumb})`
    };
  }
  render () {
    const { post } = this.props;
    const thumb = this.getThumb();
    return (
      <Wrapper style={this.getStyle(thumb)}>
        <ProgressiveImage
          src={this.getThumb()}
          preview={this.getThumb(0)}
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
}
