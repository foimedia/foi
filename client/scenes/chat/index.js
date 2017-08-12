import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Link, Switch, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { loadChat } from 'actions/chats';
import { getTitle } from 'services/chats';

import ContentHeader from 'components/content/header';
import Loader from 'components/loader';

import Home from './home';
import Settings from './settings';
import Story from './story';

import Gallery from 'containers/chat-gallery';

class Chat extends Component {

  previousLocation = this.props.location

  componentDidMount () {
    const { chatId } = this.props.match.params;
    const { chat } = this.props;
    this.props.loadChat(chatId);
  }

  componentWillReceiveProps (nextProps) {
    const { chatId } = this.props.match.params;
    const nextId = nextProps.match.params.chatId;
    if(chatId !== nextId) {
      this.props.loadChat(nextId);
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
    const { match, chat } = this.props;
    const { stories } = this.state;
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
          <Switch location={isModal ? this.previousLocation : location}>
            <Route path={`${match.path}/settings`} component={Settings} />
            <Route path={`${match.path}/s/:storyId`} component={Story} />
            <Route component={Home} />
          </Switch>
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

function mapStateToProps (state, ownProps) {
  return {
    chat: state.chats[ownProps.match.params.chatId]
  };
}

const mapDispatchToProps = {
  loadChat
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
