import io from 'socket.io-client';
import superagent from 'superagent';
import feathers from 'feathers/client';
import hooks from 'feathers-hooks';
import socketio from 'feathers-socketio/client';
import rest from 'feathers-rest/client';
import authentication from 'feathers-authentication-client';
// import localStorage from 'localstorage-memory';

const url = '';

const socket = io(url);
const client = feathers();
client.configure(hooks());
// client.configure(rest(url).superagent(superagent));
client.configure(socketio(socket));
client.configure(authentication({
  storage: window.localStorage
}));

// const restClient = feathers();
// restClient.configure(hooks());
// restClient.configure(rest(url).superagent(superagent));
// restClient.configure(authentication({
//   storage: window.localStorage
// }));

export { client };
