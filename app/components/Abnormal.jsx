var React = require('react');
var Griddle = require('griddle-react');
import * as Redux from 'react-redux';
import * as actions from 'actions';
import {connect} from 'react-redux';

class SensorBlockComponent extends React.Component {

    render() {
        // url ="speakers/" + this.props.rowData.state + "/" + this.props.data;

        var colorMap = {
          "ok" : "sensorBlock green",
          "warning" : "sensorBlock yellow",
          "danger" : "sensorBlock orange",
          "down" : "sensorBlock red",
          "-" : "sensorBlock grey",
        }

        return (
            <div className={colorMap[this.props.data]}>{this.props.data}</div>
        );
    }
};

class PinComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    handleClick(macAddress) {
        var dispatch = this.props.data.dispatch;
        dispatch(actions.startUpdateWatchList(macAddress));
        $('#pin-sensor-modal').foundation('open');
    }

    renderClass(){
        return (
            this.props.data.watchlist ? "sensorBlock pin disabled" : "sensorBlock pin"
        );
    }

    render() {
      return (
        <div id="pin-btn" onClick={() => this.handleClick(this.props.data.mac)} className={this.renderClass()}>Pin</div>
      );

    }
};

const tableMetaData = [
    {
        "columnName": "building",
        "order": 1,
        "locked": true,
        "visible": true,
        "displayName": "Building"
    }, {
        "columnName": "sensor-level-id",
        "order": 2,
        "locked": true,
        "visible": true,
        "displayName": "ID"
    }, {
        "columnName": "sensor_status",
        "order": 5,
        "locked": false,
        "visible": true,
        "sortable": true,
        "displayName": "Sensor Status",
        "customComponent": SensorBlockComponent
    }, {
        "columnName": "flapping",
        "order": 3,
        "locked": false,
        "visible": true,
        "sortable": true,
        "displayName": "Flapping"
    }, {
        "columnName": "network_router",
        "order": 4,
        "locked": false,
        "visible": true,
        "sortable": true,
        "displayName": "Network Router"
    }, {
        "columnName": "pin",
        "order": 6,
        "locked": true,
        "visible": true,
        "sortable": false,
        "displayName": "Actions",
        "customComponent": PinComponent
    }
];



class Abnormal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var allSensorData = this.props.data;
        var dataList = [];
        var {dispatch} = this.props;

        for (var sensor in allSensorData) {
            if (allSensorData.hasOwnProperty(sensor)) {

                var coolStuff = {
                    dispatch: dispatch,
                    mac: sensor,
                    watchlist: allSensorData[sensor]["watchlist"]
                };

                if (allSensorData[sensor]["flapping"]) {
                    var row = {
                        "building": allSensorData[sensor]["building"],
                        "sensor-level-id": allSensorData[sensor]["sensor-location-level"] + allSensorData[sensor]["sensor-location-id"],
                        "sensor_status": allSensorData[sensor]["sensor_status"],
                        "flapping": allSensorData[sensor]["flapping"],
                        "network_router": allSensorData[sensor]["network_router"],
                        "pin" : coolStuff
                    };

                    if (allSensorData[sensor]["flapping"] != "false") {
                        dataList.push(row);
                    }
                }
            }
        }

        return (
            <div>
                <Griddle results={dataList}
                        columnMetadata={tableMetaData}
                        tableClassName="table" columns={["building", "sensor-level-id", "sensor_status", "flapping", "network_router", "pin"]}/>
            </div>
        );
    }

};

module.exports = connect()(Abnormal);
