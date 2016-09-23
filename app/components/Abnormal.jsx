var React = require('react');
var Griddle = require('griddle-react');

class LinkComponent3 extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick(data) {
        console.log("click", data);
    }

    render() {
        return (
            <a onClick={this.handleClick(this.props.data)} data-toggle="offCanvas">{this.props.data}</a>
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
        "order": 3,
        "locked": false,
        "visible": true,
        "sortable": true,
        "displayName": "Sensor Status"
    }, {
        "columnName": "flapping",
        "order": 4,
        "locked": false,
        "visible": true,
        "sortable": true,
        "displayName": "Flapping"
    }, {
        "columnName": "network_router",
        "order": 5,
        "locked": false,
        "visible": true,
        "sortable": true,
        "displayName": "Network Router"
    }, {
        "columnName": "pin",
        "order": 6,
        "locked": false,
        "visible": true,
        "sortable": true,
        "displayName": "Pin",
        "customComponent": PinComponent
    }
];

class PinComponent extends React.Component {

    handleClick(macAddress) {

      // $('#unpinMac').val(macAddress);
      // $('#unpin-sensor-modal').foundation('open');

    }

    render() {
      return (
        <a onClick={() => this.handleClick(this.props.data)} >
            <div id="pin-btn" className="sensorBlock pin">Pin</div>
        </a>
      );

    }
};

class Abnormal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var allSensorData = this.props.data;
        var dataList = [];

        for (var sensor in allSensorData) {
            if (allSensorData.hasOwnProperty(sensor)) {
                var mac = sensor;
                if (allSensorData[sensor]["flapping"]) {
                    var row = {
                        "building": allSensorData[sensor]["building"],
                        "sensor-level-id": allSensorData[sensor]["sensor-location-level"] + allSensorData[sensor]["sensor-location-id"],
                        "sensor_status": allSensorData[sensor]["sensor_status"],
                        "flapping": allSensorData[sensor]["flapping"],
                        "network_router": allSensorData[sensor]["network_router"],
                        "pin" : mac
                    };

                    if (allSensorData[sensor]["flapping"] != "false") {
                        dataList.push(row);
                    }
                }
            }
        }

        return (
            <div>
                <Griddle results={dataList} columnMetadata={tableMetaData} tableClassName="table" columns={["building", "sensor-level-id", "sensor_status", "flapping", "network_router", "pin"]}/>
            </div>
        );
    }

};

module.exports = Abnormal;
