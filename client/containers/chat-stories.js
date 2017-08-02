import React, { Component } from 'react';
import { connect } from 'react-redux';
import client from 'services/feathers';
import Loader from 'components/loader';
import Button from 'components/button';
import InfiniteScroll from 'components/infinite-scroll';
import Bundle from 'components/bundle';
import loadStories from 'bundle-loader?lazy!containers/stories';

class ChatStories extends Component {

  static defaultProps = {
    more: 'scroll'
  }

  constructor (props) {
    super(props);
    this.state = {
      stories: undefined,
      hasMore: true
    }
    this.service = client.service('stories');
    this.newStory = this.newStory.bind(this);
    this.fetchMore = this.fetchMore.bind(this);
    this.removedStory = this.removedStory.bind(this);
    this.renderStories = this.renderStories.bind(this);
  }

  getChat () {
    return this.props.chat.data || this.props.widgetChat;
  }

  getQuery () {
    const chat = this.getChat();
    return {
      chatId: chat.id,
      $sort: {
        createdAt: chat.archived ? 1 : -1
      }
    };
  }

  fetchStories () {
    // Clear stories before continuing
    this.setState({
      stories: undefined
    });
    this.service.find({
      query: this.getQuery()
    }).then(res => {
      this.setState({
        stories: res.data,
        hasMore: res.total > res.limit
      });
    });
  }

  fetchMore (count) {
    const { hasMore, stories } = this.state;
    if(hasMore) {
      const chat = this.getChat();
      this.service.find({
        query: Object.assign(
          this.getQuery(),
          {
            '$skip': stories.length
          }
        )
      }).then(res => {
        if(res.data.length) {
          const newStories = stories.concat(res.data)
          this.setState({
            stories: newStories,
            hasMore: res.total > newStories.length
          });
        } else {
          this.setState({hasMore: false});
        }
      });
    }
  }

  newStory (newStory) {
    const chat = this.props.chat.data || this.props.widgetChat;
    if(newStory.chatId == chat.id) {
      const { stories } = this.state;
      const newStories = stories.slice();
      newStories.unshift(newStory);
      this.setState({stories: newStories});
    }
  }

  removedStory (removedStory) {
    const chat = this.props.chat.data || this.props.widgetChat;
    if(removedStory.chatId == chat.id) {
      const { stories } = this.state;
      const newStories = stories.filter(story => story.id !== removedStory.id);
      return this.setState({ stories: newStories });
    }
  }

  componentDidMount () {
    const chat = this.props.chat.data || this.props.widgetChat;
    this.fetchStories(chat.id);
    this.service.on('created', this.newStory);
    this.service.on('removed', this.removedStory);
  }

  componentWillUnmount () {
    this.service.off('created', this.newStory);
    this.service.off('removed', this.removedStory);
  }

  componentDidUpdate (prevProps, prevState) {
    const chat = this.props.chat.data || this.props.widgetChat;
    const prevChat = prevProps.chat.data || prevProps.widgetChat;
    if(chat) {
      if(chat !== prevChat) {
        this.fetchStories(chat.id);
      }
    } else {
      this.setState({stories: undefined});
    }
  }

  renderStories () {
    const { stories, hasMore } = this.state;
    const { more } = this.props;
    const renders = {
      'scroll': Stories => (
        <InfiniteScroll loadMore={this.fetchMore} hasMore={hasMore}>
          <Stories stories={stories} />
        </InfiniteScroll>
      ),
      'button': Stories => (
        <div>
          <Stories stories={stories} />
          {hasMore &&
            <Button className="button" href="javascript:void(0);" onClick={this.fetchMore}>Load more</Button>
          }
        </div>
      )
    }
    if(stories !== undefined) {
      return (
        <Bundle load={loadStories}>
          {Stories => renders[more](Stories)}
        </Bundle>
      )
    } else {
      return <Loader size={20} />
    }
  }

  render () {
    const chat = this.getChat();
    const { stories } = this.state;
    if(chat !== null && chat !== undefined) {
      return (
        <section id={`chat-${chat.id}-stories`}>
          {this.renderStories()}
        </section>
      )
    } else {
      return <Loader size={20} />
    }
  }

}

function mapStateToProps (state, ownProps) {
  return {
    auth: state.auth,
    chat: state.chats
  };
}

export default connect(mapStateToProps)(ChatStories);
