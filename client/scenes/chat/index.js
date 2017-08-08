import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Link, Switch, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { services } from 'services/feathers';
import { getTitle } from 'services/chats';

import ContentHeader from 'components/content/header';
import Loader from 'components/loader';

import Home from './home';
import Settings from './settings';
import Story from './story';

import Gallery from 'containers/chat-gallery';

class Chat extends Component {

  previousLocation = this.props.location

  constructor (props) {
    super(props);
    this.state = {
      chatId: parseInt(props.match.params.chatId)
    }
  }

  componentDidMount () {
    const { chatId } = this.state;
    const { chat } = this.props;
    if(chat.data === null || chat.data.id !== chatId) {
      this.props.fetch(chatId);
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const { chatId } = this.state;
    if(chatId !== prevState.chatId) {
      this.props.fetch(chatId);
    }
  }

  componentWillUpdate (nextProps) {
    const { location } = this.props
    // set previousLocation if props.location is not modal
    if (
      nextProps.history.action !== 'POP' &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = this.props.location
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
    if(chat.isError) {
      return (
        <ContentHeader icon="frown-o">
          <p>ERROR: {chat.isError.message}</p>
        </ContentHeader>
      )
    } else if(chat.data !== null) {
      const { id } = chat.data;
      return (
        <section id={`chat-${id}`}>
          <ContentHeader icon={this.isSettings() ? 'cog' : 'bullhorn'}>
            <h2>
              <Link to={`/c/${id}`}>
                {getTitle(chat.data)}
              </Link>
            </h2>
            {chat.data.description &&
              <p className="description">{chat.data.description}</p>
            }
          </ContentHeader>
          <Switch location={isModal ? this.previousLocation : location}>
            <Route path={`${match.url}/settings`} component={Settings} />
            <Route path={`${match.url}/s/:storyId`} component={Story} />
            <Route component={Home} />
          </Switch>
          {isModal ? <Route path={`${match.url}/s/:storyId`} component={Gallery} /> : null}
        </section>
      )
    } else {
      return <Loader size={20} />
    }
  }
}

function mapStateToProps (state, ownProps) {
  return {
    chat: state.chats
  };
}

const mapDispatchToProps = (dispatch) => ({
  fetch: (chatId) => dispatch(services.chats.get(chatId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
