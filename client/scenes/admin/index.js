import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { hasUser, hasRole } from 'services/auth';
import ContentHeader from 'components/content/header';
import Loader from 'components/loader';

import 'styles/tables.css';

class Admin extends Component {

  constructor (props) {
    super(props);
  }

  componentDidMount () {
  }

  render () {
    const { auth } = this.props;
    if(auth.user !== null) {
      return (
        <section id="admin-area">
          {!hasRole(auth, 'admin') &&
            <Redirect to="/" />
          }
          <ContentHeader>
            <h2>Administration</h2>
          </ContentHeader>
          <div className="sections">
            <div className="env-info content-section">
              <h3>
                <span className="fa fa-info-circle"></span>
                Environment information
              </h3>
              <table>
                <tbody>
                  <tr>
                    <th>Site url</th>
                    <td>{foi.url}</td>
                  </tr>
                  <tr>
                    <th>Bot name</th>
                    <td>{foi.botName}</td>
                  </tr>
                  <tr>
                    <th>Default user roles</th>
                    <td>{foi.defaultUserRoles}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="admin-options content-section">
              <h3>
                <span className="fa fa-gear"></span>
                Site options
              </h3>
            </div>
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
    auth: state.auth
  }
};

export default connect(mapStateToProps)(Admin);
