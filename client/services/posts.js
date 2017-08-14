import client from 'services/feathers';
import { created, patched, removed } from 'actions/posts';

import { hasUser } from './auth';

const service = client.service('posts');

export default function init (store) {
  let subscribing = false;
  let lastSeen;
  const _created = data => {
    store.dispatch(created(data));
  };
  const _patched = data => {
    store.dispatch(patched(data));
  };
  const _removed = data => {
    store.dispatch(removed(data));
  };
  const restoreItems = () => {
    if(lastSeen !== undefined) {
      const { pingTimeout } = client.io.io.engine;
      const date = lastSeen - pingTimeout
      service.find({
        query: {
          $or: [
            { sentAt : { $gte : date } },
            { editedAt : { $gte : date } }
          ],
          $limit: 50
        }
      }).then(res => {
        res.data.forEach(item => {
          if(new Date(item.sentAt) < new Date(date)) {
            store.dispatch(patched(item));
          } else {
            store.dispatch(created(item));
          }
        });
      });
    }
  };
  const subscribe = () => {
    service.on('created', _created);
    service.on('patched', _patched);
    service.on('removed', _removed);
    subscribing = true;
  };
  const unsubscribe = (quiet = false) => {
    service.off('created', _created);
    service.off('patched', _patched);
    service.off('removed', _removed);
    if(!quiet) {
      subscribing = false;
    }
  };
  const handleDisconnect = () => {
    lastSeen = undefined;
    if(subscribing) {
      lastSeen = Date.now();
      unsubscribe(true);
    }
  };
  const handleReconnect = () => {
    if(subscribing) {
      restoreItems();
      subscribe();
    }
  };
  client.io.on('connect', subscribe);
  client.io.on('disconnect', handleDisconnect);
  client.io.on('reconnect', handleReconnect);
  return {
    subscribe,
    unsubscribe,
    restoreItems
  }
};
