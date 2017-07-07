import React, { Component } from 'react';
import styled from 'styled-components';
import PostMedia from './post-media';

const AudioBox = styled.div`
  width: 100%;
  audio {
    width: 100%;
    display: block;
  }
`

class PostAudio extends PostMedia {

  render() {
    const { data } = this.props;
    if(!data) {
      return <p>Loading audio...</p>
    } else {
      return <AudioBox>
        <audio controls>
          <source src={this.getFileUrl()} type={this.getMime()} />
          Your browser does not support the audio element.
        </audio>
      </AudioBox>
    }
  }

}

export default PostAudio;
