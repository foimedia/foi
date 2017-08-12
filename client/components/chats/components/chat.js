import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Button from 'components/button';

import client from 'services/feathers';
import styleUtils from 'services/style-utils';

import { getTitle, canManage } from 'services/chats';

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
    const { auth } = this.props;
    return (
      <p>
        {data !== undefined &&
          <span className="item">
            <Link to={`/c/${data.id}`}>
              {getTitle(data)}
              {data.archived &&
                <span className="attr-icon fa fa-archive" title="This chat is archived"></span>
              }
              {(data.type !== 'private' && !data.active) &&
                <span className="attr-icon fa fa-warning" title="This chat is not active"></span>
              }
            </Link>
            <span className="actions">
              {canManage(data, auth) &&
                <Link to={`/c/${data.id}/settings`} className="fa fa-gear"></Link>
              }
            </span>
          </span>
        }
      </p>
    )
  }

}

export default Chat;
