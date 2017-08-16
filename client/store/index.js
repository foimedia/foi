import { compose, applyMiddleware, createStore } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import localForage from 'localforage';
import rootReducer from 'reducers';
import middlewares from 'middleware';

const localStore = localForage.createInstance({
  name: 'foi',
  description: 'Persistant application state'
});

export default function configureStore(initialState, callback) {
  // Engage the Chrome extension "Redux DevTools" if it is installed on the browser.
  // This extension watches reducers and logs their invocations, actions and changing state.
  // It caches activity so you can 'time travel' through state changes.
  // It runs in an extension reducing the size of your app bundle.
  // This interface can be left in prod bundles and the extension activated in the field as needed.
  // https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?utm_source=chrome-app-launcher-info-dialog
  const createStoreWithDevTools = window.devToolsExtension
    ? window.devToolsExtension()(createStore)
    : createStore;

  const createStoreWithMiddlewares = compose(applyMiddleware(...middlewares), autoRehydrate())(createStoreWithDevTools);

  const store = createStoreWithMiddlewares(rootReducer(), initialState);

  persistStore(store, {
    storage: localStore
  }, callback);

  return store;
}
