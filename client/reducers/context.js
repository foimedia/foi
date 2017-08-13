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
  STORY_NEW
} from 'actions/stories';

import {
  LOCATION_CHANGE
} from 'react-router-redux';

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
      if(!action.quiet) {
        state = Object.assign({}, initialState, state);
        let chat = Object.assign({}, initialChat, state.chats[action.id]);
        chat.stories = Object.assign({}, chat.stories, initialChat.stories);
        chat.gallery = Object.assign({}, chat.gallery, initialChat.gallery);
        state.chats[action.id] = chat;
      }
      return state;
    }
    case CHAT_STORIES_SUCCESS :
    case CHAT_STORIES_EXPAND : {
      const { limit, skip, total } = action.res;
      state = Object.assign({}, initialState, state);
      let chat = state.chats[action.id];
      let { loaded } = chat.stories;
      chat.stories = Object.assign({}, initialChat.stories, {
        skip,
        total: total !== undefined ? total : chat.stories.total,
        limit: limit !== undefined ? limit : chat.stories.limit,
        loaded: skip > (loaded || 0) ? skip : loaded
      });
      return state;
    }
    case CHAT_GALLERY_SUCCESS :
    case CHAT_GALLERY_EXPAND : {
      const { limit, skip, total } = action.res;
      state = Object.assign({}, initialState, state);
      let chat = state.chats[action.id];
      const { loaded } = chat.gallery;
      chat.gallery = Object.assign({}, initialChat.gallery, {
        total,
        limit,
        skip,
        loaded: skip > (loaded || 0) ? skip : loaded
      });
      return state;
    }
    case STORY_NEW : {
      state = Object.assign({}, initialState, state);
      let chat = state.chats[action.data.chatId];
      chat.stories.new++;
      return state;
    }
    default :
      return state;
  }
}
