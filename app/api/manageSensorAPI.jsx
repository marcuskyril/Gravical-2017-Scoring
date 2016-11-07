var axios = require('axios');

const ADD_SENSOR_URL = 'http://119.81.104.46/backend/insert-new-sensor.php';
const PAUSE_SENSOR_URL = 'http://119.81.104.46/backend/sensor-pause.php';

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

    pauseSensor: function(macAddress, isPaused) {
        console.log("macAddress", macAddress, "isPaused", isPaused);

        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: PAUSE_SENSOR_URL,
            data: {
                "MAC": macAddress,
                pause_status: isPaused
            },
            success: function(response) {
                console.log("Madre de hijo", response);
            }
        });
    }
}
