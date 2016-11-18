const RETRIEVE_UPTIME_URL = 'http://opsdev.sence.io/backend/restful-apis/get_uptime_chart.php';
const RETRIEVE_HISTORICAL_DATA_URL = 'http://opsdev.sence.io/backend/restful-apis/get_historical_chart.php';
const RETRIEVE_HISTORICAL_DATA_ALT_URL = 'http://opsdev.sence.io/backend/restful-apis/get_uptime_chart_alt.php';

module.exports = {

    retrieveHistoricalDataAlt: function(building, startDate, endDate, interval) {

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

        console.log("buildingName", buildingName);
        console.log("startDate", startDate);
        console.log("endDate", endDate);
        console.log("interval", interval);

        var data = {
          building: buildingName,
          'start_date': startDate,
          'end_date': endDate,
          interval: interval
        }

        return $.ajax({
            type: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            url: RETRIEVE_UPTIME_URL,
            data: data,
            success: function(response) {
                console.log("Que pasar?", response);
            }
        });
    },

    retrieveHistoricalChart: function(macAdd, startDate, endDate, interval, metric) {

        console.log("macAdd", macAdd);
        console.log("metric", metric);

        var data = {
          mac: macAdd,
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
                // console.log("Que pasar?", response);
            }
        });
    }
};
