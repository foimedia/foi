import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { withRouter, Route, Link, Switch, Redirect } from 'react-router-dom';
import client, { services } from 'services/feathers';
import Loader from 'components/loader';
import Bundle from 'components/bundle';
import loadStories from 'bundle-loader?lazy!containers/stories';
import { getTitle, canManage } from 'services/chats';

class Chat extends Component {
  constructor (props) {
    super(props);
    this.state = {
      chatId: props.chatId || props.match.params.chatId
    };
    this.storyService = client.service('stories');

    // Components
    this.Stories = this.Stories.bind(this);
    this.Settings = this.Settings.bind(this);

    // Data
    this.newStory = this.newStory.bind(this);
  }

  getStories(chatId) {
    // Clear stories before continuing
    this.setState({
      stories: undefined
    });
    this.storyService.find({
      query: {
        chatId: chatId,
        $sort: {
          createdAt: -1
        }
      }
    }).then(res => {
      this.setState({
        stories: res.data
      });
    });
  }

  newStory (newStory) {
    const { stories, chatId } = this.state;
    if(newStory.chatId == chatId) {
      const newStories = stories.slice();
      newStories.unshift(newStory);
      this.setState({stories: newStories});
    }
  }

  componentDidMount () {
    const { chatId } = this.state;
    this.getStories(chatId);
    this.props.fetchChat(chatId);
    this.storyService.on('created', this.newStory);
  }

  componentWillUnmount () {
    this.storyService.off('created', this.newStory);
  }

  componentDidUpdate (prevProps, prevState) {
    const { chatId } = this.state;
    if(chatId !== prevState.chatId) {
      this.getStories(chatId);
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
    const { match, chat } = this.props;
    const { stories } = this.state;
    if(chat.isFinished) {
      return (
        <section id="chat-{chat.data.id}">
          {this.props.header !== false &&
            <header id="content-header">
              <h2>{getTitle(chat.data)}</h2>
            </header>
          }
          {(stories !== undefined && stories.length) &&
            <Bundle load={loadStories}>
              {Stories => (
                <Stories stories={stories} />
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
    chat: state.chats
  };
}

const mapDispatchToProps = (dispatch) => ({
  fetchChat: (chatId) => {
    dispatch(services.chats.get(chatId))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
