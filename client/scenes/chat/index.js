import React, { Component } from 'react';
import styled from 'styled-components';

import { Route, Link } from 'react-router-dom';

import client from 'services/feathers';
import styleUtils from 'services/style-utils';

import Loader from 'components/loader';
import Bundle from 'components/bundle';

import loadStories from 'bundle-loader?lazy!components/stories';

import { getTitle } from 'services/chats';

class Chat extends Component {
  constructor (props) {
    super(props);
    this.state = {
      chatId: props.match.params.chatId
    };
    this.service = client.service('chats');
    this.storyService = client.service('stories');
    this.getChat = this.getChat.bind(this);
    this.newStory = this.newStory.bind(this);
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

  getStories() {
    // Clear stories before continuing
    this.setState({
      stories: undefined
    });
    const { chatId } = this.state;
    this.storyService.find({
      query: {
        chatId: chatId,
        $sort: {
          createdAt: -1
        }
      }
    }).then(res => {
      this.setState({
        stories: res.data
      });
    });
  }

  newStory (newStory) {
    const { stories, chatId } = this.state;
    if(newStory.chatId == chatId) {
      const newStories = stories.slice();
      newStories.unshift(newStory);
      this.setState({stories: newStories});
    }
  }

  componentDidMount () {
    this.getChat();
    this.getStories();
    this.storyService.on('created', this.newStory);
  }

  componentWillUnmount () {
    this.storyService.off('created', this.newStory);
  }

  componentDidUpdate (prevProps, prevState) {
    const { chatId } = this.state;
    if(chatId !== prevState.chatId) {
      this.getChat();
      this.getStories();
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
    const { match } = this.props;
    const { chat, stories } = this.state;
    if(chat !== undefined) {
      return (
        <section id="chat-{chat.id}">
          {this.props.header !== false &&
            <header id="content-header">
              {match.url !== undefined &&
                <Route path={`${match.url}/manage`} render={() => (
                  <h3>Manage</h3>
                )} />
              }
              <h2>{getTitle(chat)}</h2>
            </header>
          }
          {stories !== undefined &&
            <Bundle load={loadStories}>
              {Stories => (
                <Stories stories={stories} />
              )}
            </Bundle>
          }
        </section>
      )
    } else {
      return <Loader size={20} />;
    }
  }

}

export default Chat;
