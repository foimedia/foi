import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadChatStories, expandChatStories } from 'actions/chats';
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
    this.fetchMore = this.fetchMore.bind(this);
    this.renderStories = this.renderStories.bind(this);
  }

  fetchMore () {
    this.props.expandChatStories(this.props.chat.id);
  }

  componentDidMount () {
    const { chat, fromHistory } = this.props;
    this.props.loadChatStories(chat.id, fromHistory);
  }

  componentDidUpdate (prevProps, prevState) {
    const { chat, fromHistory } = this.props;
    if(chat !== undefined) {
      if(prevProps.chat !== undefined && chat.id !== prevProps.chat.id) {
        this.props.loadChatStories(chat.id, fromHistory);
      }
    }
  }

  renderStories () {
    const { stories, more, hasMore } = this.props;
    if(stories !== undefined && stories) {
      const renders = {
        'scroll': (Component) => (
          <InfiniteScroll loadMore={this.fetchMore} hasMore={hasMore}>
            <Component stories={stories} />
          </InfiniteScroll>
        ),
        'button': (Component) => (
          <div>
            <Component stories={stories} />
            {hasMore &&
              <Button className="button" href="javascript:void(0);" onClick={this.fetchMore}>Load more</Button>
            }
          </div>
        )
      }
      return (
        <Bundle load={loadStories}>
          {(Stories) => renders[more](Stories)}
        </Bundle>
      )
    } else {
      return <Loader size={20} />
    }
  }

  render () {
    const { chat } = this.props;
    if(chat !== null && chat !== undefined) {
      return (
        <section id={`chat-${chat.id}-stories`}>
          {this.renderStories()}
        </section>
      )
    }
  }

}

const getChatStories = (chat, stories, context) => {
  if(chat !== undefined && chat.stories !== undefined) {
    const amount = context.limit + context.skip;
    return chat.stories.slice(0, amount).reduce((res, id) => {
      if(stories[id])
        res.push(stories[id]);
      return res;
    }, []);
  }
};

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.chat;
  const context = state.context.chats[id].stories;
  const { scrollHistory } = state.context;
  const hasMore = !!(context.limit + context.skip < context.total);
  return {
    stories: getChatStories(state.chats[id], state.stories, context),
    hasMore
  };
};

const mapDispatchToProps = {
  loadChatStories,
  expandChatStories
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatStories);
