import React, { Component } from 'react';
import styled from 'styled-components';

import client from 'services/feathers';
import styleUtils from 'services/style-utils';

import Bundle from 'components/bundle';

import Sidebar from 'components/sidebar';
import Content from 'components/content';
import Auth from 'components/auth';

import loadChats from 'bundle-loader?lazy!components/chats';

import Home from 'scenes/home';
import Chat from 'scenes/chat';

import { Route, Link } from 'react-router-dom';

const AppContainer = styled.div`
  font-family: sans-serif;
  line-height: 1.5;
  ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
    margin-left: ${styleUtils.margins[i]}rem;
    margin-right: ${styleUtils.margins[i]}rem;
  `)}
  h2,
  h3,
  h4,
  p {
    margin: 0;
  }
  .brand {
    padding: 4rem;
    background: #111;
    img {
      display: block;
      max-width: 6em;
      margin: 0 auto;
    }
  }
  a {
    color: #ff4646;
    text-decoration: none;
    outline: none;
    &:hover {
      color: #333;
    }
  }
`;

class Application extends Component {

  constructor (props) {
    super(props);
    this.state = {};

    this.authorizeService = client.service('authorize');
    this.userService = client.service('users');

    this.doAuth = this.doAuth.bind(this);
    this.handleAuth = this.handleAuth.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  doAuth (token = false) {
    // No token, attempt stored token and catch with anon auth
    if(!token) {
      return client.authenticate().catch(() => {
        return client.authenticate({
          strategy: 'anonymous',
          accessToken: null
        });
      });
    // With token, logout from previous session (mostly anon) and start new one with token
    } else {
      token = token.accessToken || token;
      return client.logout().then(() => {
        return client.authenticate({
          strategy: 'jwt',
          accessToken: token
        });
      });
    }
  }

  handleAuth (data) {
    // Clear payload and user before continuing
    this.setState({
      payload: undefined,
      user: undefined
    });
    client.passport.verifyJWT(data.accessToken).then(payload => {
      this.setState({
        payload: payload
      });
      if(payload.userId) {
        client.service('users').find({
          query: {
            id: payload.userId
          }
        }).then(res => {
          if(res.data.length) {
            this.setState({
              user: res.data[0]
            });
          }
        })
      }
    });
  }

  updateUser (data) {
    if(data.id == this.state.payload.userId) {
      this.setState({
        user: data
      });
    }
  }

  componentDidMount () {
    this.doAuth();
    client.on('authenticated', this.handleAuth);
    this.authorizeService.on('created', this.doAuth);
    this.userService.on('patched', this.updateUser);
    this.userService.on('updated', this.updateUser);
  }

  componentWillUnmount () {
    client.off('authenticated', this.handleAuth);
    this.authorizeService.off('created', this.doAuth);
    this.userService.off('patched', this.updateUser);
    this.userService.off('updated', this.updateUser);
  }

  logout () {
    client.logout().then(() => {
      client.authenticate({
        strategy: 'anonymous',
        acesssToken: null
      });
    });
  }

  render () {
    const self = this;
    const { user } = this.state;
    return <AppContainer>
      <Sidebar>
        <div className="brand">
          <Link to="/">
            <img src={require('images/logo_white.svg')} alt="FOI" />
          </Link>
        </div>
        <Auth
          {...this.state}
          logout={logout => {
            self.logout()
          }}
        />
        {user !== undefined &&
          <Bundle load={loadChats}>
            {Chats => (
              <Chats {...this.state} />
            )}
          </Bundle>
        }
      </Sidebar>
      <Content>
        <Route exact path="/" component={Home} />
        <Route path="/c/:chatId" component={Chat} />
      </Content>
    </AppContainer>;
  }

}

export default Application;
