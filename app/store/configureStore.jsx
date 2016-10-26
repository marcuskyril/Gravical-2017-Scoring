import * as redux from 'redux';
import thunk from 'redux-thunk';
import {authReducer, deleteSensorReducer, updateWatchListReducer, syncDataReducer, activeSensorReducer, auditLogReducer} from 'reducers'

export var configure = (initialState = {}) => {
  var reducer = redux.combineReducers({
    auth: authReducer,
    macAddress: deleteSensorReducer,
    pin_mac: updateWatchListReducer,
    syncData: syncDataReducer,
    activeSensor: activeSensorReducer,
    auditLog: auditLogReducer
  });

  var store = redux.createStore(reducer, initialState, redux.compose(
    redux.applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ));

  return store;
};
