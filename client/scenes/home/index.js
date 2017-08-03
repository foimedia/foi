import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import client from 'services/feathers';
import styleUtils from 'services/style-utils';
import ContentHeader from 'components/content/header';
import Button, { ButtonGroup } from 'components/button';

const HomeWrapper = styled.section`
  .description {
    max-width: 500px;
    font-family: "Inconsolata";
    ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
      padding-left: ${styleUtils.margins[i]}rem;
      padding-right: ${styleUtils.margins[i]}rem;
      margin-bottom: ${styleUtils.margins[i]}rem;
    `)}
    ${styleUtils.media.tablet`
      padding: 0;
    `}
    ${styleUtils.media.phablet`
      font-size: 1.5em;
    `}
  }
  .main-actions {
    border-bottom: 1px solid #ccc;
    ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
      padding-left: ${styleUtils.margins[i]}rem;
      padding-right: ${styleUtils.margins[i]}rem;
    `)}
    ${styleUtils.media.tablet`
      padding: 0;
    `}
  }
  ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
    .main-actions {
      padding-bottom: ${styleUtils.margins[i]*3}rem;
    }
    .extended-description p {
      margin-bottom: ${styleUtils.margins[i]}rem;
    }
  `)}
`

class Home extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    const { auth } = this.props;
    return (
      <HomeWrapper id="home">
        <ContentHeader icon="asterisk">
          <h2>FOI is a publishing bot</h2>
        </ContentHeader>
        <div className="description">
          <p>Real-time coverage of events for journalists and activists.</p>
        </div>
        <ButtonGroup className="main-actions">
          <Button
            primary={!auth.user || !auth.user.anonymous}
            href="https://github.com/miguelpeixe/foi"
            target="_blank"
            rel="external">
            <span className="fa fa-github"></span>
            Learn more
          </Button>
          {(auth.isSignedIn && auth.user.anonymous) &&
            <Button
              primary
              href={`https://telegram.me/${foi.botName}?start=${auth.token}`}
              target="_blank"
              rel="external">
              <span className="fa fa-telegram"></span>
              Authenticate with Telegram
            </Button>
          }
        </ButtonGroup>
        <div className="extended-description">
          <h3>How does it work?</h3>
          <p>FOI is both a bot and a web app. The bot takes the messages it receives and sends it to the app, where its organized, stored and displayed in real-time.</p>
          <p><strong>The content is organized by the chats the bot participates in.</strong> They are your private chat with the bot and the group chats the bot is invited to.</p>
          <p>Creating a new coverage or simply starting a live feed is as easy as creating a Telegram group:</p>
          <ol>
            <li>Create your new Telegram group inviting the people you'd like to contribute with;</li>
            <li>Invite <a href={`tg://resolve?domain=${foi.botName}`}>@{foi.botName}</a>;</li>
            <li>That's it!</li>
          </ol>
          <p>If the invitation is sent by an authorized publisher the bot will start watching the group and publish its content in real-time.</p>
          <h3>Share your feed</h3>
          <p>To publish your live feed on your website you can use our widget! Paste the code below right before the <code>{`</body>`}</code> closing tag:</p>
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
