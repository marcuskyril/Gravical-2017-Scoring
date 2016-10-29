const REBOOT_SENSOR_URL = "http://119.81.104.46/backend/initialize_reboot_sequence.php";

module.exports = {

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
    }
}
