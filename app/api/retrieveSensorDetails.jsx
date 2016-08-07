var axios = require('axios');

const RETRIEVE_SENSOR_DETAILS_URL = 'http://52.74.119.147/PisaSchitt/get-sensor-info.php';

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
