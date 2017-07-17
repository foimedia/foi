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
    margin: 0;
    padding: 0;
    list-style: none;
    li {
      margin: 0;
      padding: 0;
    }
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
    return (nextProps.user != this.state.user) ||
      (JSON.stringify(nextState.chats) != JSON.stringify(this.state.chats));
  }

  componentWillReceiveProps (nextProps) {
    this.setState(Object.assign({}, nextProps));
  }

  componentDidUpdate () {
    const { user } = this.state;
    if(user !== undefined) {
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
    } else {
      this.setState({
        chats: undefined
      });
    }
  }

  render () {
    const { user, chats } = this.state;
    return <ChatsWrapper>
      <header>
        <h3>Your chats</h3>
        <p>These are the chats you are connected to.</p>
      </header>
      <ul>
        {user !== undefined &&
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
    </ChatsWrapper>
  }

}

export default Chats;
