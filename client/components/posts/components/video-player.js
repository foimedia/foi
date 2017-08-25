import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import debounce from 'lodash/debounce';
import styled from 'styled-components';
import omit from 'lodash/omit';
import videojs from 'video.js';
import inView from 'in-view';

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
      triggeredPlay: false,
      updateCount: 0
    };
    this.playVideo = this.playVideo.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount () {
    this.setup();
    this.viewportContainer = this.findScrollableAncestor(findDOMNode(this));
  }

  attachPlayerListeners () {
    this.player.el().addEventListener('click', this.handleClick);
    this.player.el().addEventListener('touchstart', this.handleClick);
  }

  detachPlayerListeners () {
    this.player.el().removeEventListener('click', this.handleClick);
    this.player.el().removeEventListener('touchstart', this.handleClick);
  }

  componentWillReceiveProps (nextProps) {
    if(Array.isArray(nextProps.sources) && JSON.stringify(this.props.sources[0]) !== JSON.stringify(nextProps.sources[0])) {
      this.setup();
    }
  }

  componentWillUnmount () {
    if(this.player) {
      this.detachPlayerListeners();
      this.player.dispose();
    }
    if(!this.props.autoplay) {
      this.viewportContainer.removeEventListener('scroll', this.handleScroll);
    }
  }

  componentDidUpdate (prevProps, prevState) {

    if(this.state.updateCount !== prevState.updateCount) {
      if(this.player) {
        this.detachPlayerListeners();
        this.player.dispose();
        this.player = null;
      }
      const options = {
        ...omit(this.props, 'children')
      };
      this.player = videojs(this.videoNode, options);
      this.attachPlayerListeners();

      // Handling udpated video events
      if(!this.props.autoplay) {
        this.viewportContainer.addEventListener('scroll', this.handleScroll);
        this.handleScroll();
      } else {
        this.viewportContainer.removeEventListener('scroll', this.handleScroll);
      }
      this.player.ready(() => {
        this.handleBGPlay();
      });
    }

    const { backgroundPlay, triggeredPlay } = this.state;
    if(this.player && !triggeredPlay && prevState.backgroundPlay !== backgroundPlay) {
      this.handleBGPlay();
    }
  }
  handleBGPlay () {
    const { backgroundPlay } = this.state;
    if(backgroundPlay) {
      if(this.props.control)
        this.player.controls(false);
      if(!this.props.muted)
        this.player.muted(true);
      if(!this.props.loop)
        this.player.loop(true);
      this.player.play();
    } else {
      this.player.pause();
    }
  }
  setup () {
    let updateCount = this.state.updateCount;
    this.setState({
      updateCount: updateCount + 1,
      triggeredPlay: false,
      backgroundPlay: true
    });
  }
  findScrollableAncestor (el) {
    if(el !== undefined && el !== null)
      while ((el = el.parentElement) && !el.classList.contains('scrollable'));
    return el;
  }
  playVideo () {
    if(!this.player)
      return;
    this.player.currentTime(0);
    this.player.muted(false);
    if(!this.props.loop)
      this.player.loop(false);
    if(this.props.controls)
      this.player.controls(true);
    setTimeout(() => {
      this.player.play();
      this.setState({
        triggeredPlay: true,
        backgroundPlay: false
      });
    }, 50);
  }
  handleScroll = debounce(() => {
    if(!this.player)
      return;
    const { triggeredPlay } = this.state;
    const node = this.videoNode;
    if(node === null)
      return;
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
  }, 100);
  handleClick (e) {
    if(!this.props.controls && !this.player.paused()) {
      this.player.pause();
      this.setState({
        triggeredPlay: false,
        backgroundPlay: true
      });
    }
  }
  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render() {
    const { backgroundPlay } = this.state;
    const key = `${this.props.id}-${this.state.updateCount}`;
    return (
      <PlayerWrapper className="interactive">
        {backgroundPlay &&
          <span className="fa fa-volume-up" onClick={this.playVideo}></span>
        }
        <div key={key} data-vjs-player>
          <video ref={ node => this.videoNode = node } className="video-js"></video>
        </div>
      </PlayerWrapper>
    )
  }
}
