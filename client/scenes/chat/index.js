import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Link, Switch, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { services } from 'services/feathers';
import { getTitle } from 'services/chats';
import Stories from 'containers/chat-stories';
import Settings from './settings';
import ContentHeader from 'components/content/header';
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
    this.props.fetch(chatId);
  }

  componentDidUpdate (prevProps, prevState) {
    const { chatId } = this.state;
    if(chatId !== prevState.chatId) {
      this.props.fetch(chatId);
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
    if(chat.isError) {
      return (
        <ContentHeader>
          <p>{chat.isError.message}</p>
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
          <Switch>
            <Route path={`${match.url}/settings`} component={Settings} />
            <Route component={Stories} />
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
  fetch: (chatId) => dispatch(services.chats.get(chatId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
