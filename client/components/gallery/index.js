import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import styleUtils from 'services/style-utils';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import Transition from 'react-transition-group/Transition';
import Post from 'components/posts';
import Button from 'components/button';
import Link from 'components/smart-link';

const GalleryWrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.9);
  z-index: 99999;
  overflow: auto;
  > div {
    outline: none;
  }
`

const Leave = styled.div`
  a {
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    cursor: pointer;
  }
`

const Actions = styled.span`
  font-family: "Inconsolata", monospace;
  text-transform: uppercase;
  z-index: 3;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  color: #fff;
  font-size: .8em;
  cursor: pointer;
  background: #111;
  ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
    padding: ${styleUtils.margins[i]}rem;
  `)}
  a {
    color: #fff;
    &:hover,
    &:active,
    &:focus {
      color: rgba(255,255,255,0.8);
    }
    .fa {
      font-size: .8em;
      ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
        margin: 0 ${styleUtils.margins[i]/2}rem;
      `)}
    }
  }
  > * {
    float: right;
    margin: 0;
    ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
      margin-left: ${styleUtils.margins[i]}rem;
    `)}
  }
`

const PostWrapper = styled.div`
  position: relative;
  width: 100%;
  max-height: 90%;
  max-width: 1000px;
  margin: 15vh auto 0;
  z-index: 2;
  color: #fff;
  .post .caption {
    color: inherit;
  }
`;

const ListWrapper = styled.section`
  ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
    width: calc(100% + ${styleUtils.margins[i]}rem);
    margin-bottom: ${styleUtils.margins[i]}rem;
  `)}
  .gallery-item {
    ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
      width: calc(20% - ${styleUtils.margins[i]}rem);
      margin-right: ${styleUtils.margins[i]}rem;
    `)}
    cursor: pointer;
    float: left;
    border-radius: ${styleUtils.radius/2}px;
    position: relative;
    overflow: hidden;
    transition: transform 100ms ${styleUtils.transition};
    box-sizing: border-box;
    &.type-video_note {
      border-radius: 100%;
    }
  }
  .gallery-item.fade-entering, .gallery-item.fade-exiting {
    opacity: 0.01;
  }
  .gallery-item.fade-entering, .gallery-item.fade-exiting {
    transform: translate(0, -2rem);
  }
  .gallery-item:first-child {
    &.fade-entering {
      transform: translate(-2rem, 0);
    }
  }
  .gallery-item.fade-entered {
    transform: translate(0, 0);
    opacity: 1;
    &:hover,
    &:focus {
      transform: scale(.95, .95);
    }
  }
  .gallery-item.fade-exited {
    display: none;
  }
  .clear {
    content: "";
    display: table;
    clear: both;
  }
`;

export class GalleryList extends Component {
  render () {
    const { children } = this.props;
    const childrenArray = Array.isArray(children) ? children : [children];
    return (
      <ListWrapper>
        <TransitionGroup>
          {childrenArray.slice(0,5).map((child, i) =>
            <Transition key={child.key} timeout={200}>
              {(status) => (
                <Link to={{
                  pathname: `/c/${child.props.post.chatId}/s/${child.props.post.storyId}`,
                  state: {
                    modal: true,
                    post: child.props.post,
                    index: i
                  }
                }} className={`gallery-item fade-${status} type-${child.props.post.type}`}>
                  {child}
                </Link>
              )}
            </Transition>
          )}
        </TransitionGroup>
        {/* <a href="javascript:void(0);"  onClick={this.open(child, i)}>
        </a> */}
        <div className="clear" />
      </ListWrapper>
    )
  }
}

export class Gallery extends Component {

  static defaultProps = {
    post: undefined,
    index: 0,
    loadMore: null,
    hasMore: false
  }

  constructor (props) {
    super(props);
    this.state = {
      open: true,
      post: undefined,
      index: 0,
      go: false
    };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
    this.attachKeys = this.attachKeys.bind(this);
  }

  componentDidMount () {
    const { post, index } = this.props;
    if(post !== undefined) {
      this.open(post, index);
    }
  }

  componentDidUpdate () {
    const node = findDOMNode(this);
    if(node.childNodes && node.childNodes.length) {
      node.childNodes[0].focus();
    }
  }

  componentWillReceiveProps (nextProps) {
    const { post } = this.props;
    if(nextProps.post && nextProps.post.id !== post.id) {
      this.setState({
        go: false
      });
      this.open(nextProps.post, nextProps.index);
    }
  }

  componentWillUnmount () {
    const { open } = this.state;
    if(open) {
      this.close();
    }
  }

  attachKeys (event) {
    switch(event.keyCode) {
      case 27: // esc
        this.close(true);
        break;
      case 39: // right arrow
        this.next();
        break;
      case 37: // left arrow
        this.prev();
        break;
    }
  }

  open (post, i) {
    window.addEventListener('keydown', this.attachKeys);
    const body = document.getElementsByTagName('BODY')[0];
    body.style.overflow = 'hidden';
    this.setState({
      open: true,
      post: post,
      index: i
    });
    this.setState({
      prev: this.findPrev()
    });
    this.findNext().then(post => {
      this.setState({
        next: post
      });
    });
  }

  close (redirect = false) {
    window.removeEventListener('keydown', this.attachKeys);
    const body = document.getElementsByTagName('BODY')[0];
    body.style.overflow = null;
    this.setState({
      open: false
    });
    if(redirect === true) {
      this.setState({ go: 'home' });
    }
  }

  next () {
    if(this.state.next !== undefined) {
      this.setState({
        go: 'next'
      });
    }
  }

  prev () {
    if(this.state.prev !== undefined) {
      this.setState({
        go: 'prev'
      });
    }
  }

  _find (pos) {
    const { post } = this.state;
    const { posts } = this.props;
    let found;
    if(post) {
      posts.forEach((p, i) => {
        if(p.id == post.id) {
          found = posts[i + pos];
        }
      });
    }
    return found;
  }

  findNext () {
    const { loadMore, hasMore } = this.props;
    return new Promise((resolve, reject) => {
      let next = this._find(1);
      if(next !== undefined) {
        resolve(next);
      } else if(hasMore) {
        loadMore().then(() => {
          resolve(this._find(1));
        });
      } else {
        reject();
      }
    }).catch(() => undefined);
  }

  findPrev () {
    return this._find(-1);
  }

  render () {
    const { posts, hasMore } = this.props;
    const { open, post, index, next, prev, go } = this.state;
    if(go) {
      const target = this.state[go];
      if(target !== undefined) {
        return (
          <Redirect to={{
            pathname: `/c/${target.chatId}/s/${target.storyId}`,
            state: {
              modal: true,
              post: target,
              index: index+1
            }
          }} />
        )
      } else if(go == 'home') {
        return (
          <Redirect to={`/c/${post.chatId}`} />
        )
      }
    } else if(open && post) {
      return (
        <GalleryWrapper>
          <div tabindex="0">
            <Leave>
              <Link to={`/c/${post.chatId}`}></Link>
            </Leave>
            <Actions>
              <Link to={`/c/${post.chatId}`}>
                Close
                <span className="fa fa-close"></span>
              </Link>
              {next !== undefined &&
                <Link to={{
                  pathname: `/c/${next.chatId}/s/${next.storyId}`,
                  state: {
                    modal: true,
                    post: next,
                    index: index+1
                  }
                }}>
                  Next
                  <span className="fa fa-chevron-right"></span>
                </Link>
              }
              {prev !== undefined &&
                <Link to={{
                  pathname: `/c/${prev.chatId}/s/${prev.storyId}`,
                  state: {
                    modal: true,
                    post: prev,
                    index: index-1
                  }
                }}>
                  <span className="fa fa-chevron-left"></span>
                  Previous
                </Link>
              }
              <Link to={`/c/${post.chatId}/s/${post.storyId}`}>
                Go to story
              </Link>
            </Actions>
            <PostWrapper>
              <Post post={post} />
            </PostWrapper>
          </div>
        </GalleryWrapper>
      );
    }
  }
}
