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

        this.state = {
            data: {}
        }
    }

    componentDidMount() {
        //call API

        var that = this;

        notificationLogAPI.retrieveNotifications(100).then(function(response) {

            // console.log("response.data", response);

            that.setState({data: response});
        })
    }

    handleClick(){
        var that = this;

        notificationLogAPI.retrieveNotifications(100).then(function(response) {
            that.setState({data: response});
        })

        that.forceUpdate();

    }

    render() {
        console.log("eres mi amigo?", this.state.data);
        var notificationData = this.state.data;
        var dataList = [];

        for (var i = 0; i < notificationData.length; i++) {
            var logEntry = notificationData[i];

            var diagnosis = logEntry['problem']['diagnosis'];

            //console.log("diagnosis", typeof diagnosis);
            if (typeof diagnosis == "object") {
                diagnosis = $.map(diagnosis, function(value, index) {
                    return [value];
                });
                diagnosis = diagnosis.join(", ");
            }  else {
                diagnosis = " - ";
            }

            var row = {
                "mac_address": logEntry["mac"],
                "building": logEntry["building"],
                "sensor-level-id": logEntry["level"] + logEntry["id"],
                "sensor_status": logEntry['problem']['status'],
                "diagnosis": diagnosis,
                "timestamp": logEntry["timestamp"]["date"]
            };

            dataList.push(row);

        }

        var that = this;

        return (
            <div>
                <div className="notificationWrapper" style={{paddingTop: '2rem', paddingBottom: '2rem'}}>
                    <div className="callout callout-dark-header">
                        <div className="header">Your Notifications</div>
                        <button className="icon-btn-text-small" onClick={() => that.handleClick()}>REFRESH</button>
                    </div>
                    <div className="callout-dark">
                        <Griddle results={dataList} resultsPerPage={100} columnMetadata={tableMetaData} tableClassName="table" columns={[
                            "mac_address",
                            "building",
                            "sensor-level-id",
                            "sensor_status",
                            "diagnosis",
                            "timestamp"
                        ]}/>
                    </div>
                </div>
            </div>

        );
    }

};

module.exports = NotificationLog;
