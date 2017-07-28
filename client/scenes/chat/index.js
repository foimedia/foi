import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Link, Switch, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { services } from 'services/feathers';
import { getTitle } from 'services/chats';
import ChatStories from 'containers/chat-stories';
import Settings from './settings';
import Loader from 'components/loader';

class Chat extends Component {
  constructor (props) {
    super(props);
    this.state = {
      chatId: props.match.params.chatId
    }
  }

  componentDidMount () {
    const { chatId } = this.state;
    this.props.fetchChat(chatId);
  }

  componentDidUpdate (prevProps, prevState) {
    const { chatId } = this.state;
    if(chatId !== prevState.chatId) {
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

  render () {
    const { match, chat } = this.props;
    const { stories } = this.state;
    if(chat.data !== null) {
      return (
        <section id={`chat-${chat.data.id}`}>
          <header id="content-header">
            <h2>{getTitle(chat.data)}</h2>
          </header>
          <Switch>
            <Route path={`${match.url}/settings`} component={Settings} />
            <Route component={ChatStories} />
          </Switch>
        </section>
      )
    } else {
      return <Loader size={20} />
    }
  }
}

function mapStateToProps (state, ownProps) {
  return {
    auth: state.auth,
    chat: state.chats
  };
}

const mapDispatchToProps = (dispatch) => ({
  fetchChat: (chatId) => {
    dispatch(services.chats.get(chatId))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
