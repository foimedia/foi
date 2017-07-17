import { client } from './feathers';
import React, { Component } from 'react';
import styled from 'styled-components';
import styleUtils from '../style-utils';
import Chat from '../components/chat';

const ChatsWrapper = styled.section`
  header {
    margin: 0 0 1rem;
    color: #777;
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
    color: #777;
  }
`;

class Chats extends Component {

  constructor (props) {
    super(props);
    this.state = {
      chats: []
    };
    this.service = client.service('chats');
  }

  componentDidMount () {
    this.setState(Object.assign({}, this.props));

    this.service.on('created', chat => {
      const newChats = this.state.chats.slice();
      newChats.push(chat);
      this.setState({chats: newChats});
    });
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

  hasChats() {
    const { user, chats } = this.state;
    return user !== undefined && (this.hasPrivateChat() || chats.length);
  }

  hasPrivateChat() {
    const { user, chats } = this.state;
    return user.roles.indexOf('publisher') !== -1;
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
          {chats.length && chats.map(chat =>
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
