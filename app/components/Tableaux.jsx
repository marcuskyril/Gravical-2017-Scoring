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
    "displayName": "Mac Address",
    "customCommponent": LinkComponent2
  },
  {
    "columnName": "latest_timestamp",
    "order": 2,
    "locked": false,
    "visible": true,
    "displayName": "Latest Timestamp"
  },
  {
    "columnName": "building",
    "order": 3,
    "locked": false,
    "visible": true,
    "displayName": "Building"
  },
  {
    "columnName": "sensor-level-id",
    "order": 4,
    "locked": false,
    "visible": true,
    "displayName": "Location ID"
  },
  {
    "columnName": "sensor_type",
    "order": 5,
    "locked": false,
    "visible": true,
    "displayName": "Sensor Type"
  },
  {
    "columnName": "current_status",
    "order": 6,
    "locked": false,
    "visible": true,
    "displayName": "Current Status"
  },
  {
    "columnName": "sensor_status",
    "order":  7,
    "locked": false,
    "visible": true,
    "sortable": true,
    "displayName": "Sensor Status"
  },
  {
    "columnName": "flapping",
    "order":  8,
    "locked": false,
    "visible": true,
    "sortable": true,
    "displayName": "Flapping"
  },
  {
    "columnName": "network_router",
    "order":  9,
    "locked": false,
    "visible": true,
    "sortable": true,
    "displayName": "Network Router"
  },
  {
    "columnName": "temperature",
    "order":  10,
    "locked": false,
    "visible": true,
    "sortable": true,
    "displayName": "Temperature"
  },
  {
    "columnName": "CPU_usage",
    "order":  11,
    "locked": false,
    "visible": true,
    "sortable": true,
    "displayName": "CPU Usage"
  },
  {
    "columnName": "RAM_total",
    "order":  12,
    "locked": false,
    "visible": true,
    "sortable": true,
    "displayName": "Total RAM"
  },
  {
    "columnName": "RAM_free",
    "order":  13,
    "locked": false,
    "visible": true,
    "sortable": true,
    "displayName": "RAM Free"
  },
  {
    "columnName": "RAM_used",
    "order":  14,
    "locked": false,
    "visible": true,
    "sortable": true,
    "displayName": "RAM used"
  },
  {
    "columnName": "RAM_available",
    "order":  15,
    "locked": false,
    "visible": true,
    "sortable": true,
    "displayName": "RAM Available"
  },
  {
    "columnName": "disk_space_total",
    "order":  16,
    "locked": false,
    "visible": true,
    "sortable": true,
    "displayName": "Total Disk Space"
  },
  {
    "columnName": "disk_space_free",
    "order":  17,
    "locked": false,
    "visible": true,
    "sortable": true,
    "displayName": "Disk Space Available"
  },
  {
    "columnName": "disk_space_used",
    "order":  18,
    "locked": false,
    "visible": true,
    "sortable": true,
    "displayName": "Disk Space Used"
  }
];

const columnDisplayName = {
    "Mac Address" : "mac_address",
    "Latest Timestamp" : "latest_timestamp",
    "geo-region" : "geo-region",
    "building" : "building",
    "Location ID" : "sensor-level-id",
    "Sensor Type" : "sensor_type",
    "Current Status" : "current_status",
    "Sensor Status" : "sensor_status",
    "Flapping" : "flapping",
    "Network Router" : "network_router",
    "Temperature" : "temperature",
    "CPU Usage" : "CPU_usage",
    "Total RAM" : "RAM_total",
    "RAM Free" : "RAM_free",
    "RAM used" : "RAM_used",
    "RAM Available" : "RAM_available",
    "Total Disk Space" : "disk_space_total",
    "Disk Space Available" : "disk_space_free",
    "Disk Space Used" : "disk_space_used"
};

class Tableaux extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        dataList: []
        // colsSelected: ["mac_address", "sensor_status"]
    };
  }

  render() {

    var that = this;

    var currentlySelected = ["mac_address", "latest_timestamp", "sensor_status"];
    var findStuff = $('#bfg').find('table > thead > tr > th > span');
    console.log(findStuff);
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

            var row = {
                "mac_address" : mac,
                "latest_timestamp" : allSensorData[sensor]["latest_timestamp"],
                "building" : allSensorData[sensor]["building"],
                "sensor-level-id" : allSensorData[sensor]["sensor-location-level"] + allSensorData[sensor]["sensor-location-id"],
                "sensor_type" : allSensorData[sensor]["sensor_type"],
                "current_status" : allSensorData[sensor]["current_status"],
                "sensor_status" : allSensorData[sensor]["sensor_status"],
                "flapping" : allSensorData[sensor]["flapping"] ? "true" : "false",
                "network_router" : allSensorData[sensor]["network_router"],
                "temperature" : allSensorData[sensor]["temperature"],
                "CPU_usage" : allSensorData[sensor]["CPU_Usage"],
                "RAM_total" : allSensorData[sensor]["RAM_total"],
                "RAM_free" : allSensorData[sensor]["RAM_free"],
                "RAM_used" : allSensorData[sensor]["RAM_used"],
                "RAM_available" : allSensorData[sensor]["RAM_available"],
                "disk_space_total" : allSensorData[sensor]["Disk_Space_total"],
                "disk_space_free" : allSensorData[sensor]["Disk_Space_used"],
                "disk_space_used" :allSensorData[sensor]["Disk_Space_free"]
            };

            dataList.push(row);
        }
    }

    console.log("currentlySelected", currentlySelected);

    return (
        <Griddle
            results={dataList}
            settingsIconComponent={<FontAwesome name='cog' style={{color: '#232f32'}} size="2x" className="margin-left-small"/>}
            columnMetadata={tableMetaData}
            tableClassName="table"
            showFilter={true}
            columns={currentlySelected}
            showSettings={true}
            settingsText=""
        />
    );
  }
}

module.exports = Tableaux;
