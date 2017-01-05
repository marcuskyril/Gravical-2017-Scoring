var React = require('react');
var Griddle = require('griddle-react');
var axios = require('axios');
var FontAwesome = require('react-fontawesome');

var dataList = [];

class LinkComponent2 extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <a href="google.com" data-toggle="offCanvas">{this.props.data}</a>
    );
  }
};

const tableMetaData =  [
  {
    "columnName": "mac_address",
    "order": 1,
    "locked": true,
    "visible": true,
    "displayName": "Rank",
    "sortable": true
  },
  {
    "columnName": "latest_timestamp",
    "order": 2,
    "locked": false,
    "visible": true,
    "sortable": true,
    "displayName": "ID"
  },
  {
    "columnName": "sensor_status",
    "order":  3,
    "locked": false,
    "visible": true,
    "sortable": true,
    "displayName": "Name"
  },
  {
    "columnName": "network_router",
    "order":  4,
    "locked": false,
    "visible": true,
    "sortable": true,
    "displayName": "Score"
  }
];

const columnDisplayName = {
    "Rank" : "mac_address",
    "ID" : "latest_timestamp",
    "Name" : "sensor_status",
    "Score" : "network_router"
};

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        dataList: []
    };
  }

  render() {

    var that = this;

    var currentlySelected = ["mac_address", "latest_timestamp", "sensor_status", "network_router"];
    var findStuff = $('#bfg').find('table > thead > tr > th > span');
    // console.log(findStuff);
    if (findStuff.length > 0) {
        currentlySelected = [];
        for (var i = 0; i < findStuff.length; i++) {
            currentlySelected.push(columnDisplayName[findStuff[i].innerHTML]);
        }
    }
    // that.state.colsSelected = currentlySelected;

    var allSensorData = this.props.data;
    var dataList = [];
    for (var sensor in allSensorData) {
        if (allSensorData.hasOwnProperty(sensor)) {
            var mac = sensor;
            var row = {};

            if (typeof allSensorData[sensor]["error"] == "undefined") {
                row = {
                    "mac_address" : mac,
                    "latest_timestamp" : allSensorData[sensor]["latest_timestamp"],
                    "building" : allSensorData[sensor]["building"],
                    "sensor-level-id" : allSensorData[sensor]["sensor-location-level"] + allSensorData[sensor]["sensor-location-id"],
                    "sensor_type" : allSensorData[sensor]["sensor_type"],
                    "current_status" : allSensorData[sensor]["current_status"],
                    "sensor_status" : allSensorData[sensor]["sensor_status"],
                    "flapping" : allSensorData[sensor]["flapping"],
                    "network_router" : allSensorData[sensor]["network_router"],
                    "temperature" : allSensorData[sensor]["temperature"],
                    "CPU_usage" : allSensorData[sensor]["CPU_Usage"],
                    "RAM_total" : allSensorData[sensor]["RAM_total"],
                    "RAM_free" : allSensorData[sensor]["RAM_free"],
                    "RAM_used" : allSensorData[sensor]["RAM_used"],
                    "RAM_available" : allSensorData[sensor]["RAM_available"],
                    "disk_space_total" : allSensorData[sensor]["Disk_Space_total"],
                    "disk_space_free" : allSensorData[sensor]["Disk_Space_used"],
                    "disk_space_used" : allSensorData[sensor]["Disk_Space_free"]
                };
            } else {
                row = {
                    "mac_address" : mac,
                    "latest_timestamp" : "no data",
                    "building" : allSensorData[sensor]["building"],
                    "sensor-level-id" : allSensorData[sensor]["sensor-location-level"] + allSensorData[sensor]["sensor-location-id"],
                    "sensor_type" : allSensorData[sensor]["sensor_type"],
                    "current_status" : "-",
                    "sensor_status" : "-",
                    "flapping" : "-",
                    "network_router" : "-",
                    "temperature" : "-",
                    "CPU_usage" : "-",
                    "RAM_total" : "-",
                    "RAM_free" : "-",
                    "RAM_used" : "-",
                    "RAM_available" : "-",
                    "disk_space_total" : "-",
                    "disk_space_free" : "-",
                    "disk_space_used" : "-"
                };
            }

            dataList.push(row);
        }
    }

    // console.log("currentlySelected", currentlySelected);

    return (
        <Griddle
            results={dataList}
            settingsIconComponent={<FontAwesome name='cog' style={{color: '#232f32', marginLeft: '1rem'}} size="2x"/>}
            columnMetadata={tableMetaData}
            tableClassName="table"
            showFilter={true}
            columns={currentlySelected}
            showSettings={false}
            settingsText="Settings"
        />
    );
  }
}

module.exports = Results;
