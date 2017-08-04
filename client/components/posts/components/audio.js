import React, { Component } from 'react';
import styled from 'styled-components';

import styleUtils from 'services/style-utils';

import PostMedia from '../media';

const AudioBox = styled.div`
  width: 100%;
  audio {
    width: 100%;
    display: block;
    margin: 0 0 .5rem;
    ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
      margin-bottom: ${styleUtils.margins[i]}rem;
    `)}
  }
`

class PostAudio extends PostMedia {

  render() {
    return <AudioBox className="interactive">
      <audio controls>
        <source src={this.getFileUrl()} type={this.getMime()} />
        Your browser does not support the audio element.
      </audio>
    </AudioBox>
  }

}

export default PostAudio;
