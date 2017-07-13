import React, { Component } from 'react';
import styled from 'styled-components';
import PostMedia from './post-media';

const AudioBox = styled.div`
  width: 100%;
  audio {
    width: 100%;
    display: block;
    margin: 0 0 1.5rem;
  }
`

class PostAudio extends PostMedia {

  render() {
    return <AudioBox>
      <audio controls>
        <source src={this.getFileUrl()} type={this.getMime()} />
        Your browser does not support the audio element.
      </audio>
    </AudioBox>
  }

}

export default PostAudio;
