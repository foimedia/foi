import React, { Component } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import Link from 'components/smart-link';
import ActionsBox from 'components/actions-box';

import styleUtils from 'services/style-utils';

const StoryFooterBox = styled.footer`
  padding: 0 .5rem .5rem;
  font-size: .7em;
  color: #999;
  border-radius: 0 0 3px 3px;
  position: relative;
  ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
    padding-left: ${styleUtils.margins[i]}rem;
    padding-right: ${styleUtils.margins[i]}rem;
    padding-bottom: ${styleUtils.margins[i]}rem;
  `)}
  p {
    display: inline-block;
    margin: 0 0 0 .5rem;
    &.small,
    .small {
      font-size: .8em;
    }
    &:before {
      content: '\00b7';
      display: inline-block;
      margin-right: .5rem;
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
  .actions {
    position: absolute;
    bottom: 0;
    right: 0;
    line-height: 1;
    ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
      padding-bottom: ${styleUtils.margins[i]}rem;
      padding-right: ${styleUtils.margins[i]}rem;
      padding-left: ${styleUtils.margins[i]}rem;
    `)}
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
    return (
      <StoryFooterBox>
        <p>
          {story.user.first_name} {story.user.last_name}
        </p>
        <p>
          <Link to={`/c/${story.chatId}/s/${story.id}`}>{this.getStoryDate()}</Link>
        </p>
        {this.props.canRemove &&
          <ActionsBox className="actions interactive">
            <a href="javascript:void(0)" onClick={this.props.remove} title="Remove story">
              <span className="fa fa-remove"></span>
              Remove
            </a>
          </ActionsBox>
        }
      </StoryFooterBox>
    )
  }
}

export default StoryFooter;
