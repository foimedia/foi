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
    this.service = client.service('stories');
    this.newStory = this.newStory.bind(this);
    this.removedStory = this.removedStory.bind(this);
  }

  getStories(chatId) {
    // Clear stories before continuing
    this.setState({
      stories: undefined
    });
    this.service.find({
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

  removedStory (removedStory) {
    const chat = this.props.chat.data || this.props.widgetChat;
    const { stories } = this.state;
    if(removedStory.chatId == chat.id) {
      const newStories = stories.filter(story => story.id !== removedStory.id);
      return this.setState({ stories: newStories });
    }
  }

  componentDidMount () {
    const chat = this.props.chat.data || this.props.widgetChat;
    this.getStories(chat.id);
    this.service.on('created', this.newStory);
    this.service.on('removed', this.removedStory);
  }

  componentWillUnmount () {
    this.service.off('created', this.newStory);
    this.service.off('removed', this.removedStory);
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
