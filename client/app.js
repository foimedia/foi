import React, { Component } from 'react';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { withRouter, Route, Link, Switch } from 'react-router-dom';

import client, { services, auth } from 'services/feathers';
import styleUtils from 'services/style-utils';

import Bundle from 'components/bundle';

import Sidebar from 'components/sidebar';
import Content from 'components/content';
import Auth from 'components/auth';

import loadChats from 'bundle-loader?lazy!components/chats';

import Home from 'scenes/home';
import Chat from 'scenes/chat';

import 'styles/global.css';

const AppContainer = styled.div`
  ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
    margin-left: ${styleUtils.margins[i]}rem;
    margin-right: ${styleUtils.margins[i]}rem;
  `)}
  .brand {
    padding: 2rem;
    box-sizing: border-box;
    ${styleUtils.media.desktop`
      padding: 4rem;
      height: 225px;
    `}
  }
  .brand img {
    display: block;
    max-width: 6em;
    margin: 0 auto;
  }
`;

class Application extends Component {

  constructor (props) {
    super(props);

    this.state = {};

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

  fetchUserChats (userId = false) {
    return client.service('chats').find({
      query: {
        $or: [
          {
            users: {
              $in: [userId]
            }
          },
          {
            id: userId
          }
        ],
        $sort: {
          id: -1
        }
      }
    });
  }

  componentDidMount () {
    const { auth } = this.props;
    this.doAuth();
    this.authorizeService.on('created', this.doAuth);
  }

  componentWillUpdate (nextProps) {
    if(nextProps.auth !== this.props.auth) {
      if(nextProps.auth.user) {
        this.fetchUserChats(nextProps.auth.user.id).then(res => {
          this.setState({
            userChats: res.data
          })
        });
      } else {
        this.setState({
          userChats: undefined
        });
      }
    }
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
    const { userChats } = this.state;
    return <AppContainer>
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
        <div className="sidebar-inner">
          {userChats !== undefined &&
            <Bundle load={loadChats}>
              {Chats => (
                <Chats chats={userChats} />
              )}
            </Bundle>
          }
        </div>
      </Sidebar>
      <Content>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/c/:chatId" component={Chat} />
          <Route render={() => (
            <h2>Not found</h2>
          )} />
        </Switch>
      </Content>
    </AppContainer>;
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
