import React, { Component } from 'react';
import styled from 'styled-components';
import omit from 'lodash/omit';
import videojs from 'video.js';
import inView from 'in-view';

inView.offset(200);

const PlayerWrapper = styled.div`
  position: relative;
  .fa-volume-up {
    display: table-cell;
    position: absolute;
    top: 0;
    bottom: 0;
    text-align: right;
    left: 0;
    width: 100%;
    line-height: 100%;
    z-index: 10;
    color: #fff;
    text-shadow: 0 0 2rem #000;
    font-size: 1.5em;
    padding: 1rem;
    box-sizing: border-box;
    cursor: pointer;
  }
  .video-js {
    .vjs-control-bar {
      text-shadow: 0 0 1rem #000;
      background-color: transparent;
    }
  }
`

export default class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundPlay: false,
      triggeredPlay: false
    };
    this.playVideo = this.playVideo.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }
  componentDidMount () {

    this.player = videojs(this.videoNode, {
      ...omit(this.props, 'children'),
      preload: true
    });

    if(!this.props.autoplay) {
      this.viewportContainer = this.findScrollableAncestor(this.videoNode);
      this.viewportContainer.addEventListener('scroll', this.handleScroll);
      this.handleScroll();
    } else {
      this.playVideo();
    }

  }
  componentWillUnmount () {
    if(this.player) {
      this.player.dispose()
    }
    if(!this.props.autoplay) {
      this.viewportContainer.removeEventListener('scroll', this.handleScroll);
    }
  }
  componentDidUpdate (prevProps, prevState) {
    const { backgroundPlay, triggeredPlay } = this.state;
    if(this.player && !triggeredPlay && prevState.backgroundPlay !== backgroundPlay) {
      if(backgroundPlay) {
        this.player.load();
        this.player.muted(true);
        this.player.loop(true);
        this.player.controls(false);
        this.player.play();
      } else {
        this.player.pause();
      }
    }
  }
  findScrollableAncestor (el) {
    if(el !== undefined && el !== null)
      while ((el = el.parentElement) && !el.classList.contains('scrollable'));
    return el;
  }
  playVideo () {
    this.player.currentTime(0);
    this.player.muted(false);
    this.player.loop(false);
    this.player.controls(true);
    this.player.play();
    this.setState({
      triggeredPlay: true,
      backgroundPlay: false
    });
  }
  handleScroll () {
    const { triggeredPlay } = this.state;
    const node = this.videoNode;
    const inViewport = inView.is(node);
    const paused = this.player.paused();
    if(!triggeredPlay) {
      if(inViewport && paused) {
        this.setState({
          backgroundPlay: true
        });
      } else if(!inViewport && !paused) {
        this.setState({
          backgroundPlay: false
        });
      }
    }
  }
  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render() {
    const { backgroundPlay } = this.state;
    return (
      <PlayerWrapper className="interactive">
        {backgroundPlay &&
          <span className="fa fa-volume-up" onClick={this.playVideo}></span>
        }
        <div data-vjs-player>
          <video ref={ node => this.videoNode = node } className="video-js"></video>
        </div>
      </PlayerWrapper>
    )
  }
}
