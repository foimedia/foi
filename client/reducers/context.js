import {
  CONTEXT_UPDATE
} from 'actions/context';

import {
  CHAT_LOAD,
  CHAT_STORIES_SUCCESS,
  CHAT_STORIES_EXPAND,
  CHAT_GALLERY_SUCCESS,
  CHAT_GALLERY_EXPAND
} from 'actions/chats';

import {
  USER_CHATS_SUCCESS
} from 'actions/users';

import {
  STORY_NEW
} from 'actions/stories';

import {
  LOCATION_CHANGE
} from 'react-router-redux';

import {
  REHYDRATE
} from 'redux-persist/constants';

const initialState = {
  chats: {},
  key: undefined,
  scrollHistory: {
    lastKey: undefined
  }
};

const initialChat = {
  stories: { new: 0, unread: 0, skip: 0 },
  gallery: { new: 0, unread: 0 }
};

export default function reducer (state = initialState, action) {
  switch(action.type) {
    case CONTEXT_UPDATE : {
      state = Object.assign({}, initialState, state, {
        [action.context]: action.data
      });
      return state;
    }
    case LOCATION_CHANGE : {
      state = Object.assign({}, initialState, state);
      const { lastKey } = state.scrollHistory;
      const scroll = (
        window.pageYOffset || document.documentElement.scrollTop
      );
      if(lastKey !== undefined && scroll > 0) {
        state.scrollHistory[lastKey] = scroll;
      }
      state.scrollHistory.lastKey = action.payload.key;
      return state;
    }
    case CHAT_LOAD : {
      return {
        ...state,
        chats: {
          ...state.chats,
          [action.id]: {
            ...state.chats[action.id],
            stories: {
              ...(state.chats[action.id] ?
                state.chats[action.id].stories : {}),
              ...initialChat.stories
            },
            gallery: {
              ...(state.chats[action.id] ?
                state.chats[action.id].gallery : {}),
              ...initialChat.gallery
            }
          }
        }
      };
    }
    case USER_CHATS_SUCCESS : {
      const chats = Object.assign(...action.res.data.map(c => ({[c.id]: {
        stories: {
          ...(state.chats[c.id] ? state.chats[c.id].stories : {}),
          ...initialChat.stories
        },
        gallery: {
          ...(state.chats[c.id] ? state.chats[c.id].gallery : {}),
          ...initialChat.gallery
        }
      }})));
      return {
        ...state,
        chats: {
          ...state.chats,
          ...chats
        }
      }
    }
    case CHAT_STORIES_SUCCESS :
    case CHAT_STORIES_EXPAND : {
      const { limit, skip, total } = action.res;
      let chat = state.chats[action.id];
      let loaded = 0;
      if(chat !== undefined) {
        loaded = chat.stories.loaded;
      }
      return {
        ...state,
        chats: {
          ...state.chats,
          [action.id]: {
            ...state.chats[action.id],
            stories: {
              ...initialChat.stories,
              ...(state.chats[action.id] ?
                state.chats[action.id].stories : {}),
              skip,
              total,
              limit,
              loaded: skip > (loaded || 0) ? skip : loaded
            }
          }
        }
      };
    }
    case CHAT_GALLERY_SUCCESS :
    case CHAT_GALLERY_EXPAND : {
      const { limit, skip, total } = action.res;
      let chat = state.chats[action.id];
      let loaded = 0;
      if(chat !== undefined) {
        loaded = chat.gallery.loaded;
      }
      return {
        ...state,
        chats: {
          ...state.chats,
          [action.id]: {
            ...state.chats[action.id],
            gallery: {
              ...initialChat.gallery,
              ...(state.chats[action.id] ?
                state.chats[action.id].gallery : {}),
              skip,
              total,
              limit,
              loaded: skip > (loaded || 0) ? skip : loaded
            }
          }
        }
      };
    }
    case STORY_NEW : {
      state = {...state};
      let chat = state.chats[action.data.chatId];
      chat.stories.new++;
      return state;
    }
    case REHYDRATE : {
      const incoming = {...action.payload.context};
      delete incoming.scrollHistory;
      delete incoming.key;
      delete incoming.chats;
      return {
        ...state,
        ...incoming
      }
    }
    default :
      return state;
  }
}
