import React, { Component } from 'react';
import styled from 'styled-components';
import styleUtils from 'services/style-utils';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { services } from 'services/feathers';
import { getTitle } from 'services/chats';
import StoryContainer from 'containers/story';
import ContentHeader from 'components/content/header';
import Loader from 'components/loader';

const Wrapper = styled.section`
  ${styleUtils.media.desktopHD`
    font-size: 1.1em;
    .story-item {
      margin-bottom: 2rem;
    }
  `}
`

const Footer = styled.footer`
  font-size: .6em;
  text-align: right;
`

class Story extends Component {
  constructor (props) {
    super(props);
    this.state = {
      storyId: props.match.params.storyId
    };
  }
  componentDidMount () {
    const { storyId } = this.state;
    this.props.fetchStory(storyId);
  }
  componentDidUpdate (prevProps, prevState) {
    const { storyId } = this.state;
    if(storyId !== prevState.storyId) {
      this.props.fetchStory(storyId);
    }
  }
  componentWillReceiveProps (nextProps, nextState) {
    if(nextProps.match) {
      const { params } = nextProps.match;
      const { storyId } = this.state;
      if(params.storyId != storyId) {
        this.setState({
          storyId: params.storyId
        });
      }
    }
    if(nextProps.story.data !== null && nextProps.story.data.chatId !== this.props.chat.data.id) {
      this.props.fetchStory(nextProps.story.data.chatId);
    }
  }
  render () {
    const { story, chat } = this.props;
    if(story.isError) {
      return (
        <ContentHeader icon="frown-o">
          <p>ERROR: {story.isError.message}</p>
        </ContentHeader>
      )
    } else if(story.data !== null) {
      return (
        <div>
          <ContentHeader icon="bullhorn">
            <h2>
              <Link to={`/c/${chat.data.id}`}>
                {getTitle(chat.data)}
              </Link>
            </h2>
            {story.data.chat.description &&
              <p className="description">{story.data.chat.description}</p>
            }
          </ContentHeader>
          <Wrapper className="single-story">
            <StoryContainer story={story.data} />
            <Footer>
              <p>
                <Link to={`/c/${story.data.chatId}`}>View all stories from this chat</Link>
              </p>
            </Footer>
          </Wrapper>
        </div>
      )
    } else {
      return <Loader size={20} />
    }
  }
}

function mapStateToProps (state, ownProps) {
  return {
    auth: state.auth,
    chat: state.chats,
    story: state.stories
  };
}

const mapDispatchToProps = (dispatch) => ({
  fetchChat: (chatId) => {
    dispatch(services.chats.get(chatId))
  },
  fetchStory: (storyId) => {
    dispatch(services.stories.get(storyId))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Story);
