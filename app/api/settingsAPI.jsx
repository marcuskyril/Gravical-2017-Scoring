const CURRENT_SETTINGS_URL = "http://opsdev.sence.io/backend/restful-apis/get_universal_settings.php";
const MODIFY_SETTINGS_URL = "http://opsdev.sence.io/backend/restful-apis/change_universal_settings.php";
const UDPATE_REPORT_URL = "http://opsdev.sence.io/backend/restful-apis/change_report_settings.php";
const UDPATE_FLAPPING_URL = "http://opsdev.sence.io/backend/restful-apis/change_flapping_settings.php";

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

    updateFlappingSettings: function(flapping_threshold) {
        var data = {
            flapping_threshold: flapping_threshold
        }

        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: UDPATE_FLAPPING_URL,
            data: data,
            success: function(response) {
                console.log("Tres manifique, monsieur", response);
            }
        });

    },

    updateReportSettings: function(report_time, email_recipient) {
        var data = {
            report_time: report_time,
            email_recipient: email_recipient
        }

        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: UDPATE_REPORT_URL,
            data: data,
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
