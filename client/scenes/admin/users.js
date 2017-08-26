import React, { Component } from 'react';
import { connect } from 'react-redux';
import { findUsers } from 'actions/users';
import ContentHeader from 'components/content/header';
import Table from 'components/table';
import Loader from 'components/loader';

class Users extends Component {
  constructor (props) {
    super(props);
  }
  componentDidMount () {
    this.props.findUsers();
  }
  render () {
    const { users } = this.props;
    if(users !== undefined) {
      return (
        <div className="sections">
          <div className="users content-section">
            <h3>
              <span className="fa fa-users"></span>
              Users
            </h3>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roles</th>
                  {/* <th>Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{`${user.first_name} ${user.last_name}`}</td>
                    <td>{user.roles.join(', ')}</td>
                    {/* <td></td> */}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      );
    } else {
      return <Loader size={20} />
    }
  }
}

const mapStateToProps = state => {
  return {
    users: Object.values(state.users)
  }
}

const mapDispatchToProps = {
  findUsers
}

export default connect(mapStateToProps, mapDispatchToProps)(Users);
