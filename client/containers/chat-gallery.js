import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route } from 'react-router-dom';
import { loadChatGallery, expandChatGallery } from 'actions/chats';
import client from 'services/feathers';
import Bundle from 'components/bundle';
import Loader from 'components/loader';
import Button from 'components/button';
import { GalleryList, Gallery } from 'components/gallery';
import loadThumb from 'bundle-loader?lazy!components/posts/thumb';

class ChatGallery extends Component {

  static defaultProps = {
    types: [
      'video',
      'video_note',
      'photo'
    ]
  }

  constructor (props) {
    super(props);
    this.fetchMore = this.fetchMore.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  fetchMore () {
    const { chat } = this.props;
    this.props.expandChatGallery(chat.id);
  }

  componentDidMount () {
    const { chat } = this.props;
    this.props.loadChatGallery(chat.id);
  }

  componentWillReceiveProps (nextProps) {
    const { chat } = this.props;
    const nextChat = nextProps.chat;
    if(nextChat !== undefined) {
      if(chat !== undefined && chat.id !== nextChat.id) {
        this.props.loadChatGallery(nextChat.id);
      }
    }
  }

  goBack () {
    const { history } = this.props;
    if(history !== undefined) {
      history.goBack();
    }
  }

  render () {
    var self = this;
    const { chat, posts, location, hasMore } = this.props;
    const isModal = !!(
      location !== undefined &&
      location.state &&
      location.state.modal
    );
    if(chat !== undefined && posts !== undefined) {
      if(posts.length) {
        if(!isModal) {
          return (
            <Bundle load={loadThumb}>
              {Thumb => (
                <section id={`chat-${chat.id}-gallery`}>
                  <GalleryList>
                    {posts.map(post => (
                      <Thumb key={`gallery-post-${post.id}`} post={post} />
                    ))}
                  </GalleryList>
                </section>
              )}
            </Bundle>
          )
        } else {
          const post = posts.find(post => post.id == location.state.post);
          return (
            <Gallery
              className="modal"
              loadMore={this.fetchMore}
              hasMore={hasMore}
              posts={posts}
              post={post}
              back={this.goBack} />
          )
        }
      }
    }
    return null;
  }
}

const getChatGallery = (chat, posts, context) => {
  if(chat !== undefined && chat.gallery !== undefined) {
    return chat.gallery.reduce((res, id) => {
      if(posts[id])
        res.push(posts[id]);
      return res;
    }, []);
  }
};

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.chat;
  const context = state.context.chats[id].gallery;
  const hasMore = !!(context.limit + context.skip < context.total);
  return {
    posts: getChatGallery(state.chats[id], state.posts, context),
    hasMore
  };
};

const mapDispatchToProps = {
  loadChatGallery,
  expandChatGallery
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatGallery);
