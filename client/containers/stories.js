import React, { Component } from 'react';
import Loader from 'components/loader';
import StoriesComponent from 'components/stories';
import Story from 'containers/story';

class Stories extends Component {

  render () {
    const { stories } = this.props;
    if(stories === undefined || !stories) {
      return null;
    } else if(!stories.length) {
      return <p>No posts were found.</p>;
    } else {
      return (
        <StoriesComponent>
          {stories.map(story =>
            <Story key={`story-${story.id}`} story={story} />
          )}
        </StoriesComponent>
      )
    }
  }

}

export default Stories;
