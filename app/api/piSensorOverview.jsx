// var axios = require('axios');
//
// const PI_OVERVIEW_URL = 'http://52.74.119.147/php-test.php';
//
// module.exports = {
//   getOverview: function() {
//
//     return axios.get(PI_OVERVIEW_URL).then(function(res) {
//       console.log('HTTP status: ',res.status);
//       if(res.status == 200) {
//         return res.data.data;
//       } else {
//         return res.data.status;
//       }
//     }, function(res){
//       throw new Error(res.data);
//     });
//   }
// }
