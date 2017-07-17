import React from 'react';
import ReactDom from 'react-dom';
import Application from './main/application';
import { BrowserRouter as Router } from 'react-router-dom';
import 'normalize.css';
import 'font-awesome/css/font-awesome.css';

ReactDom.render(
  <Router>
    <Application />
  </Router>,
  document.getElementById('app')
);
