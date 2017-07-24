import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import styleUtils from 'services/style-utils';

class Auth extends Component {

  constructor (props) {
    super(props);
    this.logout = this.props.logout;
  }

  render () {
    const { auth } = this.props;
    if(auth.isSignedIn && !auth.user.anonymous) {
      return (
        <nav id="auth">
          <div>
            <h3>Hello, {auth.user.first_name}.</h3>
            <a href="javascript:void(0);" onClick={this.logout.bind(this)}>Logout</a>
          </div>
        </nav>
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
