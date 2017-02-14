import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import initializeStore from "./shared/initializeStore";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import "../semantic/dist/semantic.min.css";

let store = initializeStore();

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
