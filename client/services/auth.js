import client from 'services/feathers';
import { updateContext } from 'actions/context';
import { authenticate } from 'actions/auth';

const authorization = client.service('authorize');

export default function init (store) {

  client.io.on('key', key => {
    store.dispatch(updateContext('key', key))
  });

  if(window.localStorage['feathers-jwt']) {
    store.dispatch(authenticate());
  }

  authorization.on('created', res => {
    window.localStorage['feathers-jwt'] = res.accessToken;
    store.dispatch(authenticate(res.accessToken)).then(auth => {
      authorization.patch(auth.user.id, { authenticated: true });
    });
  });

}

// Utils

export function hasRole (auth, role) {
  if(auth.signedIn && Array.isArray(auth.user.roles)) {
    return auth.user.roles.indexOf(role) !== -1;
  } else {
    return false;
  }
}

export function hasUser(auth) {
  return auth.signedIn;
}
