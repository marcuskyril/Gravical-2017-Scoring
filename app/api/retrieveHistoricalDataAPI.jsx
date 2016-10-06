const RETRIEVE_DATA_URL = 'http://opsdev.sence.io/backend/get_historical_chart.php';

module.exports = {

    retrieveHistoricalData: function(buildingName, startDate, endDate, interval, metric) {

        var data = {
          building: buildingName,
          'start_date': startDate,
          'end_date': endDate,
          interval: interval,
          metric: metric
        }

        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: RETRIEVE_DATA_URL,
            data: data,
            success: function(response) {
                console.log("Que pasar?", response);
            }
        });
    },

    retrieveHistoricalDatasets: function(buildingName, metrics, startDate, endDate, interval) {
        // console.log("metrics", metrics);

        $.when(
            metrics.forEach(function(metric) {

                // console.log("metric", metric);

                var data = {
                    building: buildingName,
                    'start_date': startDate,
                    'end_date': endDate,
                    interval: interval,
                    metric: metric
                }

                $.post(RETRIEVE_DATA_URL, data, function(res) {
                    console.log(res);
                });
            })
        ).then(function(data) {
            console.log("data", data);
        });
    }
};
