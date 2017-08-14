import client from 'services/feathers';

const userService = client.service('users');

export const AUTH_REQUEST = 'AUTH_REQUEST';
export const AUTH_FAILURE = 'AUTH_FAILURE';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';

export const AUTH_LOGOUT_REQUEST = 'AUTH_LOGOUT_REQUEST';
export const AUTH_LOGOUT_SUCCESS = 'AUTH_LOGOUT_SUCCESS';

const _request = (credentials) => {
  return {
    type: AUTH_REQUEST,
    credentials
  }
};

const _failure = (credentials, err) => {
  return {
    type: AUTH_FAILURE,
    credentials,
    err
  }
};

const _success = (credentials, user) => {
  return {
    type: AUTH_SUCCESS,
    credentials,
    user
  }
};

const _logoutRequest = () => {
  return {
    type: AUTH_LOGOUT_REQUEST
  }
};

const _logoutSuccess = () => {
  return {
    type: AUTH_LOGOUT_SUCCESS
  }
};

export const authenticate = (credentials) => dispatch => {
  dispatch(_request(credentials));
  return client.authenticate(credentials)
    .then(res => {
      return client.passport.verifyJWT(res.accessToken);
    })
    .then(payload => {
      return userService.get(payload.userId);
    })
    .then(user => {
      return dispatch(_success(credentials, user));
    })
    .catch(err => {
      return dispatch(_failure(credentials, err));
    });
};

export const logout = () => dispatch => {
  dispatch(_logoutRequest());
  client.logout().then(() => {
    dispatch(_logoutSuccess());
  });
};
