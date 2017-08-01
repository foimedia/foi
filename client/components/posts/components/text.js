import React, { Component } from 'react';
import styled from 'styled-components';
import { Twemoji } from 'react-emoji-render';
import Linkify from 'react-linkify';

import styleUtils from 'services/style-utils';

const TextBox = styled.div`
  margin: .5rem;
  ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
    margin: ${styleUtils.margins[i]}rem;
    p {
      margin: 0 0 ${styleUtils.margins[i]}rem;
    }
  `)}
`

class PostText extends Component {

  constructor (props) {
    super(props);
  }

  render() {
    const { data } = this.props;

    return (
      <TextBox>
        <Linkify>
          {data.split('\n').map((item, key) =>
            // Twemoji uses prop instead of children, Linkify doesnt work 
            // <p key={key}><Twemoji text={item} /></p>
            <p key={key}>{item}</p>
          )}
        </Linkify>
      </TextBox>
    )
  }

}

export default PostText;
