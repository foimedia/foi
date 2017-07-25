import io from 'socket.io-client';
import feathers from 'feathers/client';
import hooks from 'feathers-hooks';
import socketio from 'feathers-socketio/client';
import authenticationClient from 'feathers-authentication-client';

import reduxifyServices from 'feathers-redux';
import reduxifyAuthentication from 'feathers-reduxify-authentication';
import configureStore from 'store';

const url = foi.url;

const socket = io(url);
const client = feathers();
client.configure(hooks());
client.configure(socketio(socket));
client.configure(authenticationClient({
  storage: window.localStorage
}));

export const serviceMap = {
  chats: 'chats',
  posts: 'posts',
  media: 'media',
  stories: 'stories',
  users: 'users'
};

export const services = reduxifyServices(client, serviceMap);
export const auth = reduxifyAuthentication(client);
export const store = configureStore({...services, auth});

export default client;
