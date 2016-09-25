import * as redux from 'redux';
import thunk from 'redux-thunk';
import {sensorDataReducer, authReducer, deleteSensorReducer, updateWatchListReducer} from 'reducers'

export var configure = (initialState = {}) => {
  var reducer = redux.combineReducers({
    sensorData: sensorDataReducer,
    auth: authReducer,
    macAddress: deleteSensorReducer,
    pin_mac: updateWatchListReducer
  });

  var store = redux.createStore(reducer, initialState, redux.compose(
    redux.applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ));

  return store;
};
