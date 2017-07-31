import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import styleUtils from 'services/style-utils';
import Button from 'components/button';

const AuthWrapper = styled.div`
  font-size: .8em;
  h3 {
    color: #777;
  }
  nav {
    float: right;
    margin-top: -.3rem;
  }
`

class Auth extends Component {

  constructor (props) {
    super(props);
    this.logout = this.props.logout;
  }

  render () {
    const { auth } = this.props;
    if(auth.isSignedIn && !auth.user.anonymous) {
      return (
        <AuthWrapper>
          <nav id="auth">
            <Button primary small href="javascript:void(0);" onClick={this.logout.bind(this)}>Logout</Button>
          </nav>
          <h3>Hello, {auth.user.first_name}.</h3>
        </AuthWrapper>
      )
    } else {
      return null;
    }
  }

}

function mapStateToProps (state) {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps)(Auth);
