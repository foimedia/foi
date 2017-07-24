import reduxThunk from 'redux-thunk';
import reduxPromiseMiddleware from 'redux-promise-middleware';
import { routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import logger from './logger';

export default [
  reduxThunk,
  reduxPromiseMiddleware(),
  routerMiddleware(browserHistory),
  // logger
];
