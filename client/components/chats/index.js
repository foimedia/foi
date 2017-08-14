import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import client from 'services/feathers';
import styleUtils from 'services/style-utils';
import { hasRole } from 'services/auth';

import ButtonedList from 'components/buttoned-list'
import Chat from './components/chat';

const ChatsWrapper = styled.section`
  header {
    ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
      margin-bottom: ${styleUtils.margins[i]}rem;
    `)}
  }
  footer {
    font-size: .8em;
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

  hasChats() {
    const { chats } = this.props;
    return chats.length;
  }

  render () {
    const { auth, chats } = this.props;
    if(this.hasChats()) {
      return (
        <ChatsWrapper>
          <header>
            <h3>Your chats</h3>
            <p>These are the chats you are connected to.</p>
          </header>
          <ButtonedList dark>
            {this.hasChats() && chats.map(chat =>
              <li key={chat.id}>
                <Chat data={chat} auth={auth} />
              </li>
            )}
          </ButtonedList>
          <footer>
            {hasRole(auth, 'publisher') &&
              <p>Invite <strong>@{foi.botName}</strong> to a group for more chats!</p>
            }
          </footer>
        </ChatsWrapper>
      )
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
