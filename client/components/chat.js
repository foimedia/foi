import { client } from '../main/feathers';
import React, { Component } from 'react';
import styled from 'styled-components';
import styleUtils from '../style-utils';

import { Link } from 'react-router-dom';

const ChatWrapper = styled.article`
  padding: .5rem 1rem;
  border: 1px solid #ddd;
  border-radius: ${styleUtils.radius}px;
  margin: 0 0 .5rem;
  cursor: default;
  &:hover {
    border-color: #ccc;
  }
  a {
    display: block;
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
    return <ChatWrapper>
      {data !== undefined &&
        <h4><Link to={`/c/${data.id}`}>{data.title || data.first_name}</Link></h4>
      }
    </ChatWrapper>;
  }

}

export default Chat;
