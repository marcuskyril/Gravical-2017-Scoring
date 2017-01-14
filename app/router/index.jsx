import React from 'react';
import {Route, Router, IndexRoute, hashHistory} from 'react-router';
var Main = require('Main');
var Dashboard = require('Dashboard');
import Admin from 'Admin';
import PageNotFound from 'PageNotFound';
import Login from 'Login';
import Score from 'Score';
import firebase from 'app/firebase/';

var requireLogin = (nextState, replace, next) => {

    if (!firebase.auth().currentUser) {
        console.log("Current User: ", firebase.auth().currentUser);
        replace('/login');
    }
    next();
};

export default(
    <Router history={hashHistory}>
      <Route path="/" component={Main} >
            <IndexRoute component={Dashboard}/>
      </Route>

      <Route path="/admin" component={Main} >
            <IndexRoute component={Admin} onEnter={requireLogin}/>
      </Route>

      <Route path="/login" component={Login} />
      <Route path="*" component={PageNotFound}/>
    </Router>
);


// <Route path="/about" component={About} onEnter={requireLogin}/>
// <Route path="/examples" component={Examples} onEnter={requireLogin}/>
//   <Route path="/notificationLog" component={NotificationLog} onEnter={requireLogin}/>
//   <Route path="/uptime(/:buildingName)" component={Uptime} onEnter={requireLogin}/>
//   <Route path="/historical(/:macAddress)" component={HistoricalChart} onEnter={requireLogin}/>
//   <Route path="/actionLog" component={ActionLog} onEnter={requireLogin}/>
