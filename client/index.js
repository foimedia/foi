import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import 'normalize.css';
import 'font-awesome/css/font-awesome.css';

import Application from 'app';

import { store } from 'services/feathers';

ReactDom.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Application />
    </Router>
  </Provider>,
  document.getElementById('app')
);
