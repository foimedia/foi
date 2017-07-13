import React, { Component } from 'react';
import styled from 'styled-components';
import Stories from './stories';
import Header from '../components/header';
import { client } from './feathers';
import styleUtils from '../style-utils';

// console.log(styles);

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
        this.setState({
          payload: payload,
          user: payload.user
        });
      });
    });
    authorize.on('created', data => {
      auth(data.accessToken);
    });
  }

  logout () {
    this.setState({
      payload: undefined,
      user: undefined
    });
    client.logout().then(() => {
      client.authenticate({
        strategy: 'anonymous',
        acesssToken: null
      });
    });
  }

  render () {
    const self = this;
    return <AppContainer>
      <Header
        {...this.state}
        logout={logout => {
          self.logout()
        }}
      />
      <Stories />
    </AppContainer>;
  }

}

export default Application;
