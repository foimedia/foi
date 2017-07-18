import React, { Component } from 'react';
import styled from 'styled-components';
import { Twemoji } from 'react-emoji-render';

import styleUtils from 'services/style-utils';

const TextBox = styled.div`
  margin: .5rem;
  ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
    margin: ${styleUtils.margins[i]}rem;
  `)}
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
