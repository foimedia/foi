import React, { Component } from 'react';
import Loader from 'components/loader';
import StoriesComponent from 'components/stories';
import Story from 'containers/story';

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
