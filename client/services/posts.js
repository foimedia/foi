import { created, patched, removed } from 'actions/posts';
import Realtime from './realtime';
import { hasUser } from './auth';

export default function init (store) {

  const realtime = new Realtime('posts', {
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
