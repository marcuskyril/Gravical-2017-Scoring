const CURRENT_SETTINGS_URL = "http://opsdev.sence.io/backend/restful-apis/get_universal_settings.php";
const MODIFY_SETTINGS_URL = "http://opsdev.sence.io/backend/restful-apis/change_universal_settings.php";

module.exports = {

    retrieveCurrentSettings: function() {
        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: CURRENT_SETTINGS_URL,
            success: function(response) {
                console.log("Tres manifique, monsieur", response);
            }
        });
    },

    changeCurrentSettings: function(report_time, email_recipient, flapping_threshold) {

        var data = {
            report_time: report_time,
            email_recipient: email_recipient,
            flapping_threshold: flapping_threshold
        }

        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: MODIFY_SETTINGS_URL,
            data: data,
            success: function(response) {
                console.log("Tres manifique, monsieur", response);
            }
        });

    }
}
