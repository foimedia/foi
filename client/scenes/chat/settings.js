import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { canManage } from 'services/chats';
import { services } from 'services/feathers';
import { hasUser, hasRole } from 'services/auth';
import Loader from 'components/loader';
import Form from 'components/form';
import Button, { InputButton, ButtonGroup } from 'components/button';

class ChatSettings extends Component {

  constructor (props) {
    super(props);
    this.state = {
      formData: {}
    };
    this.remove = this.remove.bind(this);
    this.archive = this.archive.bind(this);
    this.unarchive = this.unarchive.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount () {
  }

  remove () {
    const { chat, remove } = this.props;
    if(confirm('Are you sure? This will remove all chat data, including posts, stories and media!')) {
      remove(chat.data.id);
    }
  }

  archive () {
    const { chat, patch } = this.props;
    patch(chat.data.id, { archived: true });
  }

  unarchive () {
    const { chat, patch } = this.props;
    patch(chat.data.id, { archived: false });
  }

  handleChange (event) {
    const { formData } = this.state;
    const { name, value } = event.target;
    this.setState({
      formData: Object.assign({}, formData, {[name]: value})
    });
  }

  handleSubmit (event) {
    const { chat, patch } = this.props;
    patch(chat.data.id, this.state.formData);
    event.preventDefault();
  }

  render () {
    const { chat, auth } = this.props;
    const { formData } = this.state;
    if(chat.data !== null && auth.user !== null) {
      return (
        <section id="chat-settings">
          {!canManage(chat.data, auth) &&
            <Redirect to="/" />
          }
          <div className="sections">
            <div className="chat-info content-section">
              <h3>
                <span className="fa fa-info-circle"></span>
                General information
              </h3>
              <table>
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
                    <th>Visitors</th>
                    <td>--</td>
                  </tr>
                </tbody>
              </table>
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
                <p className="form-actions">
                  <InputButton primary type="submit" value="Update chat" />
                </p>
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
  patch: (chatId, data = {}) => {
    dispatch(services.chats.patch(chatId, data))
  },
  remove: (chatId) => {
    dispatch(services.chats.remove(chatId))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatSettings);
