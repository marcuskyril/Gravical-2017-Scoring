// var React = require('react');
// import * as Redux from 'react-redux';
// import {connect} from 'react-redux';
// import * as actions from 'actions';
// var axios = require('axios');
//
// var AddSensor = React.createClass({
//
//     onAddSensor: function(e) {
//         e.preventDefault();
//
//         var inputMac = this.refs.macAddress.value;
//         var inputRegion = this.refs.region.value;
//         var inputLocationLevel = this.refs.sensorLocationLevel.value;
//         var inputLocationID = this.refs.sensorLocationID.value;
//         var inputBuilding = this.refs.building.value;
//
//         var baseUrl = "http://52.74.119.147/PisaSchitt/insert-new-sensor.php";
//
//         axios.get(baseUrl, {
//           params: {
//             MAC: inputMac,
//             "geo-region": inputRegion,
//             "sensor-location-level": inputLocationLevel,
//             "sensor-location-id": inputLocationID,
//             "building": inputBuilding
//           }
//         }).then(function(response) {
//             console.log(response);
//         }).catch(function(error) {
//             console.log("Problem siol", error);
//         });
//
//         // axios({
//         //     method: 'post',
//         //     url: baseUrl,
//         //     data: {
//         //       MAC: inputMac,
//         //       "geo-region": inputRegion,
//         //       "sensor-location-level": inputLocationLevel,
//         //       "sensor-location-id": inputLocationID,
//         //       "building": inputBuilding
//         //     }
//         // }).then(function(response) {
//         //     console.log(response);
//         // }).catch(function(error) {
//         //     console.log("Problem siol", error);
//         // });
//
//     },
//
//     render: function() {
//         return (
//             <div id="add-sensor-modal" className="reveal tiny text-center" data-reveal="">
//                 <form>
//                     <div className="row">
//                         <div className="large-12 columns">
//                             <div className="header">Add Pi</div>
//
//                             <label>Mac Address
//                                 <input type="text" name="macAddress" ref="macAddress" placeholder="Mac Address" required/>
//                             </label>
//                             <label>Region
//                                 <select ref="region" name="region" required>
//                                     <option value=""></option>
//                                     <option value="north">North</option>
//                                     <option value="south">South</option>
//                                     <option value="east">East</option>
//                                     <option value="west">West</option>
//                                     <option value="central">Central</option>
//                                 </select>
//                             </label>
//
//                             <label>Sensor Location level
//                                 <input type="text" name="sensorLocationLevel" ref="sensorLocationLevel" placeholder="Sensor Location Level"/>
//                             </label>
//
//                             <label>Sensor Location ID
//                                 <input type="text" name="sensorLocationID" ref="sensorLocationID" placeholder="Sensor Location ID"/>
//                             </label>
//
//                             <label>Building
//                                 <input type="text" name="building" ref="building" placeholder="Building"/>
//                             </label>
//
//                             <button className="button hollow expanded" onClick={this.onAddSensor}>
//                                 Add Pi
//                             </button>
//                             <button className="button hollow expanded" data-close="">
//                                 Cancel
//                             </button>
//                         </div>
//                     </div>
//                 </form>
//             </div>
//         );
//     }
// });
//
// // module.exports = connect(
// //   (state) => {
// //     return {
// //
// //     }
// //   }
// // )(AddSensor);
//
// module.exports = AddSensor;
//
// // export default connect()(AddSensor);
