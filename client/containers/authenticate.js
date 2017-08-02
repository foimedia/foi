import React, { Component } from 'react';
import { connect } from 'react-redux';
import client, { auth } from 'services/feathers';

class Authenticate extends Component {

  constructor (props) {
    super(props);
    this.authorization = client.service('authorize');
    this.doAuth = this.doAuth.bind(this);
    this.doAnonAuth = this.doAnonAuth.bind(this);
    this.logout = this.logout.bind(this);
  }

  doAnonAuth () {
    const { authenticate } = this.props;
    return authenticate({
      strategy: 'anonymous',
      accessToken: null
    });
  }

  doAuth (token = false) {
    const { authenticate, logout } = this.props;
    // No token, attempt stored token and catch with anon auth
    if(!token) {
      if(window.localStorage['feathers-jwt']) {
        // User not found auth error is not returning client error
        return authenticate().catch(() => {
          return this.doAnonAuth();
        });
      } else {
        return this.doAnonAuth().then(() => {
          client.io.disconnect();
          return client.io.connect();
        });
      }
    // With token, logout from previous session (mostly anon) and start new one with token
    } else {
      token = token.accessToken || token;
      logout();
      return authenticate({
        strategy: 'jwt',
        accessToken: token
      }).then(data => {
        const { user } = this.props.auth;
        this.authorization.patch(user.id, {authenticated: true});
      });
    }
  }

  componentDidMount () {
    const { auth } = this.props;
    this.doAuth();
    this.authorization.on('created', this.doAuth);
    this.props.onRef(this);
  }

  componentWillUnmount () {
    this.authorization.off('created', this.doAuth);
    this.props.onRef(undefined);
  }

  logout () {
    const { authenticate, logout } = this.props;
    logout();
    return this.doAnonAuth();
  }

  render () {
    return null;
  }

}

const mapStateToProps = state => {
  return { auth: state.auth }
};

const mapDispatchToProps = dispatch => ({
  authenticate: (credentials) => dispatch(auth.authenticate(credentials)),
  logout: () => dispatch(auth.logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate);
