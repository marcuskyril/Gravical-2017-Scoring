var React = require('react');
var SensorStatus = require('SensorStatus');
var axios = require('axios');
var Griddle = require('griddle-react');
var retrieveSensorDetails = require('retrieveSensorDetails');
var ReactDOM = require('react-dom');

var dataList = [];

class LinkComponent extends React.Component{
  constructor(props) {
    super(props);
  }

  handleClick(event, macAddress) {
    event.stopPropagation();
    console.log("click", macAddress);

    var interval = null;

    $('#offCanvas').on('opened.zf.offcanvas', function() {

      console.log("OPEN!!!!");

      interval = setInterval(function () {
        retrieveSensorDetails.retrieveSensorDetails(macAddress).then(function(response){
          console.log(response);
        }, function(error) {
          console.log(error);
        });
      }, 10000);

    });

    $('#offCanvas').on('closed.zf.offcanvas', function() {

      console.log("CLOSE!!!!");

      if(interval != null){
        clearInterval(interval);
      }
    });

    // call API at intervals with mac address as param and render directly to id (React-DOM.render....)
  }

  render() {
    return (
        <a onClick={this.handleClick(event, this.props.data)} data-toggle="offCanvas">{this.props.data}</a>
    );
  }
};

const tableMetaData =  [
  {
    "columnName": "mac_address",
    "order": 1,
    "locked": false,
    "visible": true,
    "displayName": "Mac Address",
    "customComponent": LinkComponent
  },
  {
    "columnName": "geo-region",
    "order": 2,
    "locked": false,
    "visible": true,
    "displayName": "Region"
  },
  {
    "columnName": "building",
    "order": 3,
    "locked": true,
    "visible": true,
    "displayName": "Building"
  },
  {
    "columnName": "sensor-level-id",
    "order": 4,
    "locked": true,
    "visible": true,
    "displayName": "ID"
  },
  {
    "columnName": "sensor_status",
    "order": 4,
    "locked": true,
    "visible": true,
    "displayName": "Health"
  }
];

class NoDataComponent extends React.Component{
    constructor(props) {
      super(props);
    }

    render(){
      return (
        <div>
          <h1>No data is available</h1>
        </div>
      );
    }
};

class GeneralMetrics extends React.Component{

    constructor(props) {
      super(props);
      this.state = {
        dataList: []
      };
    }

    render() {

        var allSensorData = this.props.data;
        var dataList = [];
        for (var sensor in allSensorData) {
            if (allSensorData.hasOwnProperty(sensor)) {
                var mac = sensor;

                var row = {
                    "mac_address" : mac,
                    "geo-region" : allSensorData[sensor]["geo-region"],
                    "building" : allSensorData[sensor]["building"],
                    "sensor-level-id" : allSensorData[sensor]["sensor-location-level"] + allSensorData[sensor]["sensor-location-id"],
                    "sensor_status" : allSensorData[sensor]["sensor_status"]
                };

                if (typeof allSensorData[sensor]["error"] !== "undefined") {
                    row["sensor_status"] = "-";
                }

                dataList.push(row);
            }
        }

        return (
            <div>
                <Griddle
                  results={dataList}
                  showFilter={true}
                  initialSort="building_name"
                  tableClassName="piOverviewTable"
                  columnMetadata={tableMetaData}/>
            </div>
        );
    }
}

module.exports = GeneralMetrics;
