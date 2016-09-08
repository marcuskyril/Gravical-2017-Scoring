var axios = require('axios');

const ADD_SENSOR_URL = 'http://opsdev.sence.io/backend/insert-new-sensor.php';

module.exports = {

    addSensor: function(inputMac, inputRegion, inputLocationLevel, inputLocationID, inputBuilding) {

        var data = {
          MAC: inputMac,
          "geo-region": inputRegion,
          "sensor-location-level": inputLocationLevel,
          "sensor-location-id": inputLocationID,
          "building": inputBuilding
        }

        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: ADD_SENSOR_URL,
            data: data,
            success: function(response) {
                console.log("Que pasar?", response);
                // if(response.status != 200) {
                //   throw new Error(response.error);
                // }
            }
        });
    }
}
