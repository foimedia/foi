import { client } from '../main/feathers';
import React, { Component } from 'react';
import styled from 'styled-components';

const ChatWrapper = styled.article`
  padding: .5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin: 0 0 .5rem;
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
        <h4>{data.title || data.first_name}</h4>
      }
    </ChatWrapper>;
  }

}

export default Chat;
