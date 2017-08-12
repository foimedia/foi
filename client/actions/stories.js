import client from 'services/feathers';

const service = client.service('stories');

export const STORY_NEW = 'STORY_NEW';
export const STORY_UPDATE = 'STORY_UPDATE';
export const STORY_REMOVE = 'STORY_REMOVE';

export const STORY_GET_REQUEST = 'STORY_GET_REQUEST';
export const STORY_GET_SUCCESS = 'STORY_GET_SUCCESS';
export const STORY_GET_FAILURE = 'STORY_GET_FAILURE';

export const STORY_PATCH_REQUEST = 'STORY_PATCH_REQUEST';
export const STORY_PATCH_SUCCESS = 'STORY_PATCH_SUCCESS';
export const STORY_PATCH_FAILURE = 'STORY_PATCH_FAILURE';

export const STORY_REMOVE_REQUEST = 'STORY_REMOVE_REQUEST';
export const STORY_REMOVE_SUCCESS = 'STORY_REMOVE_SUCCESS';
export const STORY_REMOVE_FAILURE = 'STORY_REMOVE_FAILURE';

const _new = (id, data) => {
  return {
    type: STORY_NEW,
    id,
    data
  }
};
const _update = (id, data) => {
  return {
    type: STORY_UPDATE,
    id,
    data
  }
};
const _remove = (id, data) => {
  return {
    type: STORY_REMOVE,
    id,
    data
  }
};

const getRequest = id => {
  return {
    type: STORY_GET_REQUEST,
    id
  }
};
const getSuccess = (id, data) => {
  return {
    type: STORY_GET_SUCCESS,
    id,
    data
  }
};
const getFailure = (id, err) => {
  return {
    type: STORY_GET_FAILURE,
    id,
    err
  }
};

const removeRequest = id => {
  return {
    type: STORY_REMOVE_REQUEST,
    id
  }
};
const removeSuccess = (id, data) => {
  return {
    type: STORY_REMOVE_SUCCESS,
    id,
    data
  }
};
const removeFailure = (id, err) => {
  return {
    type: STORY_REMOVE_FAILURE,
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

export const loadStory = id => (dispatch, getState) => {
  const stories = getState().stories;
  if(stories[id]) {
    return null;
  }
  return dispatch(get(id));
};

export const removeStory = id => (dispatch) => {
  dispatch(removeRequest(id));
  service.remove(id).then(data => {
    dispatch(removeSuccess(id, data));
  }).catch(err => {
    dispatch(removeFailure(id, err));
  });
}

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
