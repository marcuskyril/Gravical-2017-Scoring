var React = require('react');
var axios = require('axios');
var Griddle = require('griddle-react');
var retrieveSensorDetails = require('retrieveSensorDetails');
var removeFromWatchlist = require('removeFromWatchlist');
var unpinModal = null;
var ReactDOM = require('react-dom');

var dataList = [];

class RemoveComponent extends React.Component {

    handleClick(macAddress) {

      $('#unpinMac').val(macAddress);

      unpinModal.open();
    }

    render() {
      return (
        <a onClick={() => this.handleClick(this.props.data)} >
            <div id="unpin-btn" className="sensorBlock remove">Un-Pin</div>
        </a>
      );

    }
};

class SensorBlockComponent extends React.Component {

    render() {
        // url ="speakers/" + this.props.rowData.state + "/" + this.props.data;

        var colorMap = {
          "ok" : "sensorBlock green",
          "warning" : "sensorBlock orange",
          "danger" : "sensorBlock red",
          "down" : "sensorBlock black",
          "noData" : "sensorBlock grey",
        }

        return (
            <div className={colorMap[this.props.data]}>{this.props.data}</div>
        );
    }
};

class LinkComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick(macAddress) {
        // console.log("event", macAddress);
        document.getElementById("sensorDetailsIFrame").src = "./offCrepe.html?offCanMac=" + macAddress;
    }

    render() {

      var macAddress = this.props.data;

        return (
            <a onClick={() => this.handleClick(macAddress)} data-toggle="offCanvas">{macAddress}</a>
        );
    }
};



const tableMetaData = [
    {
        "columnName": "mac_address",
        "order": 1,
        "locked": false,
        "visible": true,
        "displayName": "Mac Address",
        "customComponent": LinkComponent
    }, {
        "columnName": "geo-region",
        "order": 2,
        "locked": false,
        "visible": false,
        "displayName": "Region"
    }, {
        "columnName": "building",
        "order": 3,
        "locked": true,
        "visible": true,
        "displayName": "Building"
    }, {
        "columnName": "sensor-level-id",
        "order": 4,
        "locked": true,
        "visible": true,
        "displayName": "ID"
    }, {
        "columnName": "sensor_status",
        "order": 4,
        "locked": true,
        "visible": true,
        "displayName": "Health",
        "customComponent": SensorBlockComponent
    },{
        "columnName": "remove",
        "order": 5,
        "locked": true,
        "visible": true,
        "displayName": "Un-pin?",
        "customComponent": RemoveComponent
    }

];

const rowMetaData = {
  "bodyCssClassName": "customTableRow"
}

class WatchList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataList: []
        };
    }

    componentDidMount() {
        unpinModal = new Foundation.Reveal($('#unpin-sensor-modal'));
    }

    tableClickHandler(gridRow) {
        console.log("test test test", gridRow);
        console.log("adfdafa", event);
        var macAddress = gridRow.props.data.mac_address

        if($('#unpin-sensor-modal').css('display') === 'none') {
            $('#offCanvas').foundation('open', event);
            document.getElementById("sensorDetailsIFrame").src = "./offCrepe.html?offCanMac=" + macAddress;
        }
    }

    render() {

        var allSensorData = this.props.data;
        var dataList = [];
        for (var sensor in allSensorData) {
            if (allSensorData.hasOwnProperty(sensor)) {
              if(allSensorData[sensor]["watchlist"]){
                var mac = sensor;
                var row = {
                    "mac_address": mac,
                    // "geo-region": allSensorData[sensor]["geo-region"],
                    "building": allSensorData[sensor]["building"],
                    "sensor-level-id": allSensorData[sensor]["sensor-location-level"] + allSensorData[sensor]["sensor-location-id"],
                    "sensor_status": allSensorData[sensor]["sensor_status"],
                    "remove" : mac
                };

                if (typeof allSensorData[sensor]["error"] !== "undefined") {
                    row["sensor_status"] = "-";
                }

                dataList.push(row);
              }
            }
        }

        return (
            <div>
                <Griddle results={dataList}
                          showFilter={true}
                          initialSort="building_name"
                          tableClassName="piOverviewTable"
                          columnMetadata={tableMetaData}
                          onRowClick={this.tableClickHandler.bind(this)}
                          rowMetaData={rowMetaData}/>
            </div>
        );
    }
}

module.exports = WatchList;
