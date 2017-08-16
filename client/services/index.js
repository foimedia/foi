import { updateContext } from 'actions/context';
import chats from './chats';
import stories from './stories';
import posts from './posts';

export default function init (store) {
  store.dispatch(updateContext('online', true));
  window.addEventListener('offline', () => {
    store.dispatch(updateContext('online', false));
  });
  window.addEventListener('online', () => {
    store.dispatch(updateContext('online', true));
  });
  chats(store);
  stories(store);
  posts(store);
};
