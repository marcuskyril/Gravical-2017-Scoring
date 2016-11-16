var axios = require('axios');

const ADD_SENSOR_URL = 'http://119.81.104.46/backend/restful-apis/insert-new-sensor.php';
const DELETE_SENSOR_URL = "http://119.81.104.46/backend/restful-apis/delete-sensor.php";
const EDIT_SENSOR_URL = 'http://119.81.104.46/backend/restful-apis/edit-sensor.php';
const REBOOT_SENSOR_URL = "http://119.81.104.46/backend/restful-apis/initialize_reboot_sequence.php";
const PAUSE_SENSOR_URL = 'http://119.81.104.46/backend/restful-apis/sensor-pause.php';
const UPDATE_WATCHLIST_URL = 'http://119.81.104.46/backend/restful-apis/sensor-watchlist-pin.php';

module.exports = {

    addSensor: function(inputMac, inputRegion, inputLocationLevel, inputLocationID, inputBuilding, inputPort,
        inputDangerDisk='', inputDangerCPU='', inputDangerRAM='', inputDangerDTPercentage='',
        inputDangerTemp='', inputWarningDisk='', inputWarningCPU='', inputWarningRAM='',
        inputWarningDTPercentage='', inputWarningTemp=''
    ) {

        var data = {
          MAC: inputMac,
          "geo-region": inputRegion,
          "sensor-location-level": inputLocationLevel,
          "sensor-location-id": inputLocationID,
          "building": inputBuilding,
          "port" : inputPort
        }

        if (inputDangerDisk != '') { data["dangerDisk"] = inputDangerDisk; }
        if (inputDangerCPU != '') { data["dangerCPU"] = inputDangerCPU; }
        if (inputDangerRAM != '') { data["dangerRAM"] = inputDangerRAM; }
        if (inputDangerDTPercentage != '') { data["dangerDTPercentage"] = inputDangerDTPercentage; }
        if (inputDangerTemp != '') { data["dangerTemp"] = inputDangerTemp; }

        if (inputWarningDisk != '') { data["warningDisk"] = inputWarningDisk; }
        if (inputWarningCPU != '') { data["warningCPU"] = inputWarningCPU; }
        if (inputWarningRAM != '') { data["warningRAM"] = inputWarningRAM; }
        if (inputWarningDTPercentage != '') { data["warningDTPercentage"] = inputWarningDTPercentage; }
        if (inputWarningTemp != '') { data["warningTemp"] = inputWarningTemp; }

        console.log("add sensor data: ", data);

        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: ADD_SENSOR_URL,
            data: data,
            success: function(response) {
                console.log("Que pasar?", response);
            }
        });
    },

    editSensor: function(inputMac, inputRegion, inputLocationLevel, inputLocationID, inputBuilding, inputPort) {

        var data = {
          MAC: inputMac,
          "geo-region": inputRegion,
          "sensor-location-level": inputLocationLevel,
          "sensor-location-id": inputLocationID,
          "building": inputBuilding,
          "port": inputPort
        }

        console.log("edit data", data);

        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: EDIT_SENSOR_URL,
            data: data,
            success: function(response) {
                console.log("Que pasar?", response);
                // if(response.status != 200) {
                //   throw new Error(response.error);
                // }
            }
        });
    },

    pauseSensor: function(macAddress, isPaused) {
        console.log("macAddress", macAddress, "isPaused", isPaused);

        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: PAUSE_SENSOR_URL,
            data: {
                mac_addresses: macAddress,
                pause_status: isPaused
            },
            success: function(response) {
                console.log("Madre de hijo", response);
            }
        });
    },

    updateWatchList: function(macAddress, pin_status) {
        console.log("trying to update: ", macAddress, pin_status);

        var data = {
            "MAC": macAddress,
            "pin_status": pin_status
        }

        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: UPDATE_WATCHLIST_URL,
            data: data,
            success: function(msg) {
                console.log("Que pasar?", msg);
            },
            error: function(e) {
                console.log("Remove sensor", e);
            }
        });
    },

    rebootSensor: function(inputMac, username, password) {

        var data = {
          MAC: inputMac,
          username: username,
          password: password
        }

        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: REBOOT_SENSOR_URL,
            data: data,
            success: function(response) {
                console.log("Que pasar?", response);
                // if(response.status != 200) {
                //   throw new Error(response.error);
                // }
            }
        });
    },

    deleteSensor: function(macAddress) {
        console.log(macAddress);

        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: DELETE_SENSOR_URL,
            data: {
                "MAC": macAddress
            },
            success: function(response) {
                console.log("Que pasar?", response);
            }
        });
    }
}
