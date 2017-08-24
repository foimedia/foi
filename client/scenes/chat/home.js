import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadChatStories, loadChatGallery } from 'actions/chats';
import { updateContext } from 'actions/context';
import Stories from 'containers/chat-stories';
import Gallery from 'containers/chat-gallery';
import PullToCallback from 'components/pull-to-callback';

import Loader from 'components/loader';

class ChatHome extends Component {
  componentDidMount () {
    const { chat } = this.props;
    this.reloadContent = this.reloadContent.bind(this);
  }
  reloadContent () {
    const { chat, loadChatStories, loadChatGallery } = this.props;
    loadChatStories(chat.id);
    loadChatGallery(chat.id);
  }
  render () {
    const { chat, fromHistory } = this.props;
    if(chat !== undefined) {
      return (
        <section id="chat-home">
          {!chat.hideGallery &&
            <Gallery chat={chat} />
          }
          <PullToCallback callback={this.reloadContent} />
          <Stories chat={chat} fromHistory={fromHistory} />
        </section>
      )
    }
    return null;
  }
}


const mapStateToProps = (state, ownProps) => {
  const { chatId } = ownProps.match.params;
  return {
    chat: state.chats[chatId]
  }
};

const mapDispatchToProps = {
  loadChatStories,
  loadChatGallery
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatHome);
