import * as redux from 'redux';
import thunk from 'redux-thunk';
import {sensorDataReducer, authReducer, deleteSensorReducer, updateWatchListReducer, syncDataReducer} from 'reducers'

export var configure = (initialState = {}) => {
  var reducer = redux.combineReducers({
    sensorData: sensorDataReducer,
    auth: authReducer,
    macAddress: deleteSensorReducer,
    pin_mac: updateWatchListReducer,
    syncData: syncDataReducer
  });

  var store = redux.createStore(reducer, initialState, redux.compose(
    redux.applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ));

  return store;
};
