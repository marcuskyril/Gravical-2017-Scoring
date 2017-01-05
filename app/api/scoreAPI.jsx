const GET_CATEGORIES_URL = "https://devical-ducktor108.rhcloud.com/backend/api/get_categories.php";
const SUBMIT_SCORE_URL = "https://devical-ducktor108.rhcloud.com/backend/api/enter_score.php";
const GET_CURRENT_PARTICIPANTS_URL = "https://devical-ducktor108.rhcloud.com/backend/api/get_current_participants.php";
const GET_NUM_DETAILS_URL = "https://devical-ducktor108.rhcloud.com/backend/api/get_number_of_details.php";
const GET_SCORE_URL = "https://devical-ducktor108.rhcloud.com/backend/api/get_score.php";

module.exports = {

    submitScore: function(tagID, route, attempts, judge) {
        var data = {
            tagID, route, attempts, judge
        }

        console.log("data", data);

        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: SUBMIT_SCORE_URL,
            data,
            success: function(response) {
                // console.log("Tres manifique, monsieur", response);
            }
        });
    },

    retrieveCategories: function() {
        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            url: GET_CATEGORIES_URL,
            success: function(response) {
                // console.log("Tres manifique, monsieur", response);
            }
        });
    },

    retrieveDetails: function(categoryID) {
        var data = {
            categoryID
        }

        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            data,
            url: GET_NUM_DETAILS_URL,
            success: function(response) {
                // console.log("Tres manifique, monsieur", response);
            }
        });
    },

    retrieveClimbers: function(categoryID, detail) {

        var data = {
            categoryID, detail
        }

        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            data,
            url: GET_CURRENT_PARTICIPANTS_URL,
            success: function(response) {
                // console.log("Tres manifique, monsieur", response);
            }
        });
    },

    retrieveScore: function(tagID, route) {

        var data = {
            tagID, route
        }

        return $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            data,
            url: GET_SCORE_URL,
            success: function(response) {
                // console.log("Tres manifique, monsieur", response);
            }
        });
    },

}
