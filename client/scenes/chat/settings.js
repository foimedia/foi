import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { patchChat, removeChat } from 'actions/chats';
import { hasRole } from 'services/auth';
import { canManage, isActive } from 'services/chats';
import Loader from 'components/loader';
import Table from 'components/table';
import Form from 'components/form';
import { SelectableCode } from 'components/code';
import Button, { InputButton, ButtonGroup } from 'components/button';

class ChatSettings extends Component {

  constructor (props) {
    super(props);
    this.state = {
      formData: {},
      removing: false
    };
    this.remove = this.remove.bind(this);
    this.archive = this.archive.bind(this);
    this.unarchive = this.unarchive.bind(this);
    this.activate = this.activate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  remove () {
    const { chat, removeChat } = this.props;
    if(confirm('Are you sure? This will remove all chat data, including posts, stories and media!')) {
      this.setState({
        removing: true
      });
      removeChat(chat.id);
    }
  }

  removed () {
    const { chat } = this.props;
    const { removing } = this.state;
    if(removing && chat == undefined) {
      return true;
    }
    return false;
  }

  archive () {
    const { chat, patchChat } = this.props;
    patchChat(chat.id, { archived: true });
  }

  unarchive () {
    const { chat, patchChat } = this.props;
    patchChat(chat.id, { archived: false });
  }

  activate () {
    const { chat, patchChat } = this.props;
    patchChat(chat.id, { active: true });
  }

  handleChange (event) {
    const { formData } = this.state;
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({
      formData: Object.assign({}, formData, {[target.name]: value})
    });
  }

  isCheckedInput (name) {
    const { chat } = this.props;
    const { formData } = this.state;
    if(formData[name] !== undefined) {
      return !!formData[name];
    } else {
      return !!chat[name];
    }
  }

  handleSubmit (event) {
    const { chat, patchChat } = this.props;
    patchChat(chat.id, this.state.formData);
    event.preventDefault();
  }

  render () {
    const { chat, auth } = this.props;
    const { formData, removing } = this.state;
    if(chat !== undefined && auth.user !== null) {
      return (
        <section id="chat-settings">
          {!canManage(chat, auth) &&
            <Redirect to="/" />
          }
          <div className="sections">
            {(!isActive(chat) && hasRole(auth, 'publisher')) &&
              <div className="chat-activation content-section">
                <h3>
                  <span className="fa fa-warning"></span>
                  Chat activation
                </h3>
                <p>
                  <Button primary block onClick={this.activate}>Your chat is not active. Click here to activate!</Button>
                </p>
              </div>
            }
            <div className="chat-info content-section">
              <h3>
                <span className="fa fa-info-circle"></span>
                General information
              </h3>
              <Table>
                <tbody>
                  <tr>
                    <th>Contributors</th>
                    <td>--</td>
                  </tr>
                  <tr>
                    <th>Stories</th>
                    <td>--</td>
                  </tr>
                  <tr>
                    <th>Posts</th>
                    <td>--</td>
                  </tr>
                  <tr>
                    <th>Max Live Viewers</th>
                    <td>--</td>
                  </tr>
                  <tr>
                    <th>Viewers</th>
                    <td>--</td>
                  </tr>
                </tbody>
              </Table>
            </div>
            <div className="main-settings content-section">
              <h3>
                <span className="fa fa-gear"></span>
                Settings
              </h3>
              <Form onSubmit={this.handleSubmit}>
                <p>
                  <label>
                    Description
                    <textarea name="description" value={formData.description || chat.description} onChange={this.handleChange}></textarea>
                  </label>
                </p>
                <p>
                  <label>
                    Live video URL
                    <input name="liveURL" type="text" value={formData.liveURL || chat.liveURL} onChange={this.handleChange} />
                  </label>
                </p>
                <p>
                  <label>
                    Media Gallery
                    <span className="checkbox">
                      <input name="hideGallery" type="checkbox" checked={this.isCheckedInput('hideGallery')} onChange={this.handleChange} /> Hide media gallery
                    </span>
                  </label>
                </p>
                <p className="form-actions">
                  <InputButton primary type="submit" value="Update chat" />
                </p>
              </Form>
            </div>
            <div className="share-settings content-section">
              <h3>
                <span className="fa fa-bullhorn"></span>
                Share
              </h3>
              <Form>
                <p>
                  <label>
                    URL
                    <SelectableCode>
                      {`${foi.public}/c/${chat.id}`}
                    </SelectableCode>
                  </label>
                </p>
                <p>
                  <label>
                    Widget code
                    <SelectableCode>
                      {`<div class="foi-widget" data-chat="${chat.id}"></div>`}
                    </SelectableCode>
                  </label>
                </p>
                <p>Make sure to add the widget javascript to your page:</p>
                <SelectableCode>
                  {`<script type="text/javascript" src="${foi.public}/widget.js" async></script>`}
                </SelectableCode>
              </Form>
            </div>
            {chat.type !== 'private' &&
              <ButtonGroup alignright>
                {!chat.archived &&
                  <Button onClick={this.archive}>
                    <span className="fa fa-archive"></span>
                    Archive chat
                  </Button>
                }
                {chat.archived &&
                  <Button onClick={this.unarchive}>
                    <span className="fa fa-archive"></span>
                    Unarchive chat
                  </Button>
                }
                <Button danger onClick={this.remove}>
                  <span className="fa fa-remove"></span>
                  Delete chat
                </Button>
              </ButtonGroup>
            }
          </div>
        </section>
      )
    } else if (removing || this.removed()) {
      return <Redirect to="/" />
    } else {
      return <Loader size={20} />
    }
  }

}

const mapStateToProps = (state, ownProps) => {
  const { chatId } = ownProps.match.params;
  return {
    chat: state.chats[chatId],
    auth: state.auth
  }
};

const mapDispatchToProps = {
  patchChat,
  removeChat
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatSettings);
