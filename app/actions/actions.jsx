import firebase, {firebaseRef} from 'app/firebase/';
import moment from 'moment';
var axios = require('axios');

export var storeSyncData = (currentTime, userId) => {
    return {type: 'STORE_SYNC_DATA', currentTime, userId}
}

export var startSensorDataFetch = () => {
    return {type: 'START_SENSOR_DATA_FETCH'};
};

export var completeSensorDataFetch = (data) => {
    return {type: 'COMPLETE_SENSOR_DATA_FETCH', data};
};

export var completeDeleteSensor = (macAddress) => {
    return {type: 'COMPLETE_DELETE_SENSOR', macAddress}
}

export var completeUpdateWatchList = (pin_mac) => {
    return {type: 'COMPLETE_UPDATE_WATCHLIST', pin_mac}
}

// add to log test

export var startAddToLog = (userId, action) => {

    return (dispatch, getState) => {
        var logItem = {
            userId,
            action,
            timestamp: moment().format('YYYY-MM-DD')
        };

        var logRef = firebaseRef.child('log').push(logItem);

        return logRef.then(() => {
            dispatch(addToLog({
                ...logItem,
                id: logRef.key
            }));
        });
    };
};

export var addToLog = (action) => {
    console.log("action: ", action);

    return {type: 'ADD_TO_LOG', action}
}

export var startRetrieveLogs = () => {
    return (dispatch, getState) => {
        var logRef = firebaseRef.child('log');

        return logRef.once('value').then((snapshot) => {
            var logs = snapshot.val() || {};

            var parsedLogs = [];

            Object.keys(logs).forEach((logId) => {
                parsedLogs.push({
                    id: logId,
                    ...logs[logId]
                });
            });

            dispatch(retrieveLogs(parsedLogs));
        });
    };
};

export var retrieveLogs = (logs) => {
    console.log("logs", logs);

    return {type: 'RETRIEVE_LOGS', logs}
}

// end add to log test

export var storeActiveSensor = (macAdd, currentInterval) => {
    console.log("activeSensor", macAdd, currentInterval);
    return {type: 'STORE_ACTIVE_SENSOR', macAdd, currentInterval}
}

export var login = (uid) => {
    return {type: 'LOGIN', uid};
};

export var logout = () => {
    return {type: 'LOGOUT'};
};

export var startDeleteSensor = (macAddress) => {
  return (dispatch, getState) => {
    dispatch(completeDeleteSensor(macAddress));
  };
};

export var startUpdateWatchList = (pin_mac) => {
  return (dispatch, getState) => {
    dispatch(completeUpdateWatchList(pin_mac));
  };
};

export var startResetPassword = (userEmailAddress) => {
    console.log("start reset password");
    var auth = firebase.auth();

    auth.sendPasswordResetEmail(userEmailAddress).then(function() {
        console.log('Reset password email sent', result);
    }, function(error) {
        console.log('Alamak', error);
    });
};

export var startLogin = (inputEmail, inputPassword) => {
    console.log("start login");
    return (dispatch, getState) => {
        return firebase.auth().signInWithEmailAndPassword(inputEmail, inputPassword).then((result) => {
            console.log('Authentication worked!', result);
        }, (error) => {
            alert('Problem siol: ' +error);
        });
    };
};

export var startLogout = () => {
    return (dispatch, getState) => {
        return firebase.auth().signOut().then(() => {
            console.log('Logged out!');
        });
    };
};

export var startCreateAccount = () => {
    return (dispatch, getState) => {
        return firebase.auth().createUserWithEmailAndPassword('admin@live.com', 'asdf0000').then((res) => {
            console.log('What do you want? A medal?', res);
        }, (error) => {
            console.log('Piss off.', error);
        });
    };
};
