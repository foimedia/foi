import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import client from 'services/feathers';
import styleUtils from 'services/style-utils';
import Button, { ButtonGroup } from 'components/button';

const HomeWrapper = styled.section`
  header {
    border-bottom: 1px solid #000;
    ${styleUtils.media.desktop`
      height: 10rem;
    `}
    h2 {
      max-width: 200px;
      padding-top: 1rem;
      padding-bottom: 2rem;
      line-height: 1.2;
      font-size: 1em;
      ${styleUtils.media.desktop`
        padding-top: 0;
      `}
    }
  }
  .description {
    margin: 0 0 2rem;
    font-size: 1.8em;
    font-family: "Inconsolata";
  }
  .main-actions {
    margin: 0 0 2rem;
    padding: 0 0 2rem;
    border-bottom: 1px solid #ccc;
    ${styleUtils.media.desktop`
      padding: 0 0 6rem;
    `}
  }
  .extended-description {
    color: #444;
    font-size: 1.2rem;
    h3 {
      color: #999;
      margin: 0 0 2rem;
    }
    p {
      margin: 0 0 1rem;
    }
    ul,
    ol {
      ${'' /* border: 1px solid #ccc; */}
      background: ${styleUtils.color};
      color: #fff;
      margin: 2rem auto;
      padding: 1rem 1rem 1rem 3rem;
      font-size: .9em;
      font-family: "Inconsolata";
      border-radius: ${styleUtils.radius/2}px;
      li {
        margin: 0 0 1rem;
        padding-left: .5rem;
        &:last-child {
          margin: 0;
        }
      }
      ${styleUtils.media.desktop`
        padding: 2rem 4rem;
        li {
          padding-left: 1rem;
        }
      `}
    }
  }
`

class Home extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    const { auth } = this.props;
    return (
      <HomeWrapper id="home">
        <header id="content-header">
          <h2>FOI is a publishing bot</h2>
        </header>
        <div className="description">
          <p>Real-time coverage of events for journalists and activists.</p>
        </div>
        <ButtonGroup className="main-actions">
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
        <div className="extended-description">
          <h3>How it works</h3>
          <p><strong>The content is organized by the chats the bot participates in.</strong> They are your private chat with the bot and the group chats the bot is invited to.</p>
          <p>Creating a new coverage or simply starting a new publishing page is as easy as creating a Telegram group:</p>
          <ol>
            <li>Create your new Telegram group inviting the people you'd like to contribute with;</li>
            <li>Invite the bot;</li>
            <li>That's it!</li>
          </ol>
          <p>If the invitation is sent by an authorized publisher the bot will start watching the group and publish its content in real-time.</p>
        </div>
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
