import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { canManage, isActive } from 'services/chats';
import { services } from 'services/feathers';
import { hasUser, hasRole } from 'services/auth';
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

  componentDidMount () {
  }

  remove () {
    const { chat, remove } = this.props;
    if(confirm('Are you sure? This will remove all chat data, including posts, stories and media!')) {
      // This setState is not firing
      this.setState({
        removing: true
      });
      remove(chat.data.id);
    }
  }

  removed () {
    const { chat } = this.props;
    const { removing } = this.state;
    if(removing && chat.isFinished) {
      return true;
    }
    return false;
  }

  archive () {
    const { chat, patch } = this.props;
    patch(chat.data.id, { archived: true });
  }

  unarchive () {
    const { chat, patch } = this.props;
    patch(chat.data.id, { archived: false });
  }

  activate () {
    const { chat, patch } = this.props;
    patch(chat.data.id, { active: true });
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
      return !!chat.data[name];
    }
  }

  handleSubmit (event) {
    const { chat, patch } = this.props;
    patch(chat.data.id, this.state.formData);
    event.preventDefault();
  }

  render () {
    const { chat, auth } = this.props;
    const { formData, removing } = this.state;
    if(chat.data !== null && auth.user !== null) {
      return (
        <section id="chat-settings">
          {(!canManage(chat.data, auth) || this.removed()) &&
            <Redirect to="/" />
          }
          <div className="sections">
            {(!isActive(chat.data) && hasRole(auth, 'publisher')) &&
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
                    <textarea name="description" value={formData.description || chat.data.description} onChange={this.handleChange}></textarea>
                  </label>
                </p>
                <p>
                  <label>
                    Live video URL
                    <input name="liveURL" type="text" value={formData.liveURL || chat.data.liveURL} onChange={this.handleChange} />
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
                      {`${foi.url}/c/${chat.data.id}`}
                    </SelectableCode>
                  </label>
                </p>
                <p>
                  <label>
                    Widget code
                    <SelectableCode>
                      {`<div class="foi-widget" data-chat="${chat.data.id}"></div>`}
                    </SelectableCode>
                  </label>
                </p>
                <p>Make sure to add the widget javascript to your page:</p>
                <SelectableCode>
                  {`<script type="text/javascript" src="${foi.url}/widget.js" async></script>`}
                </SelectableCode>
              </Form>
            </div>
            {chat.data.type !== 'private' &&
              <div>
                <hr />
                <ButtonGroup alignright>
                  {!chat.data.archived &&
                    <Button onClick={this.archive}>
                      <span className="fa fa-archive"></span>
                      Archive chat
                    </Button>
                  }
                  {chat.data.archived &&
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
              </div>
            }
          </div>
        </section>
      )
    } else {
      return <Loader size={20} />
    }
  }

}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    chat: state.chats
  }
};

const mapDispatchToProps = (dispatch) => ({
  patch: (chatId, data = {}) => dispatch(services.chats.patch(chatId, data)),
  remove: (chatId) => dispatch(services.chats.remove(chatId))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatSettings);
