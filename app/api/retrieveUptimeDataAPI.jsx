const RETRIEVE_UPTIME_DATA_URL = 'http://opsdev.sence.io/backend/get_historical_uptime.php';

module.exports = {

    retrieveUptimeData: function(buildingName, numDays) {

        var data = {
          building: buildingName,
          days: numDays
        }

        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: RETRIEVE_UPTIME_DATA_URL,
            data: data,
            success: function(response) {
                console.log("Que pasar?", response);
            }
        });
    }
}
