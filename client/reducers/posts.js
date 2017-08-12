import actions, {
  POST_NEW,
  POST_UPDATE,
  POST_REMOVE,
  POST_GET_SUCCESS,
  POST_REMOVE_SUCCESS
} from 'actions/posts';

import {
  CHAT_STORIES_EXPAND,
  CHAT_STORIES_SUCCESS,
  CHAT_GALLERY_SUCCESS,
  CHAT_GALLERY_EXPAND
} from 'actions/chats';

import {
  STORY_NEW,
  STORY_UPDATE,
  STORY_GET_SUCCESS,
  STORY_PATCH_SUCCESS
} from 'actions/stories';

const initialState = {};

const initialPost = {};

export default function reducer (state = initialState, action) {
  switch(action.type) {
    case POST_NEW :
    case POST_UPDATE :
    case POST_GET_SUCCESS :
      return updateState(state, updatePost(state, action.id, action.data));
    case CHAT_GALLERY_SUCCESS :
    case CHAT_GALLERY_EXPAND :
      return updateState(state, updateFromArray(state, action.res.data));
    case STORY_NEW :
    case STORY_UPDATE :
    case STORY_GET_SUCCESS :
    case STORY_PATCH_SUCCESS :
      return updateState(state, updateFromArray(state, action.data.posts));
    case CHAT_STORIES_EXPAND :
    case CHAT_STORIES_SUCCESS :
      return updateState(state, updateFromStories(state, action.res.data));
    case POST_REMOVE :
    case POST_REMOVE_SUCCESS : {
      if(state[action.id]) {
        state = Object.assign({}, state);
        delete state[action.id];
      }
      return state;
    }
    default:
      return state;
  }
}

const updateState = (state, newState = initialState) => {
  return Object.assign({}, state, newState);
};

const updatePost = (state, id, data = initialPost) => {
  return { [id]: Object.assign({}, initialPost, state[id], data) };
};

const updateFromArray = (state, data) => {
  state = Object.assign({}, state);
  data.forEach(post => {
    state[post.id] = Object.assign({}, post);
  });
  return state;
};

const updateFromStories = (state, stories = []) => {
  state = Object.assign({}, state);
  stories.forEach(story => {
    state = Object.assign({}, updateFromArray(state, story.posts));
  });
  return state;
};
