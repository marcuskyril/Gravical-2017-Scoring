var React = require('react');
var Griddle = require('griddle-react');
var axios = require('axios');
var FontAwesome = require('react-fontawesome');

const tableMetaData =  [
  {
    "columnName": "mac_address",
    "order": 1,
    "locked": false,
    "visible": true,
    "displayName": "Mac Address"
  },
  {
    "columnName": "latest_timestamp",
    "order": 2,
    "locked": false,
    "visible": true,
    "displayName": "Latest Timestamp"
  },
  {
    "columnName": "location",
    "order": 3,
    "locked": false,
    "visible": true,
    "displayName": "Location"
  },
  {
    "columnName": "sensor_type",
    "order": 4,
    "locked": false,
    "visible": true,
    "displayName": "Sensor Type"
  },
  {
    "columnName": "current_status",
    "order": 5,
    "locked": false,
    "visible": true,
    "displayName": "Current Status"
  },
  {
    "columnName": "sensor_status",
    "order":  6,
    "locked": false,
    "visible": true,
    "sortable": true,
    "displayName": "Sensor Status"
  },
  {
    "columnName": "flapping",
    "order":  7,
    "locked": false,
    "visible": true,
    "sortable": true,
    "displayName": "Flapping"
  },
  {
    "columnName": "network_router",
    "order":  8,
    "locked": false,
    "visible": true,
    "sortable": true,
    "displayName": "Network Router"
  },
  {
    "columnName": "temperature",
    "order":  9,
    "locked": false,
    "visible": true,
    "sortable": true,
    "displayName": "Temperature"
  },
  {
    "columnName": "CPU_usage",
    "order":  10,
    "locked": false,
    "visible": true,
    "sortable": true,
    "displayName": "CPU Usage"
  },
  {
    "columnName": "RAM_total",
    "order":  11,
    "locked": false,
    "visible": true,
    "sortable": true,
    "displayName": "Total RAM"
  },
  {
    "columnName": "RAM_free",
    "order":  12,
    "locked": false,
    "visible": true,
    "sortable": true,
    "displayName": "RAM Free"
  },
  {
    "columnName": "RAM_used",
    "order":  13,
    "locked": false,
    "visible": true,
    "sortable": true,
    "displayName": "RAM used"
  },
  {
    "columnName": "RAM_available",
    "order":  14,
    "locked": false,
    "visible": true,
    "sortable": true,
    "displayName": "RAM Available"
  },
  {
    "columnName": "disk_space_total",
    "order":  15,
    "locked": false,
    "visible": true,
    "sortable": true,
    "displayName": "Total Disk Space"
  },
  {
    "columnName": "disk_space_free",
    "order":  16,
    "locked": false,
    "visible": true,
    "sortable": true,
    "displayName": "Disk Space Available"
  },
  {
    "columnName": "disk_space_used",
    "order":  17,
    "locked": false,
    "visible": true,
    "sortable": true,
    "displayName": "Disk Space Used"
  }
];

var dataList = [];

class Tableaux extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        dataList: [],
        colsSelected: ["mac_address", "sensor_status"]
    };
  }

  componentDidMount() {
    // var baseUrl = 'http://52.74.119.147/PisaSchitt/websocket-functions/0-sample-generators/sensor-data-generator.php?number=';
    // var url = baseUrl + 30;
    // axios.get(url).then(function(res) {
    //
    //     var temp = res.data;
    //
    //     for(var k in temp) {
    //       //  console.log(k, temp[k]);
    //        dataList.push(temp[k]);
    //     }
    //
    //     this.setState({
    //       dataList: dataList
    //     });
    //
    //     // console.log("axios data result 2", dataList['sensor1']);
    //
    // }.bind(this), function (e) {
    //
    //   console.log("Error occurred: " +e);
    //
    // }.bind(this));
  }

  render() {

    var self = this;

    console.log("Tableaux now has: ", this.props.data);


    console.log("cols selected: ", this.state);

    // self.setState({
    //     colsSelected: data
    // });

    var allSensorData = this.props.data;

    var dataList = [];

    for (var sensor in allSensorData) {
        if (allSensorData.hasOwnProperty(sensor)) {
            var mac = sensor;


            var row = {
                "mac_address" : mac,
                "latest_timestamp" : allSensorData[sensor]["latest_timestamp"],
                "location" : allSensorData[sensor]["location"],
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

    return (
        <Griddle
            results={dataList}
            settingsIconComponent={<FontAwesome name='cog' style={{color: '#232f32'}} size="2x" className="margin-left-small"/>}
            columnMetadata={tableMetaData}
            tableClassName="table"
            showFilter={true}
            columns={this.state.colsSelected}
            showSettings={true}
            settingsText=""
        />
    );
  }
}

module.exports = Tableaux;
