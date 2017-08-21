import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Link, Switch, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { loadChat } from 'actions/chats';
import { getTitle } from 'services/chats';

import ContentHeader from 'components/content/header';
import ContentBody from 'components/content/body';
import Loader from 'components/loader';

import Home from './home';
import Settings from './settings';
import Story from './story';

import Gallery from 'containers/chat-gallery';

class Chat extends Component {

  previousLocation = this.props.location

  componentDidMount () {
    const { chatId } = this.props.match.params;
    const { chat, fromHistory } = this.props;
    if(this.props.ready) {
      this.props.loadChat(chatId, fromHistory);
    }
  }

  componentWillReceiveProps (nextProps) {
    const { chatId } = this.props.match.params;
    const nextId = nextProps.match.params.chatId;
    if(
      nextProps.ready &&
      (chatId !== nextId || this.props.ready !== nextProps.ready)
    ) {
      this.props.loadChat(nextId, nextProps.fromHistory);
    }
  }

  componentWillUpdate (nextProps) {
    const { location } = this.props;
    if (
      nextProps.history.action !== 'POP' &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = this.props.location;
    }
  }

  isSettings () {
    const { location } = this.props;
    return location.pathname.indexOf('settings') !== -1;
  }

  render () {
    const { match, chat, fromHistory } = this.props;
    const { location } = this.props;
    const isModal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location // not initial render
    )
    if(chat !== undefined) {
      const { id } = chat;
      return (
        <section id={`chat-${id}`}>
          <ContentHeader icon={this.isSettings() ? 'cog' : 'bullhorn'}>
            <h2>
              <Link to={`/c/${id}`}>
                {getTitle(chat)}
              </Link>
            </h2>
            {chat.description &&
              <p className="description">{chat.description}</p>
            }
          </ContentHeader>
          <ContentBody>
            <Switch location={isModal ? this.previousLocation : location}>
              <Route path={`${match.path}/settings`} component={Settings} />
              <Route path={`${match.path}/s/:storyId`} component={Story} />
              <Route render={props => (
                <Home {...props} fromHistory={fromHistory} />
              )} />
            </Switch>
          </ContentBody>
          {isModal ? <Route path={`${match.path}/s/:storyId`} render={props => (
            <Gallery chat={chat} {...props} />
          )} /> : null}
        </section>
      )
    } else {
      return <Loader size={20} />
    }
  }
}

function getFromHistory (scrollHistory, key) {
  return !!scrollHistory[key];
}

function mapStateToProps (state, ownProps) {
  const { scrollHistory } = state.context;
  return {
    ready: state.context.rehydrated,
    chat: state.chats[ownProps.match.params.chatId],
    fromHistory: getFromHistory(scrollHistory, ownProps.location.key)
  };
}

const mapDispatchToProps = {
  loadChat
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
