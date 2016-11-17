const RETRIEVE_UPTIME_URL = 'http://opsdev.sence.io/backend/restful-apis/get_uptime_chart.php';
const RETRIEVE_HISTORICAL_DATA_URL = 'http://opsdev.sence.io/backend/restful-apis/get_historical_chart.php';
const RETRIEVE_HISTORICAL_DATA_ALT_URL = 'http://opsdev.sence.io/backend/restful-apis/get_uptime_chart_alt.php';

module.exports = {

    retrieveHistoricalDataAlt: function(building, startDate, endDate, interval) {

        // console.log("startDate API", startDate);
        // console.log("endDate API", endDate);

        var data = {
            building: building,
            start_date: startDate,
            end_date: endDate,
            interval: interval
        }

        return $.ajax({
            type: 'POST',
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: RETRIEVE_HISTORICAL_DATA_ALT_URL,
            data: data,
            success: function(response) {
                console.log("Sombrero", response);
            }
        });
    },

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
