import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateContext } from 'actions/context';
import Stories from 'containers/chat-stories';
import Gallery from 'containers/chat-gallery';

import Loader from 'components/loader';

class ChatHome extends Component {
  componentDidMount () {
    const { chat } = this.props;
  }
  render () {
    const { chat, fromHistory } = this.props;
    if(chat !== undefined) {
      return (
        <section id="chat-home">
          {!chat.hideGallery &&
            <Gallery chat={chat} />
          }
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

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ChatHome);
