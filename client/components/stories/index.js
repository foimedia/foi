import React, { Component } from 'react';
import styled from 'styled-components';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import Transition from 'react-transition-group/Transition';

import client from 'services/feathers';
import styleUtils from 'services/style-utils';

import Loader from 'components/loader';

import Story from './components/story';

const StoriesWrapper = styled.section`
  .fade {
    transition: all 200ms ${styleUtils.transition};
  }
  .fade-entering, .fade-exited {
    transform: translate(0, -1.5rem);
    opacity: 0.01;
  }
  .fade-entered, .fade-exiting {
    transform: translate(0, 0);
    opacity: 1;
  }
`;

class Stories extends Component {

  constructor (props) {
    super(props);
  }

  render () {
    const { stories } = this.props;
    if(stories === undefined) {
      return <Loader size={20} />;
    } else if(!stories.length) {
      return <h2>No posts were found</h2>;
    } else {
      const items = stories.map(story => {
        return <Transition key={`story-${story.id}`} timeout={200}>
          {(status) => (
            <div className={`fade fade-${status}`}>
              <Story story={story} />
            </div>
          )}
        </Transition>;
      });
      return <StoriesWrapper className="stories">
        <TransitionGroup>
          {items}
        </TransitionGroup>
      </StoriesWrapper>;
    }
  }

}

export default Stories;
