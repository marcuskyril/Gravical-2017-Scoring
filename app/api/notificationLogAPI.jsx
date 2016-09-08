var axios = require('axios');

const NOTIFICATIONS_LOG_URL = 'http://opsdev.sence.io/backend/get_notifications_log.php';

module.exports = {

    retrieveNotifications: function(inputEntries) {

        var data = {
          "log_count": inputEntries
        }

        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: NOTIFICATIONS_LOG_URL,
            data: data,
            success: function(response) {
                // console.log("El API no quieren lo que has dado", response);
            }
        });
    }
}
