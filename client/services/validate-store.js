import axios from 'axios';

export default function validateStore (store, path, reducer) {
  return new Promise((resolve, reject) => {
    reducer = reducer || path;
    const ids = Object.keys(store.getState()[reducer]).map(id => parseInt(id));
    return axios.post(foi.server + '/' + path + '/validate_store', {
      ids: ids
    }).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err);
    });
  });
};
