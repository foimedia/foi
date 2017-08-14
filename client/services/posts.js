import client from 'services/feathers';
import { created, patched, removed } from 'actions/posts';
import Realtime from './realtime';
import { hasUser } from './auth';

const service = client.service('posts');

export default function init (store) {
  return new Realtime('posts', {
    createdField: 'sentAt',
    updatedField: 'editedAt',
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
