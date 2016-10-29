var axios = require('axios');

const UPDATE_WATCHLIST_URL = 'http://119.81.104.46/backend/sensor-watchlist-pin.php';

module.exports = {

    updateWatchList: function(macAddress, pin_status) {
        console.log("trying to update: ", macAddress, pin_status);

        var data = {
            "MAC": macAddress,
            "pin_status": pin_status
        }

        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: UPDATE_WATCHLIST_URL,
            data: data,
            success: function(msg) {
                console.log("Que pasar?", msg);
            },
            error: function(e) {
                console.log("Remove sensor", e);
            }
        });
    }
}
