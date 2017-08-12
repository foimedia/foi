import client from 'services/feathers';

const service = client.service('posts');

export const POST_NEW = 'POST_NEW';
export const POST_UPDATE = 'POST_UPDATE';
export const POST_REMOVE = 'POST_REMOVE';

export const POST_GET_REQUEST = 'POST_GET_REQUEST';
export const POST_GET_SUCCESS = 'POST_GET_SUCCESS';
export const POST_GET_FAILURE = 'POST_GET_FAILURE';

export const POST_REMOVE_REQUEST = 'POST_REMOVE_REQUEST';
export const POST_REMOVE_SUCCESS = 'POST_REMOVE_SUCCESS';
export const POST_REMOVE_FAILURE = 'POST_REMOVE_FAILURE';

const _new = (id, data) => {
  return {
    type: POST_NEW,
    id,
    data
  }
};
const _update = (id, data) => {
  return {
    type: POST_UPDATE,
    id,
    data
  }
};
const _remove = (id, data) => {
  return {
    type: POST_REMOVE,
    id,
    data
  }
};

const getRequest = id => {
  return {
    type: POST_GET_REQUEST,
    id
  }
};
const getSuccess = (id, data) => {
  return {
    type: POST_GET_SUCCESS,
    id,
    data
  }
};
const getFailure = (id, err) => {
  return {
    type: POST_GET_FAILURE,
    id,
    err
  }
};

const removeRequest = id => {
  return {
    type: POST_REMOVE_REQUEST,
    id
  }
};
const removeSuccess = (id, data) => {
  return {
    type: POST_REMOVE_SUCCESS,
    id,
    data
  }
};
const removeFailure = (id, err) => {
  return {
    type: POST_REMOVE_FAILURE,
    id,
    err
  }
};

const get = id => (dispatch) => {
  dispatch(getRequest(id));
  service.get(id).then(data => {
    dispatch(getSuccess(id, data));
  }).catch(err => {
    dispatch(getFailure(id, err));
  });
};

export const loadPost = id => (dispatch, getState) => {
  const posts = getState().posts;
  if(posts[id]) {
    return null;
  }
  return dispatch(get(id));
};

export const removePost = id => (dispatch) => {
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
  return dispatch(_remove(data.id, data));
};
