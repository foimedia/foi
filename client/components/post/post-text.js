import React, { Component } from 'react';
import styled from 'styled-components';
import { Twemoji } from 'react-emoji-render';

const TextBox = styled.div`
  margin: 1.5rem;
  p {
    margin: 0;
  }
`

class PostText extends Component {

  render() {
    const { data } = this.props;

    return <TextBox>
      {data.split('\n').map((item, key) => {
        return <p key={key}><Twemoji text={item} /><br/></p>
      })}
    </TextBox>;
  }

}

export default PostText;
