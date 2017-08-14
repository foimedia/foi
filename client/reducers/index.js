import { combineReducers } from 'redux';
import context from './context';
import auth from './auth';
import users from './users';
import posts from './posts';
import stories from './stories';
import chats from './chats';
import { routerReducer } from 'react-router-redux';

export default function () {
  return combineReducers({
    context,
    users,
    posts,
    stories,
    chats,
    auth,
    router: routerReducer
  });
}
