import React, { Component } from 'react';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { withRouter, Route, Link, Switch } from 'react-router-dom';

import { auth } from 'services/feathers';
import { hasUser, hasRole } from 'services/auth';
import styleUtils from 'services/style-utils';

import Sidebar from 'components/sidebar';
import Content from 'components/content';
import ContentHeader from 'components/content/header';
import Footer from 'components/footer';
import Auth from 'components/auth';
import { ButtonLink } from 'components/button';

import Headers from 'containers/headers';
import Authenticate from 'containers/authenticate';
import UserChats from 'containers/user-chats';

import Home from 'scenes/home';
import Chat from 'scenes/chat';
import Admin from 'scenes/admin';

import 'styles';
import 'styles/global.css';
import 'styles/lists.css';
import 'styles/scrollbar.css';

const AppContainer = styled.div`
  .brand {
    float: left;
    img {
      max-height: 1.5rem;
      display: block;
    }
    ${styleUtils.media.desktop`
      float: none;
      padding: 4rem !important;
      height: 225px;
      img {
        max-width: 6em;
        max-height: none;
        margin: 0 auto;
      }
    `}
  }
`;

class Application extends Component {
  render () {
    const self = this;
    const { auth } = this.props;
    return (
      <AppContainer>
        <Headers />
        <Authenticate />
        <Sidebar>
          <div className={`brand`}>
            <Link to="/">
              <img src={require('images/logo_white.svg')} alt="FOI" />
            </Link>
          </div>
          {auth.isSignedIn &&
            <Auth
              {...this.state}
              logout={self.props.logout}
            />
          }
          <div className="inner clear"></div>
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
            <Route path="/admin" component={Admin} />
            <Route render={() => (
              <ContentHeader icon="meh-o">
                <h2>404 Not found</h2>
              </ContentHeader>
            )} />
          </Switch>
        </Content>
        <Footer />
      </AppContainer>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    auth: state.auth
  }
}

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(auth.logout())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Application));
