const ADD_CLIMBER_URL = "http://office.livestudios.com:41111/backend/api/add_climber.php";
const REGISTER_PARTICIPANT_URL = "http://office.livestudios.com:41111/backend/api/register_participant.php";
const START_EVENT_URL = "http://office.livestudios.com:41111/backend/api/start_event.php";
const STOP_EVENT_URL = "http://office.livestudios.com:41111/backend/api/stop_event.php";
const SET_CURRENT_DETAIL_URL = "http://office.livestudios.com:41111/backend/api/set_current_detail.php";
const GET_CURRENT_EVENT_URL = "http://office.livestudios.com:41111/backend/api/get_current_event.php";
const GET_CURRENT_DETAIL_URL = "http://office.livestudios.com:41111/backend/api/get_current_detail.php"
const GET_LAST_CLIMBER_ID_URL = "http://office.livestudios.com:41111/backend/api/get_last_climber_id.php";

module.exports = {

    addClimber: function(climberID,first_name, last_name, gender, date_of_birth, id_number, nationality, organization) {

        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: ADD_CLIMBER_URL,
            data: {
                climberID, first_name, last_name, gender, date_of_birth, id_number, nationality, organization
            },
            success: function(response) {
                console.log("Add API", response);
            }
        });
    },

    registerClimber: function(participantID, categoryID, detail) {

        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: REGISTER_PARTICIPANT_URL,
            data: {participantID, categoryID, detail},
            success: function(response) {
                console.log("Register API", response);
            }
        });
    },

    getLastCLimberID: function() {
        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: GET_LAST_CLIMBER_ID_URL,
            success: function(response) {
                // console.log("Tres manifique, monsieur", response);
            }
        });
    },

    startEvent: function(categoryID) {
        var data = {
            categoryID
        }

        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: START_EVENT_URL,
            data: data,
            success: function(response) {
                // console.log("Tres manifique, monsieur", response);
            }
        });
    },

    endEvent: function() {

        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: STOP_EVENT_URL,
            success: function(response) {
                console.log("response", response);
            }
        });
    },

    setCurrentDetail: function(detail) {

        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            data: {detail},
            url: SET_CURRENT_DETAIL_URL,
            success: function(response) {
                // console.log("Tres manifique, monsieur", response);
            }
        });
    },

    getCurrentEvent: function() {
        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: GET_CURRENT_EVENT_URL,
            success: function(response) {
                // console.log("Tres manifique, monsieur", response);
            }
        });
    },

    getCurrentDetail: function() {
        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: GET_CURRENT_DETAIL_URL,
            success: function(response) {
                // console.log("Tres manifique, monsieur", response);
            }
        });
    }

}
