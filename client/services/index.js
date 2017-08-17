import { updateContext } from 'actions/context';
import validateStore from './validate-store';
import chats from './chats';
import stories from './stories';
import posts from './posts';
import users from './users';

export default function init (store) {
  store.dispatch(updateContext('online', true));
  window.addEventListener('offline', () => {
    store.dispatch(updateContext('online', false));
  });
  window.addEventListener('online', () => {
    store.dispatch(updateContext('online', true));
  });
  let unsubscribe;
  unsubscribe = store.subscribe(() => {
    if(store.getState().context.rehydrated) {
      unsubscribe();
      validateStore(store, 'chats').then(removed => {
        chats(store).batchRemove(removed);
      });
      validateStore(store, 'stories').then(removed => {
        stories(store).batchRemove(removed);
      });
      validateStore(store, 'posts').then(removed => {
        posts(store).batchRemove(removed);
      });
      validateStore(store, 'users').then(removed => {
        users(store).batchRemove(removed);
      });
    }
  });
};
