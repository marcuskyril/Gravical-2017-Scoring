var React = require('react');
var FontAwesome = require('react-fontawesome');
var downtimeSchedulerAPI =require('downtimeSchedulerAPI');
var Select = require('react-select');
import * as Redux from 'react-redux';
import * as actions from 'actions';
import firebase, {firebaseRef} from 'app/firebase/';

class DowntimeScheduler extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            sensorList: [],
            buildingList: []
        }
    }

    componentDidMount() {
        var that = this;

        downtimeSchedulerAPI.retrieveBuildings().then(function(response) {
            that.setState({
                buildingList: response
            });
        });
    }

    retrieveSensors(building) {

        var that = this;

        downtimeSchedulerAPI.retrieveSensors(building).then(function(response) {
            if(response.error) {
                console.log("Error", response.error);
            } else {
                console.log("response", response);

                var options = [];

                response.forEach(function(sensor) {
                    var obj = {};

                    obj['label'] = sensor['location']+sensor['areaId'];
                    obj['value'] = sensor['macAdd'];

                    if(obj['pause']) {
                        obj['disabled'] = true;
                    }

                    options.push(obj);
                });


                that.setState({
                    sensorList: options
                });
            }
        });
    }

    render() {

        var {buildingList, sensorList} = this.state;
        var buildingRows = [];
        var sensorRows = [];
        var that = this;

        if(buildingList) {
            buildingList.forEach(function(response) {
                buildingRows.push(
                    <tr key={response.value} onClick={() => {that.retrieveSensors(response.value)}}>
                        <td>{response.value}</td>
                    </tr>
                );
            });
        }

        if(allSensors) {
            var sensorRows = allSensors['all_sensors'];

            if(sensorRows) {
                sensorRows.forEach(function(response) {
                    console.log("macAdd", response['macAdd']);
                    sensorRows.push(
                        <tr key={response.macAdd}>
                            <td>{response.location + response.areaId}</td>
                        </tr>
                    );
                });
            }
        }

        return (
            <div className="margin-top-md">
                <div className="large-8 columns large-centered">

                    <div className="page-title margin-bottom-small">Downtime Manager</div>

                    <div className="row margin-top-md">
                        <div className="columns large-4">
                            <div className="page-title">All Buildings</div>
                                <table id="buildingList">
                                    <tbody>
                                        {buildingRows}
                                    </tbody>
                                </table>
                        </div>
                        <div className="columns large-4">
                            <div className="page-title">Sensors</div>
                                <table>
                                    <tbody>
                                        {sensorRows}
                                    </tbody>
                                </table>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
};

module.exports = DowntimeScheduler;
