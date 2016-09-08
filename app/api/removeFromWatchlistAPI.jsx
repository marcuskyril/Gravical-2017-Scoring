var axios = require('axios');

const REMOVE_FROM_WATCHLIST_URL = 'http://opsdev.sence.io/backend/sensor-watchlist-pin.php';

module.exports = {

    removeFromWatchlist: function(macAddress) {
        console.log("trying to remove: ", macAddress);

        var data = {
            "MAC": macAddress,
            "pin_status": false
        }

        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: REMOVE_FROM_WATCHLIST_URL,
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
