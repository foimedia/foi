import React, { Component } from 'react';
import styled from 'styled-components';
import styleUtils from '../style-utils';

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding-top: .5rem;
  padding-bottom: .5rem;
  padding-left: .5rem;
  padding-right: .5rem;
  font-size: .8em;
  background: #fff;
  color: #333;
  z-index: 10;
  ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
    padding-left: ${styleUtils.margins[i]}rem;
    padding-right: ${styleUtils.margins[i]}rem;
  `)}
  a {
    color: inherit;
    text-decoration: none;
  }
  h2 {
    font-size: inherit;
    font-weight: inherit;
    margin: 0;
  }
  h2, p {
    display: inline-block;
    margin: 0 .5rem 0 0;
  }
  nav#auth {
    float: right;
    font-weight: 600;
  }
`;

class Header extends Component {

  constructor (props) {
    super(props);
    this.logout = this.props.logout;
  }

  render () {
    const { user, payload } = this.props;
    return <HeaderWrapper>
      <nav id="auth">
        {(user === undefined && payload !== undefined) &&
          <a href={`https://telegram.me/${foi.botName}?start=${payload.key}`} target="_blank">Authenticate</a>
        }
        {user !== undefined &&
          <div>
            <h2>Hello, {user.first_name}.</h2>
            <a href="javascript:void(0);" onClick={this.logout.bind(this)}>Logout</a>
          </div>
        }
      </nav>
    </HeaderWrapper>;
  }

}

export default Header;
