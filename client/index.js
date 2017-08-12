import React from 'react';
import ReactDom from 'react-dom';
import createHistory from 'history/createBrowserHistory'
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import { ConnectedRouter as Router } from 'react-router-redux';
// import { BrowserRouter as Router } from 'react-router-dom';
import 'normalize.css';
import 'font-awesome/css/font-awesome.css';

import configureStore from 'store';
import Application from 'app';
import ScrollToTop from 'components/scroll-top'

const store = configureStore();
import initServices from 'services';

const history = createHistory();

initServices(store);

ReactDom.render(
  <Provider store={store}>
    <Router history={history}>
      <Application />
    </Router>
  </Provider>,
  document.getElementById('app')
);
