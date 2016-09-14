const REBOOT_SENSOR_URL = "http://opsdev.sence.io/backend/initialize_reboot_sequence.php";

module.exports = {

    addSensor: function(inputMac) {

        var data = {
          MAC: inputMac
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
