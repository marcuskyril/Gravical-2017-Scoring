const DOWNTIME_URL = "http://opsdev.sence.io/backend/get-sensors-in-building.php";

module.exports = {

    retrieveSensors: function(building) {

        var data = {
          building: building
        }

        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: DOWNTIME_URL,
            data: data,
            success: function(response) {
                console.log("Tres manifique, monsieur", response);
            }
        });
    }
}
