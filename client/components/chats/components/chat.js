import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Button from 'components/button';

import client from 'services/feathers';
import styleUtils from 'services/style-utils';

import { getTitle, canManage } from 'services/chats';

const ChatWrapper = styled.p`
  span {
    display: block;
  }
  .fa {
    font-weight: normal;
    float: right;
    font-size: 1.5em;
    color: #ddd;
  }
  &:hover {
    .fa {
      color: #999;
      &:hover {
        color: ${styleUtils.color}
      }
    }
  }
`

class Chat extends Component {

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    this.setState(Object.assign({}, this.props));
  }

  componentWillReceiveProps (nextProps) {
    this.setState(Object.assign({}, nextProps));
  }

  render () {
    const { data } = this.state;
    const { user } = this.props;
    return <ChatWrapper>
      {data !== undefined &&
        <span>
          <Link to={`/c/${data.id}`}>{getTitle(data)}</Link>
          {canManage(data, user) &&
            <Link to={`/c/${data.id}/settings`} className="fa fa-gear"></Link>
          }
        </span>
      }
    </ChatWrapper>;
  }

}

export default Chat;
