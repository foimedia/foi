import actions, {
  USER_NEW,
  USER_UPDATE,
  USER_REMOVE,
  USER_GET_SUCCESS,
  USER_FIND_SUCCESS,
  USER_PATCH_SUCCESS,
  USER_REMOVE_SUCCESS,
  USER_CHATS_SUCCESS
} from 'actions/users';

import {
  AUTH_SUCCESS
} from 'actions/auth';

import {
  CHAT_NEW,
  CHAT_REMOVE
} from 'actions/chats';

const initialState = {};

const initialUser = {};

export default function reducer (state = initialState, action) {
  switch(action.type) {
    case USER_NEW :
    case USER_UPDATE :
    case USER_GET_SUCCESS :
    case USER_PATCH_SUCCESS : {
      state = Object.assign({}, initialState, state);
      state[action.data.id] = Object.assign(
        {},
        initialUser,
        state[action.data.id],
        action.data
      );
      return state;
    }
    case AUTH_SUCCESS : {
      return {
        ...state,
        [action.user.id]: {
          ...state[action.user.id],
          ...action.user
        }
      };
    }
    case USER_FIND_SUCCESS : {
      state = Object.assign({}, initialState, state);
      action.res.data.forEach(user => {
        state[user.id] = Object.assign(
          {},
          initialUser,
          state[user.id],
          user
        );
      });
      return state;
    }
    case USER_REMOVE :
    case USER_REMOVE_SUCCESS : {
      if(state[action.id]) {
        state = Object.assign({}, initialState, state);
        delete state[action.id];
      }
      return state;
    }
    case USER_CHATS_SUCCESS : {
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          chats: [...getItemsIds(action.res.data)]
        }
      };
    }
    case CHAT_NEW : {
      state = {...state};
      const users = action.data.users;
      users.forEach(userId => {
        state[userId] = {
          ...state[userId],
          chats: [
            ...state[userId].chats,
            action.id
          ]
        }
      });
      return state;
    }
    case CHAT_REMOVE : {
      state = {...state};
      const users = action.data.users;
      users.forEach(userId => {
        state[userId].chats = state[userId].chats.filter(cId => cId !== action.id);
      });
      return state;
    }
    default :
      return state;
  }
}

const getItemsIds = (items = []) => items.map(item => typeof item == 'string' ? item : item.id);
