var React = require('react');
var Griddle = require('griddle-react');
var axios = require('axios');
var notificationLogAPI = require('notificationLogAPI');

const tableMetaData = [
    {
        "columnName": "mac_address",
        "order": 1,
        "locked": true,
        "visible": true,
        "displayName": "Mac Address"
    }, {
        "columnName": "building",
        "order": 2,
        "locked": false,
        "visible": true,
        "sortable": true,
        "displayName": "Building"
    }, {
        "columnName": "sensor-level-id",
        "order": 3,
        "locked": false,
        "visible": true,
        "sortable": true,
        "displayName": "ID"
    }, {
        "columnName": "sensor_status",
        "order": 4,
        "locked": false,
        "visible": true,
        "sortable": true,
        "displayName": "Status"
    }, {
        "columnName": "diagnosis",
        "order": 5,
        "locked": false,
        "visible": true,
        "sortable": true,
        "displayName": "Diagnosis"
    }, {
        "columnName": "timestamp",
        "order": 6,
        "locked": false,
        "visible": true,
        "sortable": true,
        "displayName": "Timestamp"
    }
];

class NotificationLog extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        //call API
        notificationLogAPI.retrieveNotifications(100).then(function () {
            this.setState({
                data: response.data
            });
        })
    }

    render() {
        var notificationData = this.props.data;
        var dataList = [];

        for (var logEntry in notificationData) {

            var row = {
                "mac_address": logEntry["mac"],
                "building": logEntry["building"],
                "sensor-level-id": logEntry["level"] + logEntry["id"],
                "sensor_status": logEntry["problem"]["status"],
                "diagnosis" : logEntry["problem"]["diagnosis"].join(", "),
                "timestamp" : logEntry["timestamp"]["date"]
            };

            dataList.push(row);
        }

        return (
            <div>
                <Griddle results={dataList} columnMetadata={tableMetaData} tableClassName="table" columns={["mac_address", "building", "sensor-level-id", "sensor_status", "diagnosis", "timestamp"]}/>
            </div>
        );
    }

};

module.exports = NotificationLog;
