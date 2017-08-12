import client from 'services/feathers';
import { created, patched, removed } from 'actions/chats';

import { hasRole } from 'services/auth';

const service = client.service('chats');

export default function init (store) {
  const _created = data => {
    store.dispatch(created(data));
  };
  const _patched = data => {
    store.dispatch(patched(data));
  };
  const _removed = data => {
    store.dispatch(removed(data));
  };
  const subscribe = () => {
    service.on('created', _created);
    service.on('patched', _patched);
    service.on('removed', _removed);
  };
  const unsubscribe = () => {
    service.off('created', _created);
    service.off('patched', _patched);
    service.off('removed', _removed);
  };
  subscribe();
  return {
    subscribe,
    unsubscribe
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
