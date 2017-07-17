import React, { Component } from 'react';
import styled from 'styled-components';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import Stories from './stories';
import Chats from './chats';
import { client } from './feathers';
import styleUtils from '../style-utils';

const AppContainer = styled.div`
  font-family: sans-serif;
  line-height: 1.5;
  margin-top: 3rem;
  margin-left: .5rem;
  margin-right: .5rem;
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
      client.passport.verifyJWT(data.accessToken).then(payload => {
        if(payload.userId) {
          client.service('users').find({
            query: {
              id: payload.userId
            }
          }).then(res => {
            if(res.data.length) {
              this.setState({
                payload: payload,
                user: res.data[0]
              });
            }
          })
        } else {
          this.setState({
            payload: payload,
            user: undefined
          });
        }
      });
    });
    authorize.on('created', data => {
      auth(data.accessToken);
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
      <Header
        {...this.state}
        logout={logout => {
          self.logout()
        }}
      />
      {user !== undefined &&
        <Sidebar>
          <Chats {...this.state} />
        </Sidebar>
      }
      <Stories />
    </AppContainer>;
  }

}

export default Application;
