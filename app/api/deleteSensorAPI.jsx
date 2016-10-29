const DELETE_SENSOR_URL = "http://119.81.104.46/backend/delete-sensor.php";

module.exports = {

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
