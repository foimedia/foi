import React, { Component } from 'react';
import client from 'services/feathers';
import { connect } from 'react-redux';
import { hasUser } from 'services/auth';
import Bundle from 'components/bundle';
import loadChats from 'bundle-loader?lazy!components/chats';

class UserChats extends Component {
  constructor (props) {
    super(props);
    this.state = {
      userChats: undefined
    };
    this.service = client.service('chats');
    this.newUserChat = this.newUserChat.bind(this);
    this.removedUserChat = this.removedUserChat.bind(this);
  }

  fetchUserChats (userId = false) {
    return this.service.find({
      query: {
        $or: [
          {
            users: {
              $in: [userId]
            }
          },
          {
            id: userId
          }
        ],
        $sort: {
          id: -1
        }
      }
    });
  }

  newUserChat (newChat) {
    const { userChats } = this.state;
    const newUserChats = userChats.slice();
    newUserChats.push(newChat);
    return this.setState({ userChats: newUserChats });
  }

  removedUserChat (removedChat) {
    const { userChats } = this.state;
    const newUserChats = userChats.filter(chat => chat.id !== removedChat.id);
    return this.setState({ userChats: newUserChats });
  }

  componentDidMount () {
    const { auth } = this.props;
    if(hasUser(auth)) {
      this.fetchUserChats(auth.user.id).then(res => {
        this.setState({
          userChats: res.data
        })
      });
    }
    this.service.on('created', this.newUserChat);
    this.service.on('removed', this.removedUserChat);
  }

  componentWillUpdate (nextProps) {
    if(nextProps.auth !== this.props.auth) {
      this.setState({userChats: undefined});
      if(nextProps.auth.user) {
        this.fetchUserChats(nextProps.auth.user.id).then(res => {
          this.setState({
            userChats: res.data
          })
        });
      }
    }
  }

  componentWillUnmount () {
    this.service.off('created', this.newUserChat);
    this.service.off('removed', this.deleteUserChat);
  }

  render () {
    const { auth } = this.props;
    const { userChats } = this.state;
    if(userChats !== undefined) {
      return (
        <Bundle load={loadChats}>
          {Chats => (
            <Chats chats={userChats} />
          )}
        </Bundle>
      )
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return { auth: state.auth }
}

export default connect(mapStateToProps)(UserChats);
