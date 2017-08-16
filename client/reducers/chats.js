import union from 'lodash/union';

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
  USER_CHATS_SUCCESS
} from 'actions/users';

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
    case CHAT_PATCH_SUCCESS : {
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          ...action.data
        }
      };
    }
    case USER_CHATS_SUCCESS : {
      state = {...state};
      const chats = Object.assign(...action.res.data.map(chat => (
        { [chat.id]: chat }
      )));
      for(let chatId in chats) {
        state = {
          ...state,
          [chatId]: {
            ...state[chatId],
            ...chats[chatId]
          }
        }
      }
      return state;
    }
    case CHAT_STORIES_SUCCESS : {
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          stories: union(
            getItemsIds(action.res.data),
            state[action.id].stories || []
          )
        }
      }
    }
    case CHAT_STORIES_EXPAND : {
      if(action.res.data !== undefined) {
        return {
          ...state,
          [action.id]: {
            ...state[action.id],
            stories: [
              ...state[action.id].stories,
              ...getItemsIds(action.res.data)
            ]
          }
        }
      }
      return state;
    }
    case CHAT_GALLERY_SUCCESS : {
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          gallery: union(
            getItemsIds(action.res.data),
            state[action.id].gallery || []
          )
        }
      }
    }
    case CHAT_GALLERY_EXPAND : {
      if(action.res.data !== undefined) {
        return {
          ...state,
          [action.id]: {
            ...state[action.id],
            gallery: [
              ...state[action.id].gallery,
              ...getItemsIds(action.res.data)
            ]
          }
        }
      }
      return state;
    }
    case STORY_NEW : {
      const chat = state[action.data.chatId];
      if(chat !== undefined && chat.stories) {
        return {
          ...state,
          [chat.id]: {
            stories: [
              action.id,
              ...chat.stories
            ]
          }
        }
      }
      return state;
    }
    case STORY_REMOVE :
    case STORY_REMOVE_SUCCESS : {
      state = {...state};
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
        state = {...state};
        delete state[action.id];
      }
      return state;
    }
    case POST_NEW : {
      if(galleryMediaTypes.indexOf(action.data.type) !== -1) {
        state = {...state};
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
        state = {...state};
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

const getItemsIds = (items = []) => items.map(item => typeof item == 'string' ? item : item.id);
