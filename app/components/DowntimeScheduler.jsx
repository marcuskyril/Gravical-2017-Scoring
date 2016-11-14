var React = require('react');
var FontAwesome = require('react-fontawesome');
var downtimeSchedulerAPI =require('downtimeSchedulerAPI');
var Select = require('react-select');
import * as Redux from 'react-redux';
import * as actions from 'actions';
import firebase, {firebaseRef} from 'app/firebase/';
// import BigCalendar from 'react-big-calendar';
// import moment from 'moment';

// BigCalendar.momentLocalizer(moment);

// const repeatInterval = [
//     {
//         label: 'daily',
//         value: 'daily'
//     }, {
//         label: 'weekly',
//         value: 'weekly'
//     }, {
//         label: 'monthly',
//         value: 'monthly'
//     }
// ];
//
// const timeInterval = [
//     {
//         label: '0000',
//         value: '0000'
//     }, {
//         label: '00:30',
//         value: '00:30'
//     }, {
//         label: '01:00',
//         value: '01:00'
//     }, {
//         label: '01:30',
//         value: '01:30'
//     }, {
//         label: '02:00',
//         value: '02:00'
//     }, {
//         label: '02:30',
//         value: '02:30'
//     }, {
//         label: '03:00',
//         value: '03:00'
//     }, {
//         label: '04:30',
//         value: '04:30'
//     }, {
//         label: '05:00',
//         value: '05:00'
//     }, {
//         label: '06:30',
//         value: '06:30'
//     }, {
//         label: '07:00',
//         value: '07:00'
//     }, {
//         label: '08:30',
//         value: '08:30'
//     }, {
//         label: '09:00',
//         value: '09:00'
//     }, {
//         label: '10:30',
//         value: '10:30'
//     }, {
//         label: '11:00',
//         value: '11:00'
//     }, {
//         label: '12:30',
//         value: '12:30'
//     }, {
//         label: '13:00',
//         value: '13:00'
//     }, {
//         label: '13:30',
//         value: '13:30'
//     }, {
//         label: '14:00',
//         value: '14:00'
//     }, {
//         label: '14:30',
//         value: '14:30'
//     }, {
//         label: '15:00',
//         value: '15:00'
//     }, {
//         label: '15:30',
//         value: '15:30'
//     }, {
//         label: '16:00',
//         value: '16:00'
//     }, {
//         label: '16:30',
//         value: '16:30'
//     }, {
//         label: '17:00',
//         value: '17:00'
//     }, {
//         label: '18:30',
//         value: '18:30'
//     }, {
//         label: '19:00',
//         value: '19:00'
//     }, {
//         label: '19:30',
//         value: '19:30'
//     }, {
//         label: '20:00',
//         value: '20:00'
//     }, {
//         label: '20:30',
//         value: '20:30'
//     }, {
//         label: '21:00',
//         value: '21:00'
//     }, {
//         label: '21:30',
//         value: '21:30'
//     }, {
//         label: '22:00',
//         value: '22:00'
//     }, {
//         label: '22:30',
//         value: '22:30'
//     }, {
//         label: '23:00',
//         value: '23:00'
//     }, {
//         label: '23:30',
//         value: '23:30'
//     }
// ];
//


class DowntimeScheduler extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            allSensors: [],
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
                that.setState({
                    allSensors: response
                });
            }
        });
    }

    render() {

        var {buildingList, allSensors} = this.state;
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
