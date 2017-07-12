import React, { Component } from 'react';
import styled from 'styled-components';
import PostMedia from './post-media';

const PhotoBox = styled.div`
  img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 400px;
    display: block;
    margin: 0 auto 1.5rem;
  }
`;

class PostPhoto extends PostMedia {

  render() {
    const { data } = this.props;

    return <PhotoBox>
      <img src={this.getFileUrl()} />
    </PhotoBox>;
  }

}

export default PostPhoto;
