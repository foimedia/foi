import {
  galleryMediaTypes,
  CHAT_NEW,
  CHAT_UPDATE,
  CHAT_REMOVE,
  CHAT_GET_SUCCESS,
  CHAT_PATCH_SUCCESS,
  CHAT_REMOVE_SUCCESS,
  CHAT_STORIES_SUCCESS,
  CHAT_STORIES_EXPAND,
  CHAT_GALLERY_SUCCESS,
  CHAT_GALLERY_EXPAND
} from 'actions/chats';

import {
  STORY_NEW,
  STORY_REMOVE,
  STORY_REMOVE_SUCCESS
} from 'actions/stories';

import {
  POST_NEW,
  POST_REMOVE,
  POST_REMOVE_SUCCESS
} from 'actions/posts';

const initialState = {};

const initialChat = {};

export default function reducer (state = initialState, action) {
  switch(action.type) {
    case CHAT_NEW :
    case CHAT_UPDATE :
    case CHAT_GET_SUCCESS :
    case CHAT_PATCH_SUCCESS :
      return updateState(state, updateChat(state, action.id, action.data));
    case CHAT_STORIES_SUCCESS :
      return updateState(state, updateChat(state, action.id, {
        stories: getItemsIds(action.res.data)
      }));
    case CHAT_STORIES_EXPAND : {
      state = Object.assign({}, initialState, state);
      const chat = state[action.id];
      chat.stories = [
        ...chat.stories,
        ...getItemsIds(action.res.data)
      ];
      return state;
    }
    case CHAT_GALLERY_SUCCESS :
      return updateState(state, updateChat(state, action.id, {
        gallery: getItemsIds(action.res.data)
      }));
    case CHAT_GALLERY_EXPAND : {
      if(action.res.data !== undefined) {
        state = Object.assign({}, initialState, state);
        const chat = state[action.id];
        chat.gallery = [
          ...chat.gallery,
          ...getItemsIds(action.res.data)
        ];
      }
      return state;
    }
    case STORY_NEW : {
      const chat = state[action.data.chatId];
      if(chat !== undefined && chat.stories) {
        return updateState(state, updateChat(state, chat.id, {
          stories: [action.id, ...chat.stories]
        }));
      }
      return state;
    }
    case STORY_REMOVE :
    case STORY_REMOVE_SUCCESS : {
      state = Object.assign({}, initialState, state);
      const chatId = action.data.chatId;
      const chat = state[chatId];
      if(chat !== undefined && chat.stories && chat.stories.length) {
        chat.stories = chat.stories.filter(id => id !== action.id);
      }
      return state;
    }
    case CHAT_REMOVE :
    case CHAT_REMOVE_SUCCESS : {
      if(state[action.id]) {
        state = Object.assign({}, initialState, state);
        delete state[action.id];
      }
      return state;
    }
    case POST_NEW : {
      if(galleryMediaTypes.indexOf(action.data.type) !== -1) {
        state = Object.assign({}, initialState, state);
        const chat = state[action.data.chatId];
        if(chat !== undefined && chat.gallery && chat.gallery.length) {
          chat.gallery = [action.id, ...chat.gallery];
        }
      }
      return state;
    }
    case POST_REMOVE :
    case POST_REMOVE_SUCCESS : {
      if(galleryMediaTypes.indexOf(action.data.type) !== -1) {
        state = Object.assign({}, initialState, state);
        const chat = state[action.data.chatId];
        if(chat !== undefined && chat.gallery && chat.gallery.length) {
          chat.gallery = chat.gallery.filter(id => id !== action.id);
        }
        chat.gallery = [action.id, ...chat.gallery];
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

const updateChat = (state, id, data = initialChat) => {
  return { [id]: Object.assign({}, initialChat, state[id], data) };
};

const getItemsIds = (items = []) => items.map(item => typeof item == 'string' ? item : item.id);
