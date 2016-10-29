var axios = require('axios');

const EDIT_SENSOR_URL = 'http://119.81.104.46/backend/edit-sensor.php';

module.exports = {

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
    }
}
