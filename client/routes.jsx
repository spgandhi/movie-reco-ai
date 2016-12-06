import React from 'react'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'

// containers
import App from '/client/App.jsx';
import Add from '/client/Add.jsx';
import Login from '/client/Login.jsx';
import Admin from '/client/Admin.jsx';
import Installtion from '/client/Installation.jsx';
// pages

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/installation" component={Installtion} />
    <Route path="/login" component={Login} />
    <Route path="/add" component={Add} />
    <Route path="/admin" component={Admin} />
    <Route path="/" component={App}>
      <IndexRoute component={App}/>
    </Route>
  </Router>
);
