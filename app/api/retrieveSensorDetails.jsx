var axios = require('axios');

const RETRIEVE_SENSOR_DETAILS_URL = 'http://119.81.104.46/backend/restful-apis/get-sensor-info.php';

module.exports = {

    retrieveSensorDetails: function(macAddress) {
    console.log(macAddress);
    return axios.get(RETRIEVE_SENSOR_DETAILS_URL, macAddress).then(function(response) {
          console.log(response);
          if(response.status == 200) {
            return response;
          } else {
            throw new Error(response.status +" :" +response.data.error);
          }
      });
    }
}
