var React = require('react');
var ReactDOM = require('react-dom');
var {Provider} = require('react-redux');
var {hashHistory, browserHistory} = require('react-router');
import firebase from 'app/firebase/';
import router from 'app/router';
import moment from 'moment';
var actions = require('actions');
var store = require('configureStore').configure();

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log(`${user.email} has successfully logged in at: ${moment().format('YYYY-MM-DD, h:mm:ss a')}`);
    store.dispatch(actions.login(user.uid));
    hashHistory.push('/admin');
  } else {
    store.dispatch(actions.logout());
    hashHistory.push('/');
  }
});

// -----------------------------

store.subscribe(() => {
  // console.log('New state', store.getState());
});

// Load foundation
require('style!css!foundation-sites/dist/foundation.css');
$(document).foundation();

require('style!css!sass!applicationStyles');
require('style!css!sass!navStyles');
require('style!css!sass!loginStyles');
require('style!css!sass!griddleStyles');
require('style!css!sass!bigCalendarStyles');
require('style!css!sass!reactSelect');

ReactDOM.render(
  <div>
    <Provider store={store}>
      {router}
    </Provider>
  </div>,
  document.getElementById('app')
);
