const RETRIEVE_UPTIME_DATA_URL = 'http://opsdev.sence.io/backend/get_historical_chart.php';

module.exports = {

    retrieveUptimeData: function(buildingName, startDate, endDate, interval) {

        var data = {
          building: buildingName,
          'start_date': startDate,
          'end_date': endDate,
          interval: interval,
          metric: "uptime"
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
