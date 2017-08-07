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
    this.props.fetch(storyId);
  }
  componentDidUpdate (prevProps, prevState) {
    const { storyId } = this.state;
    if(storyId !== prevState.storyId) {
      this.props.fetch(storyId);
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
  }
  render () {
    const { story } = this.props;
    if(story.isError) {
      return (
        <ContentHeader icon="frown-o" inner={true}>
          <p>ERROR: {story.isError.message}</p>
        </ContentHeader>
      )
    } else if(story.data !== null) {
      return (
        <div>
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
    story: state.stories
  };
}

const mapDispatchToProps = (dispatch) => ({
  fetch: (storyId) => {
    dispatch(services.stories.get(storyId))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Story);
