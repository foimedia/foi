import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { canManage } from 'services/chats';
import client from 'services/feathers';
import { hasUser, hasRole } from 'services/auth';
import Loader from 'components/loader';
import Button, { ButtonGroup } from 'components/button';

class ChatSettings extends Component {

  constructor (props) {
    super(props);
    this.service = client.service('chats');
    this.removeChat = this.removeChat.bind(this);
    this.archiveChat = this.archiveChat.bind(this);
  }

  componentDidMount () {
  }

  removeChat () {
    if(confirm('Are you sure? This will remove all chat data, including posts, stories and media!')) {
      this.service.remove(this.props.chat.data.id);
    }
  }

  archiveChat () {

  }

  render () {
    const { chat, auth } = this.props;
    if(chat.data !== null && auth.user !== null) {
      return (
        <section id="chat-settings">
          {!canManage(chat.data, auth) &&
            <Redirect to="/" />
          }
          <div className="sections">
            <div className="main-settings content-section">
              <h3>Chat settings</h3>
            </div>
            {chat.data.type !== 'private' &&
              <ButtonGroup alignright>
                <Button onClick={this.archiveChat}>Archive chat</Button>
                <Button primary onClick={this.removeChat}>Delete chat</Button>
              </ButtonGroup>
            }
          </div>
        </section>
      )
    } else {
      return <Loader size={20} />
    }
  }

}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    chat: state.chats
  }
};

export default connect(mapStateToProps)(ChatSettings);
