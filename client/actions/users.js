import client from 'services/feathers';

const service = client.service('users');
const chats = client.service('chats');

export const USER_NEW = 'USER_NEW';
export const USER_UPDATE = 'USER_UPDATE';
export const USER_REMOVE = 'USER_REMOVE';

export const USER_GET_REQUEST = 'USER_GET_REQUEST';
export const USER_GET_SUCCESS = 'USER_GET_SUCCESS';
export const USER_GET_FAILURE = 'USER_GET_FAILURE';

export const USER_FIND_REQUEST = 'USER_FIND_REQUEST';
export const USER_FIND_SUCCESS = 'USER_FIND_SUCCESS';
export const USER_FIND_FAILURE = 'USER_FIND_FAILURE';

export const USER_PATCH_REQUEST = 'USER_PATCH_REQUEST';
export const USER_PATCH_SUCCESS = 'USER_PATCH_SUCCESS';
export const USER_PATCH_FAILURE = 'USER_PATCH_FAILURE';

export const USER_REMOVE_REQUEST = 'USER_REMOVE_REQUEST';
export const USER_REMOVE_SUCCESS = 'USER_REMOVE_SUCCESS';
export const USER_REMOVE_FAILURE = 'USER_REMOVE_FAILURE';

export const USER_CHATS_REQUEST = 'USER_CHATS_REQUEST';
export const USER_CHATS_SUCCESS = 'USER_CHATS_SUCCESS';
export const USER_CHATS_FAILURE = 'USER_CHATS_FAILURE';

const _new = (id, data) => {
  return {
    type: USER_UPDATE,
    id,
    data
  }
};
const _update = (id, data) => {
  return {
    type: USER_UPDATE,
    id,
    data
  }
};
const _remove = id => {
  return {
    type: USER_REMOVE,
    id
  }
};

const getRequest = id => {
  return {
    type: USER_GET_REQUEST,
    id
  }
};
const getSuccess = (id, data) => {
  return {
    type: USER_GET_SUCCESS,
    id,
    data
  }
};
const getFailure = (id, err) => {
  return {
    type: USER_GET_FAILURE,
    id,
    err
  }
};

const findRequest = query => {
  return {
    type: USER_FIND_REQUEST,
    query
  }
};
const findSuccess = (query, res) => {
  return {
    type: USER_FIND_SUCCESS,
    query,
    res
  }
};
const findFailure = (query, err) => {
  return {
    type: USER_FIND_FAILURE,
    query,
    err
  }
};

const patchRequest = (id, data) => {
  return {
    type: USER_PATCH_REQUEST,
    id,
    data
  }
};
const patchSuccess = (id, data) => {
  return {
    type: USER_PATCH_SUCCESS,
    id,
    data
  }
};
const patchFailure = (id, err) => {
  return {
    type: USER_PATCH_FAILURE,
    id,
    err
  }
};

const removeRequest = (id, data) => {
  return {
    type: USER_REMOVE_REQUEST,
    id
  }
};
const removeSuccess = (id, data) => {
  return {
    type: USER_REMOVE_SUCCESS,
    id,
    data
  }
};
const removeFailure = (id, err) => {
  return {
    type: USER_REMOVE_FAILURE,
    id,
    err
  }
};

const get = id => (dispatch) => {
  dispatch(getRequest(id));
  service.get(id).then(res => {
    dispatch(getSuccess(id, res));
  }).catch(err => {
    dispatch(getFailure(id, err));
  });
};

export const loadUser = (id, reload = false) => (dispatch, getState) => {
  const users = getState().users;
  if(!reload && users[id]) {
    return null;
  }
  dispatch(get(id));
};

export const findUsers = (query = {}) => (dispatch) => {
  dispatch(findRequest(query));
  service.find({
    query: Object.assign({}, query)
  }).then(res => {
    dispatch(findSuccess(query, res));
  }).catch(err => {
    dispatch(findFailure(query, err));
  });
}

export const patchUser = (id, data) => (dispatch) => {
  dispatch(patchRequest(id, data));
  service.patch(id, data).then(chat => {
    dispatch(patchSuccess(id, chat));
  }).catch(err => {
    dispatch(patchFailure(id, err));
  });
};

export const removeUser = id => (dispatch) => {
  dispatch(removeRequest(id));
  service.remove(id).then(data => {
    dispatch(removeSuccess(id, data));
  }).catch(err => {
    dispatch(removeFailure(id, err));
  });
};

// Socket events actions
export const created = data => (dispatch) => {
  return dispatch(_new(data.id, data));
};
export const patched = data => (dispatch) => {
  return dispatch(_update(data.id, data));
};
export const removed = data => (dispatch) => {
  return dispatch(_remove(data.id));
};
