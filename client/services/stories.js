import client from 'services/feathers';
import { created, patched, removed } from 'actions/stories';
import Realtime from './realtime';
import { hasUser } from './auth';

const service = client.service('stories');

export default function init (store) {
  return new Realtime('stories', {
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
};

// Utils

export function canRemove (story, auth) {
  return hasUser(auth) && story.userId == auth.user.id;
}
