const RETRIEVE_UPTIME_URL = 'http://opsdev.sence.io/backend/get_uptime_chart.php';
const RETRIEVE_HISTORICAL_DATA_URL = 'http://opsdev.sence.io/backend/get_historical_chart.php';

module.exports = {

    retrieveHistoricalData: function(buildingName, startDate, endDate, interval) {

        var data = {
          building: buildingName,
          'start_date': startDate,
          'end_date': endDate,
          interval: interval
        }

        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: RETRIEVE_UPTIME_URL,
            data: data,
            success: function(response) {
                console.log("Que pasar?", response);
            }
        });
    },

    retrieveHistoricalChart: function(mac, startDate, endDate, interval, metric) {

        // console.log("macAdd", macAdd);
        // console.log("metric", metric);

        var data = {
          mac: mac,
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
            url: RETRIEVE_HISTORICAL_DATA_URL,
            data: data,
            success: function(response) {
                console.log("Que pasar?", response);
            }
        });
    }
};