import React, { Component } from 'react';
import { connect } from 'react-redux';
import { services } from 'services/feathers';
import ContentHeader from 'components/content/header';
import Table from 'components/table';
import Loader from 'components/loader';

class Users extends Component {
  constructor (props) {
    super(props);
  }
  componentDidMount () {
    this.props.fetch();
  }
  render () {
    const { users } = this.props;
    if(users.isError) {
      return (
        <ContentHeader icon="frown-o" inner={true}>
          <p>ERROR: {users.isError.message}</p>
        </ContentHeader>
      )
    } else if(users.queryResult !== null) {
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
                {users.queryResult.data.map(user => (
                  <tr>
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
    users: state.users
  }
}

const mapDispatchToProps = dispatch => ({
  fetch: () => dispatch(services.users.find())
})

export default connect(mapStateToProps, mapDispatchToProps)(Users);
