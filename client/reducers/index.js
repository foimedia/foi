import { combineReducers } from 'redux';
import { auth } from 'services/feathers';
import context from './context';
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
    auth: auth.reducer,
    router: routerReducer
  });
}
