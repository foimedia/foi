import client from 'services/feathers';

const service = client.service('chats');
const stories = client.service('stories');
const posts = client.service('posts');

export const CHAT_LOAD = 'CHAT_LOAD';

export const CHAT_NEW = 'CHAT_NEW';
export const CHAT_UPDATE = 'CHAT_UPDATE';
export const CHAT_REMOVE = 'CHAT_REMOVE';

export const CHAT_GET_REQUEST = 'CHAT_GET_REQUEST';
export const CHAT_GET_SUCCESS = 'CHAT_GET_SUCCESS';
export const CHAT_GET_FAILURE = 'CHAT_GET_FAILURE';

export const CHAT_PATCH_REQUEST = 'CHAT_PATCH_REQUEST';
export const CHAT_PATCH_SUCCESS = 'CHAT_PATCH_SUCCESS';
export const CHAT_PATCH_FAILURE = 'CHAT_PATCH_FAILURE';

export const CHAT_REMOVE_REQUEST = 'CHAT_REMOVE_REQUEST';
export const CHAT_REMOVE_SUCCESS = 'CHAT_REMOVE_SUCCESS';
export const CHAT_REMOVE_FAILURE = 'CHAT_REMOVE_FAILURE';

export const CHAT_STORIES_REQUEST = 'CHAT_STORIES_REQUEST';
export const CHAT_STORIES_SUCCESS = 'CHAT_STORIES_SUCCESS';
export const CHAT_STORIES_EXPAND = 'CHAT_STORIES_EXPAND';
export const CHAT_STORIES_FAILURE = 'CHAT_STORIES_FAILURE';

export const CHAT_GALLERY_REQUEST = 'CHAT_GALLERY_REQUEST';
export const CHAT_GALLERY_SUCCESS = 'CHAT_GALLERY_SUCCESS';
export const CHAT_GALLERY_EXPAND = 'CHAT_GALLERY_EXPAND';
export const CHAT_GALLERY_FAILURE = 'CHAT_GALLERY_FAILURE';

const _load = (id, quiet) => {
  return {
    type: CHAT_LOAD,
    id,
    quiet
  }
};

const _new = (id, data) => {
  return {
    type: CHAT_UPDATE,
    id,
    data
  }
};
const _update = (id, data) => {
  return {
    type: CHAT_UPDATE,
    id,
    data
  }
};
const _remove = id => {
  return {
    type: CHAT_REMOVE,
    id
  }
};

const getRequest = id => {
  return {
    type: CHAT_GET_REQUEST,
    id
  }
};
const getSuccess = (id, data) => {
  return {
    type: CHAT_GET_SUCCESS,
    id,
    data
  }
};
const getFailure = (id, err) => {
  return {
    type: CHAT_GET_FAILURE,
    id,
    err
  }
};

const patchRequest = (id, data) => {
  return {
    type: CHAT_PATCH_REQUEST,
    id,
    data
  }
};
const patchSuccess = (id, data) => {
  return {
    type: CHAT_PATCH_SUCCESS,
    id,
    data
  }
};
const patchFailure = (id, err) => {
  return {
    type: CHAT_PATCH_FAILURE,
    id,
    err
  }
};

const removeRequest = (id, data) => {
  return {
    type: CHAT_REMOVE_REQUEST,
    id
  }
};
const removeSuccess = (id, data) => {
  return {
    type: CHAT_REMOVE_SUCCESS,
    id,
    data
  }
};
const removeFailure = (id, err) => {
  return {
    type: CHAT_REMOVE_FAILURE,
    id,
    err
  }
};

const storiesRequest = (id) => {
  return {
    type: CHAT_STORIES_REQUEST,
    id
  }
};
const storiesSuccess = (id, res) => {
  return {
    type: CHAT_STORIES_SUCCESS,
    id,
    res
  }
};
const storiesExpand = (id, res) => {
  return {
    type: CHAT_STORIES_EXPAND,
    id,
    res
  }
};
const storiesFailure = (id, err) => {
  return {
    type: CHAT_STORIES_FAILURE,
    id,
    err
  }
};

const galleryRequest = (id) => {
  return {
    type: CHAT_GALLERY_REQUEST,
    id
  }
};
const gallerySuccess = (id, types, res) => {
  return {
    type: CHAT_GALLERY_SUCCESS,
    id,
    types,
    res
  }
};
const galleryExpand = (id, types, res) => {
  return {
    type: CHAT_GALLERY_EXPAND,
    id,
    types,
    res
  }
};
const galleryFailure = (id, types, err) => {
  return {
    type: CHAT_GALLERY_FAILURE,
    id,
    types,
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

export const loadChat = (id, quiet = false) => (dispatch, getState) => {
  dispatch(_load(id, quiet));
  if(quiet)
    return null;
  const chats = getState().chats;
  dispatch(get(id));
};

export const patchChat = (id, data) => (dispatch) => {
  dispatch(patchRequest(id, data));
  service.patch(id, data).then(chat => {
    dispatch(patchSuccess(id, chat));
  }).catch(err => {
    dispatch(patchFailure(id, err));
  });
};

export const removeChat = id => (dispatch) => {
  dispatch(removeRequest(id));
  service.remove(id).then(data => {
    dispatch(removeSuccess(id, data));
  }).catch(err => {
    dispatch(removeFailure(id, err));
  });
};

export const loadChatStories = (id, quiet = false) => (dispatch, getState) => {
  const chat = getState().chats[id];
  if(chat === undefined || quiet)
    return null;
  dispatch(storiesRequest(id));
  stories.find({
    query: {
      chatId: id,
      $sort: {
        createdAt: chat.archived ? 1 : -1
      }
    }
  }).then(res => {
    dispatch(storiesSuccess(id, res));
  }).catch(err => {
    dispatch(storiesFailure(id, err));
  });
};
export const expandChatStories = id => (dispatch, getState) => {
  const chat = getState().chats[id];
  const context = getState().context.chats[id].stories;
  const skip = context.limit + context.skip;
  if(skip > (context.loaded || 0)) {
    stories.find({
      query: {
        chatId: id,
        $sort: {
          createdAt: chat.archived ? 1 : -1
        },
        $skip: skip + context.new
      }
    }).then(res => {
      dispatch(storiesExpand(id, res));
    });
  } else {
    dispatch(storiesExpand(id, {
      skip
    }));
  }
};

export const galleryMediaTypes = [
  'video',
  'video_note',
  'photo'
];

export const loadChatGallery = id => (dispatch, getState) => {
  const chat = getState().chats[id];
  if(chat === undefined)
    return null;
  dispatch(galleryRequest(id));
  posts.find({
    query: {
      chatId: id,
      type: {
        $in: galleryMediaTypes
      },
      $sort: {
        sentAt: -1
      }
    }
  }).then(res => {
    dispatch(gallerySuccess(id, galleryMediaTypes, res));
  }).catch(err => {
    dispatch(galleryFailure(id, galleryMediaTypes, err));
  });
};
export const expandChatGallery = id => (dispatch, getState) => {
  const context = getState().context.chats[id].gallery;
  const skip = context.limit + context.skip;
  if(context.skip > context.loaded || 0) {
    posts.find({
      query: {
        chatId: id,
        type: {
          $in: galleryMediaTypes
        },
        $sort: {
          sentAt: -1
        },
        $skip: skip + context.new
      }
    }).then(res => {
      dispatch(galleryExpand(id, galleryMediaTypes, res));
    });
  } else {
    dispatch(galleryExpand(id, galleryMediaTypes, {
      skip
    }));
  }
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
