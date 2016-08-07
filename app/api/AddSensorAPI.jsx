var axios = require('axios');

const ADD_SENSOR_URL = 'http://52.74.119.147/PisaSchitt/insert-new-sensor.php';

module.exports = {

    addSensor: function(inputMac, inputRegion, inputLocationLevel, inputLocationID, inputBuilding) {
    console.log(inputMac, inputRegion, inputLocationLevel, inputLocationID, inputBuilding);
    return axios.post(ADD_SENSOR_URL, {
          params: {
              MAC: inputMac,
              "geo-region": inputRegion,
              "sensor-location-level": inputLocationLevel,
              "sensor-location-id": inputLocationID,
              "building": inputBuilding
          }
      }).then(function(response) {
          console.log(response);
          if(response.status == 200) {
            return response.data.message;
          } else {
            throw new Error(response.status +" :" +response.data.error);
          }
      });
    }
}

// module.exports = {
//     getTemp: function(location) {
//
//         return axios.get(requestUrl).then(function(res) {
//             if (res.data.cod && res.data.message) {
//                 console.log(res.data.message);
//                 throw new Error(res.data.message);
//             } else {
//                 console.log(res.data.message);
//
//                 return res.data.main.temp;
//             }
//         }, function(res) {
//             throw new Error(res.data.message);
//         });
//     }
// }
