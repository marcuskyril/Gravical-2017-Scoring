var React = require('react');
var ReactDOM = require('react-dom');
var {Provider} = require('react-redux');
var {hashHistory} = require('react-router');
import firebase from 'app/firebase/';
import router from 'app/router';
var actions = require('actions');
var store = require('configureStore').configure();

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log("Successfully logged in");
    store.dispatch(actions.login(user.uid));
    hashHistory.push('/dashboard');
  } else {
    store.dispatch(actions.logout());
    hashHistory.push('/');
  }
});

// -----------------------------

store.subscribe(() => {
  console.log('New state', store.getState());
});

// Load foundation
require('style!css!foundation-sites/dist/foundation.min.css');
$(document).foundation();

require('style!css!sass!applicationStyles');
require('style!css!sass!navStyles');
require('style!css!sass!loginStyles');
require('style!css!sass!griddleStyles');

ReactDOM.render(
  <div>
    <Provider store={store}>
      {router}
    </Provider>
  </div>,
  document.getElementById('app')
);
