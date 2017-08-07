import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route } from 'react-router-dom';
import client from 'services/feathers';
import Loader from 'components/loader';
import Button from 'components/button';
import { GalleryList, Gallery } from 'components/gallery';
import Thumb from 'components/posts/thumb';

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
    this.state = {
      posts: undefined,
      hasMore: true
    }
    this.service = client.service('posts');
    this.newPost = this.newPost.bind(this);
    this.fetchMore = this.fetchMore.bind(this);
    this.removedPost = this.removedPost.bind(this);
  }

  getChat () {
    return this.props.chat.data || this.props.widgetChat;
  }

  getQuery () {
    const chat = this.getChat();
    const { types } = this.props;
    return {
      chatId: chat.id,
      type: {
        $in: types
      },
      $limit: 10,
      $sort: {
        sentAt: -1
      }
    };
  }

  fetch () {
    // Clear posts before continuing
    this.setState({
      posts: undefined
    });
    this.service.find({
      query: this.getQuery()
    }).then(res => {
      this.setState({
        posts: res.data,
        hasMore: res.total > res.limit
      });
    });
  }

  fetchMore () {
    const { hasMore, posts } = this.state;
    if(hasMore) {
      return new Promise((resolve, reject) => {
        const chat = this.getChat();
        this.service.find({
          query: Object.assign(
            this.getQuery(),
            {
              '$skip': posts.length
            }
          )
        }).then(res => {
          if(res.data.length) {
            const newPosts = posts.concat(res.data)
            this.setState({
              posts: newPosts,
              hasMore: res.total > newPosts.length
            });
            resolve(newPosts[0]);
          } else {
            this.setState({hasMore: false});
            resolve();
          }
        });
      });
    }
  }

  newPost (newPost) {
    const { types } = this.props;
    const chat = this.props.chat.data || this.props.widgetChat;
    if(newPost.chatId == chat.id && types.indexOf(newPost.type) !== -1) {
      const { posts } = this.state;
      const newPosts = posts.slice();
      newPosts.unshift(newPost);
      this.setState({posts: newPosts});
    }
  }

  removedPost (removedPost) {
    const chat = this.props.chat.data || this.props.widgetChat;
    if(removedPost.chatId == chat.id) {
      const { posts } = this.state;
      const newPosts = posts.filter(story => story.id !== removedPost.id);
      return this.setState({ posts: newPosts });
    }
  }

  componentDidMount () {
    const chat = this.props.chat.data || this.props.widgetChat;
    this.fetch(chat.id);
    this.service.on('created', this.newPost);
    this.service.on('removed', this.removedPost);
  }

  componentWillUnmount () {
    this.service.off('created', this.newPost);
    this.service.off('removed', this.removedPost);
  }

  componentDidUpdate (prevProps, prevState) {
    const chat = this.props.chat.data || this.props.widgetChat;
    const prevChat = prevProps.chat.data || prevProps.widgetChat;
    if(chat) {
      if(chat !== prevChat) {
        this.fetch(chat.id);
      }
    } else {
      this.setState({posts: undefined});
    }
  }

  render () {
    var self = this;
    const chat = this.getChat();
    const { posts, hasMore } = this.state;
    const { location, ...props } = this.props;
    const isModal = !!(
      location !== undefined &&
      location.state &&
      location.state.modal
    )
    if(chat !== null && chat !== undefined && posts !== undefined) {
      if(posts.length) {
        if(!isModal) {
          return (
            <section id={`chat-${chat.id}-gallery`}>
              <GalleryList>
                {posts.slice(0,5).map(post => (
                  <Thumb key={`gallery-post-${post.id}`} post={post} />
                ))}
              </GalleryList>
            </section>
          )
        } else {
          return (
            <Gallery loadMore={this.fetchMore} hasMore={hasMore} posts={posts} post={location.state.post} index={location.state.index} />
          )
        }
      } else {
        return null;
      }
    } else {
      return <Loader size={20} />
    }
  }

}

function mapStateToProps (state, ownProps) {
  return {
    chat: state.chats
  };
}

export default connect(mapStateToProps)(ChatGallery);
