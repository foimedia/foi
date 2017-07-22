import React, { Component } from 'react';

import client from 'services/feathers';

import Bundle from 'components/bundle';
import loadStories from 'bundle-loader?lazy!components/stories';

class Home extends Component {
  constructor (props) {
    super(props);
    this.storyService = client.service('stories');
    this.newStory = this.newStory.bind(this);
  }

  newStory (newStory) {
    const { stories, chatId } = this.state;
    const newStories = stories.slice();
    newStories.unshift(newStory);
    this.setState({stories: newStories});
  }

  componentDidMount () {
    this.storyService.find({
      query: {
        $sort: {
          createdAt: -1
        }
      }
    }).then(res => {
      this.setState({
        stories: res.data
      });
      this.storyService.on('created', this.newStory);
    });
  }

  componentWillUnmount () {
    this.storyService.off('created', this.newStory);
  }

  render () {
    const { stories } = this.state;
    return (
      <Bundle load={loadStories}>
        {Stories => (
          <Stories stories={stories} />
        )}
      </Bundle>
    )
  }
}

export default Home;
