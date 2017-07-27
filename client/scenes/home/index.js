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
  }
  .extended-description {
    color: #444;
    font-size: 1.2rem;
    h3 {
      border-top: 1px solid #ccc;
      color: #999;
      padding: 2rem 0 0;
      margin: 2rem 0;
      ${styleUtils.media.desktop`
        margin: 4rem 0 2rem;
      `}
    }
    p {
      margin: 0 0 1rem;
    }
    pre,
    ul,
    ol {
      font-family: 'Inconsolata', monospace;
      margin: 1rem 0;
      border-radius: ${styleUtils.radius/2}px;
    }
    code {
      font-family: 'Inconsolata', monospace;
      padding: .2rem .5rem;
      background: #f7f7f7;
      color: #999;
      border-radius: ${styleUtils.radius/2}px;
      font-size: .8em;
    }
    pre {
      padding: 1rem 1.2rem;
      font-size: .8em;
      overflow: auto;
      white-space: normal;
      background: #f7f7f7;
      border: 1px solid #e7e7e7;
      color: #999;
      &:hover {
        border-color: #d7d7d7;
      }
      code {
        background: transparent;
        padding: 0;
        font-size: inherit;
      }
    }
    ul,
    ol {
      max-width: 500px;
      padding: 1rem 1rem 1rem 3rem;
      li {
        margin: 0 0 1rem;
        padding-left: .5rem;
        &:last-child {
          margin: 0;
        }
      }
      ${styleUtils.media.desktop`
        padding: 2rem 3rem;
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
            primary={!auth.user || !auth.user.anonymous}
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
          <p>FOI is both a bot and a web app. The bot takes the messages it receives and sends it to the app, where its organized, stored and displayed in real-time.</p>
          <p><strong>The content is organized by the chats the bot participates in.</strong> They are your private chat with the bot and the group chats the bot is invited to.</p>
          <p>Creating a new coverage or simply starting a live feed is as easy as creating a Telegram group:</p>
          <ol>
            <li>Create your new Telegram group inviting the people you'd like to contribute with;</li>
            <li>Invite <a href="tg://resolve?domain=QAPBot">@{foi.botName}</a>;</li>
            <li>That's it!</li>
          </ol>
          <p>If the invitation is sent by an authorized publisher the bot will start watching the group and publish its content in real-time.</p>
          <h3>Publish your feed</h3>
          <p>To publish your live feed on your website you can use a widget! Paste the code below right before the <code>{`</body>`}</code> closing tag:</p>
          <pre><code>
            {`<script type="text/javascript" src="${foi.url}/widget.js" async></script>`}
          </code></pre>
          <p>Use the <code>{`<div />`}</code> below where you'd like to display your feed, changing the <code>data-chat</code> property to your chat id:</p>
          <pre><code>
            {`<div class="foi-widget" data-chat="[your-chat-id]"></div>`}
          </code></pre>
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
