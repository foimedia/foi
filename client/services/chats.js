import { created, patched, removed } from 'actions/chats';
import Realtime from './realtime';
import { hasRole } from 'services/auth';

export default function (store) {

  const realtime = new Realtime('chats', {
    bindings: {
      created: data => {
        store.dispatch(created(data));
      },
      patched: data => {
        store.dispatch(patched(data));
      },
      removed: data => {
        store.dispatch(removed(data));
      }
    }
  });

  const batchRemove = (ids) => {
    ids.forEach(id => {
      store.dispatch(removed({id: id}));
    });
  };

  return {
    realtime,
    batchRemove
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
