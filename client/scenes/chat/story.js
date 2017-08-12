import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { loadStory } from 'actions/stories';
import styleUtils from 'services/style-utils';
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
    const { storyId } = this.props.match.params;
    this.props.loadStory(storyId);
  }
  componentWillReceiveProps (nextProps, nextState) {
    const { storyId } = this.props.match.params;
    if(nextProps.match) {
      const { params } = nextProps.match;
      if(params.storyId !== storyId) {
        this.props.loadStory();
      }
    }
  }
  render () {
    const { story } = this.props;
    if(story !== undefined) {
      return (
        <div>
          <Wrapper className="single-story">
            <StoryContainer story={story} />
            <Footer>
              <p>
                <Link to={`/c/${story.chatId}`}>View all stories from this chat</Link>
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
  const { storyId } = ownProps.match.params;
  return {
    story: state.stories[storyId]
  };
}

const mapDispatchToProps = {
  loadStory
};

export default connect(mapStateToProps, mapDispatchToProps)(Story);
