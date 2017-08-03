import React, { Component } from 'react';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { withRouter, Route, Link, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { hasUser, hasRole } from 'services/auth';
import styleUtils from 'services/style-utils';

import Sidebar from 'components/sidebar';
import Content from 'components/content';
import ContentHeader from 'components/content/header';
import Footer from 'components/footer';
import Auth from 'components/auth';
import Button, { ButtonLink } from 'components/button';

import Authenticate from 'containers/authenticate';
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
        {/* <Helmet>
          <title>FOI - Publishing Bot</title>
        </Helmet> */}
        <Authenticate onRef={ref => (self.logout = ref.logout)} />
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
            <Route path="/s/:storyId" component={Story} />
            <Route path="/admin" component={Admin} />
            <Route render={() => (
              <ContentHeader>
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
  return { auth: state.auth }
}

export default withRouter(connect(mapStateToProps)(Application));
