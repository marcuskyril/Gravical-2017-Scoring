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
        "columnName": "mac_address",
        "order": 1,
        "locked": true,
        "visible": true,
        "displayName": "Mac Address",
        "customCommponent": LinkComponent3
    }, {
        "columnName": "sensor_status",
        "order": 2,
        "locked": false,
        "visible": true,
        "sortable": true,
        "displayName": "Sensor Status"
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
    }
];

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
                        "mac_address": mac,
                        "sensor_status": allSensorData[sensor]["sensor_status"],
                        "flapping": allSensorData[sensor]["flapping"],
                        "network_router": allSensorData[sensor]["network_router"]
                    };

                    dataList.push(row);
                }
            }
        }

        return (
            <div>
                <Griddle results={dataList} columnMetadata={tableMetaData} tableClassName="table" columns={["mac_address", "sensor_status", "flapping", "network_router"]}/>
            </div>
        );
    }

};

module.exports = Abnormal;
