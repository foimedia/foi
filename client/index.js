import * as runtime from 'offline-plugin/runtime';
if(process.env.NODE_ENV == 'production') {
  runtime.install({
    onUpdateReady: () => {
      runtime.applyUpdate();
    }
  });
}

import React from 'react';
import ReactDom from 'react-dom';
import createHistory from 'history/createBrowserHistory'
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import { ConnectedRouter as Router } from 'react-router-redux';
import 'normalize.css';
import 'font-awesome/css/font-awesome.css';

import configureStore from 'store';
import Application from 'app';
import ScrollToTop from 'components/scroll-top';

import initServices from 'services';
import authService from 'services/auth';

const store = configureStore();
const history = createHistory();

authService(store);
initServices(store);

ReactDom.render(
  <Provider store={store}>
    <Router history={history}>
      <Application />
    </Router>
  </Provider>,
  document.getElementById('app')
);
