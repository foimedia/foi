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
    const { chat } = this.props;
    this.props.loadChatStories(chat.id);
  }

  componentDidUpdate (prevProps, prevState) {
    const { chat } = this.props;
    if(chat !== undefined) {
      if(prevProps.chat !== undefined && chat.id !== prevProps.chat.id) {
        this.props.loadChatStories(chat.id);
      }
    }
  }

  renderStories () {
    const { stories, more, context } = this.props;
    if(stories !== undefined && stories) {
      const hasMore = !!(context.limit + context.skip < context.total);
      const display = stories.slice(0, (context.limit + context.skip));
      const renders = {
        'scroll': (Component) => (
          <InfiniteScroll loadMore={this.fetchMore} hasMore={hasMore}>
            <Component stories={display} />
          </InfiniteScroll>
        ),
        'button': (Component) => (
          <div>
            <Component stories={display} />
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

const getChatStories = (chat, stories) => {
  if(chat !== undefined && chat.stories !== undefined) {
    return chat.stories.reduce((res, id) => {
      if(stories[id])
        res.push(stories[id]);
      return res;
    }, []);
  }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.chat;
  return {
    stories: getChatStories(state.chats[id], state.stories),
    context: state.context.chats[id].stories
  };
};

const mapDispatchToProps = {
  loadChatStories,
  expandChatStories
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatStories);
