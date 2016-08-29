import React from 'react';
import {Route, Router, IndexRoute, hashHistory} from 'react-router';
var Main = require('Main');
var Dashboard = require('Dashboard');
import AccountSettings from 'AccountSettings';
import NotificationLog from 'NotificationLog';
import PageNotFound from 'PageNotFound';
import Login from 'Login';
import firebase from 'app/firebase/';

var requireLogin = (nextState, replace, next) => {

    if (!firebase.auth().currentUser) {
        replace('/');
    }

    next();
};

var redirectIfLoggedIn = (nextState, replace, next) => {
    if (firebase.auth().currentUser) {
        replace('/dashboard');
    }
    next();
};

export default(
    <Router history={hashHistory}>
      <Route path="/dashboard" component={Main} >
          <Route path="/accountSettings" component={AccountSettings} onEnter={requireLogin}/>
          <Route path="/notificationLog" component={NotificationLog} onEnter={requireLogin}/>
          <IndexRoute component={Dashboard}/>
      </Route>
      <Route path="/" component={Login} onEnter={redirectIfLoggedIn}/>
    </Router>
);


// <Route path="/about" component={About} onEnter={requireLogin}/>
// <Route path="/examples" component={Examples} onEnter={requireLogin}/>
