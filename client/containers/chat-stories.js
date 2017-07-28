import React, { Component } from 'react';
import { connect } from 'react-redux';
import client from 'services/feathers';
import Bundle from 'components/bundle';
import loadStories from 'bundle-loader?lazy!containers/stories';

class ChatStories extends Component {
  constructor (props) {
    super(props);
    this.state = {
      stories: undefined
    }
    this.storyService = client.service('stories');
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
    const chat = this.props.chat.data || this.props.widgetChat;
    const { stories } = this.state;
    if(newStory.chatId == chat.id) {
      const newStories = stories.slice();
      newStories.unshift(newStory);
      this.setState({stories: newStories});
    }
  }

  componentDidMount () {
    const chat = this.props.chat.data || this.props.widgetChat;
    this.getStories(chat.id);
    this.storyService.on('created', this.newStory);
  }

  componentWillUnmount () {
    this.storyService.off('created', this.newStory);
  }

  componentDidUpdate (prevProps, prevState) {
    const chat = this.props.chat.data || this.props.widgetChat;
    const prevChat = prevProps.chat.data || prevProps.widgetChat;
    if(chat !== prevChat && chat) {
      this.getStories(chat.id);
    }
  }

  render () {
    const chat = this.props.chat.data || this.props.widgetChat;
    const { stories } = this.state;
    if(chat !== null && chat !== undefined) {
      return (
        <section id={`chat-${chat.id}-stories`}>
          {stories !== undefined &&
            <Bundle load={loadStories}>
              {Stories => (
                <Stories stories={stories} />
              )}
            </Bundle>
          }
        </section>
      )
    } else {
      return null;
    }
  }

}

function mapStateToProps (state, ownProps) {
  return {
    auth: state.auth,
    chat: state.chats
  };
}

export default connect(mapStateToProps)(ChatStories);
