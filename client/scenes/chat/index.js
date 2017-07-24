import React, { Component } from 'react';
import styled from 'styled-components';

import { connect } from 'react-redux';
// import { withRouter, Route, Link, Switch, Redirect } from 'react-router-dom';

import Realtime from 'feathers-offline-realtime';

import client, { services } from 'services/feathers';
import styleUtils from 'services/style-utils';

import Loader from 'components/loader';
import Bundle from 'components/bundle';

import loadStories from 'bundle-loader?lazy!components/stories';

import { getTitle, canManage } from 'services/chats';

class Chat extends Component {
  constructor (props) {
    super(props);
    this.state = {
      chatId: props.chatId || props.match.params.chatId
    };
    this.service = client.service('chats');
    this.storyService = client.service('stories');

    // Components
    this.Stories = this.Stories.bind(this);
    this.Settings = this.Settings.bind(this);
  }

  resetRealtime (force = false) {
    if(this.realtime) {
      if(force)
        this.props.resetStories();
      this.realtime.disconnect();
      this.realtime = null;
    }
  }

  realtimeStories (chatId) {
    this.resetRealtime(true);
    this.realtime = new Realtime(this.storyService, {
      query: {
        chatId: chatId
      },
      sort: Realtime.multiSort({ createdAt: -1 })
    });
    this.realtime.on('events', (records, last) => {
      this.props.realtimeStories(this.realtime.connected, last, records);
    });
    this.realtime.connect();
  }

  componentDidMount () {
    const { chatId } = this.state;
    this.realtimeStories(chatId);
    this.props.fetchChat(chatId);
  }

  componentWillUnmount () {
    this.realtime.disconnect();
    this.realtime = null;
  }

  componentDidUpdate (prevProps, prevState) {
    const { chatId } = this.state;
    if(chatId !== prevState.chatId) {
      this.realtimeStories(chatId);
      this.props.fetchChat(chatId);
    }
  }

  componentWillReceiveProps (nextProps) {
    if(nextProps.match) {
      const { params } = nextProps.match;
      const { chatId } = this.state;
      if(params.chatId != chatId) {
        this.setState({
          chatId: params.chatId
        });
      }
    }
  }

  Stories () {
    const { stories } = this.props;
    if(stories.store) {
      return (
        <Bundle load={loadStories}>
          {Stories => (
            <Stories stories={stories.store.records} />
          )}
        </Bundle>
      )
    }
  }

  Settings () {
    // Not on proper cycle
    const { chat, auth } = this.props;
    console.log(JSON.stringify(chat));
    if(chat.isFinished) {
      if(auth.isSignedIn && !auth.user.anonymous && canManage(chat.data, auth.user)) {
        return (
          <form>
            <p>Chat management is under development.</p>
          </form>
        )
      } else {
        return (
          <Redirect to="/" />
        )
      }
    }
  }

  render () {
    const { match, chat, stories } = this.props;
    if(chat.isFinished) {
      return (
        <section id="chat-{chat.data.id}">
          {this.props.header !== false &&
            <header id="content-header">
              <h2>{getTitle(chat.data)}</h2>
            </header>
          }
          {stories.store &&
            <Bundle load={loadStories}>
              {Stories => (
                <Stories stories={stories.store.records} />
              )}
            </Bundle>
          }
          {/* <Switch>
            <Route path={`${match.url}/settings`} component={this.Settings} />
            <Route component={this.Stories} />
          </Switch> */}
        </section>
      )
    } else {
      return <Loader size={20} />;
    }
  }

}

function mapStateToProps (state, ownProps) {
  return {
    auth: state.auth,
    stories: state.stories,
    chat: state.chats
  };
}

const mapDispatchToProps = (dispatch) => ({
  fetchStories: (chatId) => {
    dispatch(services.stories.find({
      query: {
        chatId: chatId,
        $sort: {
          createdAt: -1
        }
      }
    }))
  },
  resetStories: () => {
    dispatch(services.stories.reset())
  },
  realtimeStories: (connected, last, records) => {
    dispatch(services.stories.store({connected: connected, last, records}))
  },
  fetchChat: (chatId) => {
    dispatch(services.chats.get(chatId))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
