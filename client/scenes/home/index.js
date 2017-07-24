import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import client from 'services/feathers';
import Button, { ButtonGroup } from 'components/button';

const HomeWrapper = styled.section`
  p {
    margin: 0 0 2rem;
  }
`

class Home extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
  }

  componentWillReceiveProps (nextProps) {
    // console.log(nextProps);
  }

  render () {
    const { auth } = this.props;
    return (
      <HomeWrapper id="home">
        <header id="content-header">
          <h2>FOI is a publishing bot</h2>
        </header>
        <p>Made for journalists and activists, it is focused on real-time coverage of events.</p>
        <ButtonGroup>
          <Button
            href="https://github.com/miguelpeixe/foi"
            target="_blank"
            rel="external">
            <span class="fa fa-github"></span>
            Learn more
          </Button>
          {(auth.isSignedIn && auth.user.anonymous) &&
            <Button
              primary
              href={`https://telegram.me/${foi.botName}?start=${auth.token}`}
              target="_blank"
              rel="external">
              <span class="fa fa-unlock-alt"></span>
              Authenticate with Telegram
            </Button>
          }
        </ButtonGroup>
      </HomeWrapper>
    )
  }
}

function mapStateToProps (state) {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps)(Home);
