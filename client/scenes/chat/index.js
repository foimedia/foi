import React, { Component } from 'react';
import styled from 'styled-components';

import client from 'services/feathers';
import styleUtils from 'services/style-utils';

import Loader from 'components/loader';
import Stories from 'components/stories';

import { getTitle } from 'services/chats';

class Chat extends Component {
  constructor (props) {
    super(props);
    this.state = {
      chatId: props.match.params.chatId
    };
    this.service = client.service('chats');
    this.getChat = this.getChat.bind(this);
  }

  getChat () {
    // Clear chat before continuing
    this.setState({
      chat: undefined
    });
    const { chatId } = this.state;
    this.service.get(chatId).then(chat => {
      this.setState({ chat });
    });
  }

  componentDidMount () {
    this.getChat();
  }

  componentDidUpdate (prevProps, prevState) {
    const { chatId } = this.state;
    if(chatId !== prevState.chatId) {
      this.getChat();
    }
  }

  componentWillReceiveProps (nextProps) {
    const { params } = nextProps.match;
    const { chatId } = this.state;
    if(params.chatId != chatId) {
      this.setState({
        chatId: params.chatId
      });
    }
  }

  render () {
    const { chat } = this.state;
    if(chat !== undefined) {
      return <section id="chat-{chat.id}">
        <header id="content-header">
          <h2>{getTitle(chat)}</h2>
        </header>
        <Stories query={{chatId: chat.id}} />
      </section>;
    } else {
      return <Loader size={40} />;
    }
  }

}

export default Chat;
