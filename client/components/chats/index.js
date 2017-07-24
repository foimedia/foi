import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import client from 'services/feathers';
import styleUtils from 'services/style-utils';

import Chat from './components/chat';

const ChatsWrapper = styled.section`
  header {
    margin: 0 0 1rem;
  }
  ul {
    max-width: 400px;
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
    const { auth } = this.props;
    if(auth.user !== null && auth.user.first_name) {
      if(this.props.auth.user !== prevProps.auth.user) {
        this.service.find({
          query: {
            $or: [
              {
                users: {
                  $in: [auth.user.id]
                }
              },
              {
                id: auth.user.id
              }
            ],
            $sort: {
              id: -1
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

  isPublisher() {
    const { auth } = this.props;
    return auth.isSignedIn && auth.user.roles.indexOf('publisher') !== -1;
  }

  hasChats() {
    const { chats } = this.props;
    return chats.length;
  }

  render () {
    const { auth, chats } = this.props;
    if(this.hasChats()) {
      return <ChatsWrapper>
        <header>
          <h3>Your chats</h3>
          <p>These are the chats you are connected to.</p>
        </header>
        <ul>
          {this.hasChats() && chats.map(chat =>
            <li key={chat.id}>
              <Chat data={chat} user={auth.user} />
            </li>
          )}
        </ul>
        <footer>
          {this.isPublisher() &&
            <p>Invite <strong>@{foi.botName}</strong> to a group for more chats!</p>
          }
        </footer>
      </ChatsWrapper>
    } else {
      return null;
    }
  }

}

function mapStateToProps (state) {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps)(Chats);
