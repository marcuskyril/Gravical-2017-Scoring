export var auditLogReducer = (state = {logs: []}, action) => {
    switch(action.type) {
        case 'RETRIEVE_LOGS':
            return {
                logs: action.logs
            }
        default:
            return state;
    }
}

export var syncDataReducer = (state = {currentTime: '-', userId: '-'}, action) => {
    switch(action.type) {
        case 'STORE_SYNC_DATA':

            return {
                currentTime: action.currentTime,
                userId: action.userId
            }
        default:
            return state;
    }
}

export var deleteSensorReducer = (state = {macAddress: ''}, action) => {

  switch(action.type) {
    case 'COMPLETE_DELETE_SENSOR':
      return {
        macAddress: action.macAddress
      }
    default:
      return state;
  }
};

export var updateWatchListReducer = (state = {pin_mac : ''}, action) => {
    switch(action.type) {
        case 'COMPLETE_UPDATE_WATCHLIST':
            return {
                pin_mac: action.pin_mac
            }
        default:
            return state;
    }
};

export var sensorDataReducer = (state = {isFetching: false, data: undefined}, action) => {

  switch (action.type) {
    case 'START_SENSOR_DATA_FETCH':
      return {
        isFetching: true,
        data: undefined
      };

    case 'COMPLETE_SENSOR_DATA_FETCH':
      return {
        isFetching: false,
        data: action.data
      };

    default:
      return state;
  }
};

export var authReducer = (state = {}, action) => {
  switch(action.type) {
    case 'LOGIN':
      return {
        uid: action.uid
      }
    case 'LOGOUT':
      return {};
    default:
      return state;
  }
};

export var activeSensorReducer = (state = {macAdd: '', currentInterval: ''}, action) => {

    switch(action.type) {
      case 'STORE_ACTIVE_SENSOR':
        return {
          sensorData: action.macAdd,
          currentInterval: action.currentInterval
        }
      default:
        return state;
    }
}
