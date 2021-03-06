import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import styleUtils from 'services/style-utils';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import Transition from 'react-transition-group/Transition';
import Swipeable from 'react-swipeable';
import Post from 'components/posts';
import Button from 'components/button';
import Link from 'components/smart-link';

const GalleryWrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #111;
  z-index: 99999;
  overflow-y: auto;
  overflow-x: hidden;
  ${styleUtils.media.desktop`
    border-left: 1px solid #333;
  `}
  .media-gallery-container {
    width: 100%;
    height: 100%;
    display: table;
  }
  > div {
    outline: none;
  }
`

const Leave = styled.div`
  a {
    position: fixed;
    z-index: 2;
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
  position: fixed;
  z-index: 4;
  top: 0;
  right: 0;
  color: #fff;
  font-size: .8em;
  cursor: pointer;
  text-shadow: 0 0 .5rem #000;
  a,
  .disabled-nav-link {
    color: #fff;
    ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
      padding-top: ${styleUtils.margins[i]}rem;
      padding-bottom: ${styleUtils.margins[i]}rem;
    `)}
    &:first-child {
      ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
        padding-right: ${styleUtils.margins[i]}rem;
    `)}
    }
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
  .disabled-nav-link,
  .disabled-nav-link:hover,
  .disabled-nav-link:active,
  .disabled-nav-link:focus,
  .disabled-nav-link .fa {
    color: #666;
  }
  > * {
    float: right;
    padding: 0;
    ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
      padding-left: ${styleUtils.margins[i]/2}rem;
      padding-right: ${styleUtils.margins[i]/2}rem;
    `)}
  }
`

const PostWrapper = styled.div`
  display: table-cell;
  vertical-align: middle;
  position: relative;
  width: 100%;
  height: 100%;
  color: #fff;
  .post {
    max-width: 1000px;
    margin: 4rem auto;
  }
  .post .img-container,
  .post .interactive {
    overflow: visible;
    position: relative;
    z-index: 3;
  }
  .post .caption-container {
    p.caption {
      color: inherit;
    }
    position: fixed;
    z-index: 4;
    width: 100%;
    padding: 4rem 0 0;
    bottom: 0;
    left: 0;
    /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#000000+0,000000+100&0+0,0.65+100 */
    background: -moz-linear-gradient(top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0.65) 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0.65) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00000000', endColorstr='#a6000000',GradientType=0 ); /* IE6-9 */
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
  .gallery-item.fade-exiting {
    transform: translate(0, -2rem);
  }
  .gallery-item.fade-entering {
    transform: translate(0, -2rem);
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

  Thumb (item, status) {
    return (
      <Link
        to={{
          pathname: `/c/${item.props.post.chatId}/s/${item.props.post.storyId}`,
          state: {
            modal: true,
            post: item.props.post.id
          }
        }}
        className={`gallery-item fade-${status} type-${item.props.post.type}`}>
        {item}
      </Link>
    )
  }

  render () {
    const { children } = this.props;
    const childrenArray = Array.isArray(children) ? children : [children];
    return (
      <ListWrapper>
        {/* <TransitionGroup>
          {childrenArray.slice(0,5).map(child => (
            <Transition key={child.key} timeout={100}>
              {(status) => this.Thumb(child, status)}
            </Transition>
          ))}
        </TransitionGroup> */}
        {childrenArray.slice(0,5).map(child => (
          <div key={child.key}>
            {this.Thumb(child, '')}
          </div>
        ))}
        <div className="clear" />
      </ListWrapper>
    )
  }
}

class GalleryNavLink extends Component {
  render () {
    const { post, ...props } = this.props;
    if(post !== undefined) {
      return (
        <Link to={{
          pathname: `/c/${post.chatId}/s/${post.storyId}`,
          state: {
            modal: true,
            post: post.id
          }
        }} replace>
          {props.children}
        </Link>
      )
    } else {
      return (
        <span className="disabled-nav-link">
          {props.children}
        </span>
      )
    }
  }
}

export class Gallery extends Component {

  static defaultProps = {
    post: undefined,
    loadMore: null,
    hasMore: false
  }

  constructor (props) {
    super(props);
    this.state = {
      open: true,
      post: undefined,
      nav: {
        next: undefined,
        prev: undefined
      },
      go: false
    };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
    this.attachKeys = this.attachKeys.bind(this);
  }

  componentDidMount () {
    const { post } = this.props;
    if(post !== undefined) {
      this.open(post);
      this.setSiblings();
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const node = findDOMNode(this);
    if(node !== null && node.childNodes.length) {
      const index = node.querySelectorAll('div[tabindex]');
      if(index.length) {
        index[0].focus();
      }
    }
    if(this.state.post !== prevState.post) {
      this.setSiblings();
    }
  }

  componentWillReceiveProps (nextProps) {
    const { post } = this.props;
    if(nextProps.post && nextProps.post.id !== post.id) {
      this.setState({
        go: false
      });
      this.open(nextProps.post);
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

  open (post) {
    window.addEventListener('keydown', this.attachKeys);
    this.setState({
      open: true,
      post: post
    });
  }

  close (redirect = false) {
    window.removeEventListener('keydown', this.attachKeys);
    this.setState({
      open: false
    });
    if(redirect === true) {
      this.props.back();
    }
  }

  next () {
    if(this.state.nav.next !== undefined) {
      this.setState({
        go: 'next'
      });
    }
  }

  prev () {
    if(this.state.nav.prev !== undefined) {
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

  setSiblings () {
    const { post } = this.state;
    if(post !== undefined) {
      const { hasMore, posts, loadMore } = this.props;
      const index = this.findIndex(post);
      if(index+2 >= posts.length && hasMore) {
        loadMore();
      }
      this.setState({
        nav: {
          prev: this._find(-1),
          next: this._find(1)
        }
      });
    }
  }

  findIndex (post) {
    const { posts } = this.props;
    return posts.findIndex(p => p.id == post.id);
  }

  render () {
    const { posts, back } = this.props;
    const { open, post, nav, go } = this.state;
    if(go) {
      const target = nav[go];
      if(target !== undefined) {
        return (
          <Redirect to={{
            pathname: `/c/${target.chatId}/s/${target.storyId}`,
            state: {
              modal: true,
              post: target.id
            }
          }} replace />
        )
      }
    } else if(open && post) {
      return (
        <div className={`media-gallery ${this.props.className || ''}`}>
          <Swipeable
            onSwipedLeft={this.next}
            onSwipedRight={this.prev}
            >
            <GalleryWrapper>
              <div tabIndex="0" className="media-gallery-container">
                <Leave>
                  <a href="javascript:void(0);" onClick={back}></a>
                </Leave>
                <Actions>
                  <a href="javascript:void(0);" onClick={back}>
                    Close
                    <span className="fa fa-close"></span>
                  </a>
                  <GalleryNavLink post={nav.next}>
                    Next
                    <span className="fa fa-chevron-right"></span>
                  </GalleryNavLink>
                  <GalleryNavLink post={nav.prev}>
                    <span className="fa fa-chevron-left"></span>
                    Previous
                  </GalleryNavLink>
                  <Link to={`/c/${post.chatId}/s/${post.storyId}`}>
                    Go to story
                  </Link>
                </Actions>
                <PostWrapper>
                  <Post post={post} focus={true} />
                </PostWrapper>
              </div>
            </GalleryWrapper>
          </Swipeable>
        </div>
      );
    } else {
      return null;
    }
  }
}
