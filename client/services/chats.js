import client from 'services/feathers';
import { created, patched, removed } from 'actions/chats';

import { hasRole } from 'services/auth';

const service = client.service('chats');

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
            { createdAt : { $gte : date } },
            { updatedAt : { $gte : date } }
          ],
          $limit: 50
        }
      }).then(res => {
        res.data.forEach(item => {
          if(new Date(item.createdAt) < new Date(date)) {
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

// Utils

export function getTitle (chat) {
  return chat.title || `${chat.first_name} ${chat.last_name}`.trim();
}

export function isActive (chat) {
  return chat.type === 'private' || chat.active;
}

export function canManage (chat, auth = false) {
  if(chat.type == 'private' || hasRole(auth, 'admin')) {
    return true;
  } else {
    if(chat.all_members_are_administrators) {
      return true;
    } else if(Array.isArray(chat.admins) && auth.user && chat.admins.indexOf(auth.user.id) !== -1){
      return true;
    } else {
      return false;
    }
  }
}
