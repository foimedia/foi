import React, { Component } from 'react';
import styled from 'styled-components';

import client from 'services/feathers';
import styleUtils from 'services/style-utils';

import Chat from './components/chat';

const ChatsWrapper = styled.section`
  header {
    margin: 0 0 1rem;
  }
  ul {
    max-width: 300px;
    margin: 0 0 1rem;
    padding: 0;
    list-style: none;
    li {
      margin: 0;
      padding: 0;
    }
  }
  footer {
    font-size: .9em;
    font-style: italic;
    color: #999;
  }
`;

class Chats extends Component {

  constructor (props) {
    super(props);
    this.state = {
      chats: []
    };
    this.service = client.service('chats');
    this.newChat = this.newChat.bind(this);
  }

  newChat (chat) {
    const newChats = this.state.chats.slice();
    newChats.push(chat);
    this.setState({chats: newChats});
  }

  componentDidMount () {
    this.setState(Object.assign({}, this.props));

    this.service.on('created', this.newChat);
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextState.user !== this.state.user || nextState.chats !== this.state.chats;
  }

  componentWillReceiveProps (nextProps) {
    this.setState(Object.assign({}, nextProps));
  }

  componentDidUpdate (prevProps, prevState) {
    const { user } = this.state;
    if(user !== undefined) {
      if(this.state.user !== prevState.user) {
        this.service.find({
          query: {
            users: {
              $in: [user.id]
            }
          }
        }).then(res => {
          this.setState({
            chats: res.data
          });
        });
      }
    } else if(this.state.chats.length) {
      this.setState({
        chats: []
      });
    }
  }

  componentWillUnmount () {
    this.service.off('created', this.newChat);
  }

  hasChats() {
    return this.hasPrivateChat() || this.hasGroupChats();
  }

  hasPrivateChat() {
    const { user } = this.state;
    return user !== undefined && user.roles.indexOf('publisher') !== -1;
  }

  hasGroupChats() {
    const { chats } = this.state;
    return chats !== undefined && chats.length;
  }

  render () {
    const { user, chats } = this.state;
    if(this.hasChats()) {
      return <ChatsWrapper>
        <header>
          <h3>Your chats</h3>
          <p>These are the chats you are connected to.</p>
        </header>
        <ul>
          {this.hasPrivateChat() &&
            <li key={user.id}>
              <Chat data={user} />
            </li>
          }
          {this.hasGroupChats() && chats.map(chat =>
            <li key={chat.id}>
              <Chat data={chat} />
            </li>
          )}
        </ul>
        <footer>
          {this.hasPrivateChat() &&
            <p>Invite <strong>@{foi.botName}</strong> to a group for more chats!</p>
          }
        </footer>
      </ChatsWrapper>
    } else {
      return null;
    }
  }

}

export default Chats;
