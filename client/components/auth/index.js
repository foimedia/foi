import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import styleUtils from 'services/style-utils';
import Button from 'components/button';

const AuthWrapper = styled.div`
  font-size: .8em;
  display: inline-block;
  line-height: 1.5rem;
  &:after {
    content: "";
    display: table;
    clear: both;
  }
  h3 {
    color: #777;
    display: inline-block;
    margin-right: 1rem;
    float: left;
    line-height: 1.5rem;
  }
  nav {
    float: right !important;
    a {
      margin: 0;
    }
  }
`

class Auth extends Component {

  constructor (props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout (event) {
    event.preventDefault();
    this.props.logout();
  }

  render () {
    const { auth } = this.props;
    return (
      <AuthWrapper>
        <nav id="auth" className="inner">
          <Button primary small href="javascript:void(0);" onClick={this.handleLogout}>Logout</Button>
        </nav>
        <h3>Hello, {auth.user.first_name}.</h3>
      </AuthWrapper>
    );
  }

}

function mapStateToProps (state) {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps)(Auth);
