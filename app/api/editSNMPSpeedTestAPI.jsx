const EDIT_SNMP_SPEEDTEST_URL = 'http://119.81.104.46/backend/restful-apis/set_speed_test_interval.php';

module.exports = {

    editSNMPSpeedTest: function(inputMac, inputUsername, inputPassword, inputInterval) {

        var data = {
              MAC: inputMac,
              username: inputUsername,
              password: inputPassword,
              interval: inputInterval
        }

        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: EDIT_SNMP_SPEEDTEST_URL,
            data: data,
            success: function(response) {
                console.log("Que pasar?", response);
            }
        });
    }
}
