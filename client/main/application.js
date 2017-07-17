import React, { Component } from 'react';
import styled from 'styled-components';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import Content from '../components/content';
import Stories from './stories';
import Chats from './chats';
import { client } from './feathers';
import styleUtils from '../style-utils';

import { Route, Link } from 'react-router-dom';

const AppContainer = styled.div`
  font-family: sans-serif;
  line-height: 1.5;
  .loader {
    margin: 2rem auto;
  }
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
    padding-top: 4rem;
    img {
      display: block;
      max-width: 5em;
    }
  }
  a {
    color: #525dbe;
    text-decoration: none;
    outline: none;
    &:hover {
      color: #333;
    }
  }
`;

const auth = (token = false) => {
  if(!token) {
    return client.authenticate().catch(() => {
      return client.authenticate({
        strategy: 'anonymous',
        accessToken: null
      });
    });
  } else {
    return client.logout().then(() => {
      return client.authenticate({
        strategy: 'jwt',
        accessToken: token
      });
    });
  }
};

class Application extends Component {

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    const authorize = client.service('authorize');
    auth();
    client.on('authenticated', data => {
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
    });
    authorize.on('created', data => {
      auth(data.accessToken);
    });
    client.service('users').on('patched', data => {
      if(data.id == this.state.payload.userId) {
        this.setState({
          user: data
        });
      }
    });
    client.service('users').on('updated', data => {
      if(data.id == this.state.payload.userId) {
        this.setState({
          user: data
        });
      }
    });
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
            <img src={require('../img/logo_black.svg')} alt="FOI" />
          </Link>
        </div>
        <Header
          {...this.state}
          logout={logout => {
            self.logout()
          }}
        />
        <Chats {...this.state} />
      </Sidebar>
      <Content>
        <Route exact path="/" component={Stories} />
        <Route path="/c/:chatId" component={Stories} />
      </Content>
    </AppContainer>;
  }

}

export default Application;
