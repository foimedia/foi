import React, { Component } from 'react';
import styled from 'styled-components';
import Stories from './stories';
import { client } from './feathers';

const AppContainer = styled.div`
  font-family: sans-serif;
  line-height: 1.5;
`

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
    const { payload, user } = this.state;
    return <AppContainer>
      {(user === undefined && payload !== undefined) &&
        <a href={`https://telegram.me/${foi.botName}?start=${payload.key}`} target="_blank">Authenticate</a>
      }
      {user !== undefined &&
        <div>
          <h2>Hello, {user.first_name}.</h2>
          <a href="javascript:void(0);" onClick={this.logout.bind(this)}>Logout</a>
        </div>
      }
      <Stories />
    </AppContainer>;
  }

}

export default Application;
