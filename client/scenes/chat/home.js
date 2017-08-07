import React, { Component } from 'react';
import { connect } from 'react-redux';

import Stories from 'containers/chat-stories';
import Gallery from 'containers/chat-gallery';

import Loader from 'components/loader';

class ChatHome extends Component {
  render () {
    const { chat } = this.props;
    if(chat.data !== null && chat.data !== undefined) {
      return (
        <section id="chat-home">
          {chat.data.displayGallery &&
            <Gallery />
          }
          <Stories />
        </section>
      )
    } else {
      return <Loader size={20} />
    }
  }
}

const mapStateToProps = state => {
  return {
    chat: state.chats
  }
};

export default connect(mapStateToProps)(ChatHome);
