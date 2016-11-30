const DOWNTIME_URL = "http://opsdev.sence.io/backend/restful-apis/get-sensors-in-building.php";
const BUILDING_ENUMS = "http://opsdev.sence.io/backend/restful-apis/get-buildings.php";

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
                // console.log("Tres manifique, monsieur", response);
            }
        });
    },

    retrieveBuildings: function() {
        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: BUILDING_ENUMS,
            success: function(response) {
                // console.log("Tres manifique, monsieur", response);
            }
        });
    }
}
