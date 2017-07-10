import React, { Component } from 'react';
import styled from 'styled-components';
import moment from 'moment';

const StoryFooterBox = styled.footer`
  background: #f6f6f6;
  padding: 1rem 2rem;
  font-size: .8em;
  color: #999;
  border-radius: 0 0 3px 3px;
  p {
    display: inline-block;
    margin: 0 0 0 1rem;
    &.small,
    .small {
      font-size: .8em;
      font-style: italic;
    }
    &:before {
      content: '\00b7';
      display: inline-block;
      margin-right: 1rem;
      font-weight: 600;
    }
    &:nth-child(1) {
      margin: 0;
      &:before {
        content: '';
        margin: 0;
      }
    }
  }
`;

class StoryFooter extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

  }

  getPosts() {
    const { posts } = this.props;
    return posts;
  }

  getContributors() {
    const posts = this.getPosts();
    let contributors = [];
    posts.forEach(post => {
      if(contributors.indexOf(post.creator) == -1)
        contributors.push(post.creator);
    });
    return contributors;
  }

  getLatestPost() {
    const posts = this.getPosts();
    return posts[0];
  }

  geLatestEditedPost() {
    const posts = this.getPosts();
    return posts[0];
  }

  getStoryDate() {
    return this.getFormatted(this.getLatestPost().sentAt);
  }

  getStoryEditedDate() {
    return this.getFormatted(this.getLatestEditedPost().editedAt);
  }

  getFormatted(d) {
    const now = moment();
    const date = moment(d);
    if(now.isSame(date, 'day')) {
      return date.fromNow();
    } else {
      return date.format('LLL');
    }
  }

  render() {
    const { story } = this.props;
    return <StoryFooterBox>
      <p>
        {story.user.first_name} {story.user.last_name}
      </p>
      <p>
        {this.getStoryDate()}
      </p>
    </StoryFooterBox>;
  }
}

export default StoryFooter;
