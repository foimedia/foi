import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateContext } from 'actions/context';
import client, { auth } from 'services/feathers';

class Authenticate extends Component {

  constructor (props) {
    super(props);
    this.authorization = client.service('authorize');
    this.setKey = this.setKey.bind(this);
    this.doAuth = this.doAuth.bind(this);
    this.logout = this.logout.bind(this);
  }

  setKey (key) {
    this.props.updateContext('key', key);
  }

  reconnect (cb) {
    const _recon = function () {
      setTimeout(function() {
        client.io.connect();
        _detachRecon();
        if(typeof cb == 'function') {
          cb();
        }
      }, 500);
    }
    const _detachRecon = function () {
      client.io.off('disconnect', _recon);
    }
    client.io.on('disconnect', _recon);
    client.io.disconnect();
  }

  doAuth (token = false) {
    const { authenticate, logout } = this.props;
    if(!token) {
      if(window.localStorage['feathers-jwt']) {
        // User not found auth error is not returning client error
        return authenticate();
      }
    // With token, logout from previous session and start new one with token
    } else {
      token = token.accessToken || token;
      if(window.localStorage['feathers-jwt']) {
        logout();
      }
      return authenticate({
        strategy: 'jwt',
        accessToken: token
      }).then(data => {
        this.reconnect(() => {
          const { user } = this.props.auth;
          this.authorization.patch(user.id, {authenticated: true});
        });
      });
    }
  }

  componentDidMount () {
    this.doAuth();
    this.authorization.on('created', this.doAuth);
    this.props.onRef(this);
    client.io.on('key', this.setKey);
  }

  componentWillUnmount () {
    this.authorization.off('created', this.doAuth);
    this.props.onRef(undefined);
    client.io.off('key', this.setKey);
  }

  logout () {
    this.props.logout();
  }

  render () {
    return null;
  }

}

const mapStateToProps = state => {
  return { auth: state.auth }
};

const mapDispatchToProps = dispatch => ({
  updateContext: (prop, value) => dispatch(updateContext(prop, value)),
  authenticate: (credentials) => dispatch(auth.authenticate(credentials)),
  logout: () => dispatch(auth.logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate);
