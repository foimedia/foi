import React, { Component } from 'react';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { withRouter, Route, Link, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import client, { services, auth } from 'services/feathers';
import { hasUser, hasRole } from 'services/auth';
import styleUtils from 'services/style-utils';

import Bundle from 'components/bundle';

import Sidebar from 'components/sidebar';
import Content from 'components/content';
import Footer from 'components/footer';
import Auth from 'components/auth';
import Button, { ButtonLink } from 'components/button';

import UserChats from 'containers/user-chats';

import Home from 'scenes/home';
import Chat from 'scenes/chat';
import Story from 'scenes/story';
import Admin from 'scenes/admin';

import 'styles/global.css';
import 'styles/lists-code.css';
import 'styles/scrollbar.css';

const AppContainer = styled.div`
  .brand {
    padding: 1rem;
    box-sizing: border-box;
    img {
      max-width: 1.5em;
      display: block;
    }
    ${styleUtils.media.desktop`
      padding: 4rem;
      height: 225px;
      img {
        max-width: 6em;
        margin: 0 auto;
      }
    `}
  }
`;

class Application extends Component {

  constructor (props) {
    super(props);
    this.authorizeService = client.service('authorize');
    this.doAuth = this.doAuth.bind(this);
    this.doAnonAuth = this.doAnonAuth.bind(this);
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
      });
    }
  }

  componentDidMount () {
    const { auth } = this.props;
    this.doAuth();
    this.authorizeService.on('created', this.doAuth);
  }

  componentWillUnmount () {
    this.authorizeService.off('created', this.doAuth);
  }

  logout () {
    const { authenticate, logout } = this.props;
    logout();
    return this.doAnonAuth();
  }

  render () {
    const self = this;
    const { auth } = this.props;
    return (
      <AppContainer>
        {/* <Helmet>
          <title>FOI - Publishing Bot</title>
        </Helmet> */}
        <Sidebar>
          <div className={`brand`}>
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
          {hasUser(auth) &&
            <div className="inner">
              <UserChats />
            </div>
          }
          {hasRole(auth, 'admin') &&
            <div className="inner">
              <ButtonLink to="/admin" dark block>
                <span className="fa fa-lock"></span>
                Administration
              </ButtonLink>
            </div>
          }
        </Sidebar>
        <Content>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/c/:chatId" component={Chat} />
            <Route path="/s/:storyId" component={Story} />
            <Route path="/admin" component={Admin} />
            <Route render={() => (
              <h2>Not found</h2>
            )} />
          </Switch>
        </Content>
        <Footer />
      </AppContainer>
    );
  }

}

const mapStateToProps = (state, ownProps) => {
  return { auth: state.auth }
}

const mapDispatchToProps = (dispatch) => ({
  authenticate: (credentials) => dispatch(auth.authenticate(credentials)),
  logout: () => dispatch(auth.logout())
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Application));
