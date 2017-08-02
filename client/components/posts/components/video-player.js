import React, { Component } from 'react';
import omit from 'lodash/omit';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export default class VideoPlayer extends Component {
  componentDidMount() {
    this.player = videojs(this.videoNode, omit(this.props, 'children'));
  }
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose()
    }
  }
  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render() {
    return (
      <div data-vjs-player>
        <video ref={ node => this.videoNode = node } className="video-js"></video>
      </div>
    )
  }
}
