var React = require('react');
var Griddle = require('griddle-react');
var retrieveSensorDetails = require('retrieveSensorDetails');
var ReactDOM = require('react-dom');
import * as Redux from 'react-redux';
import * as actions from 'actions';
import {connect} from 'react-redux';

var dataList = [];

class SensorBlockComponent extends React.Component {

    render() {

        var colorMap = {
          "ok" : "sensorBlock green",
          "warning" : "sensorBlock yellow",
          "danger" : "sensorBlock orange",
          "down" : "sensorBlock red",
          "-" : "sensorBlock grey",
          "paused" : "sensorBlock black"
        }

        return (
            <div className={colorMap[this.props.data]}>{this.props.data}</div>
        );
    }
};

class RemoveComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    handleClick(macAddress) {
        var dispatch = this.props.data.dispatch;
        dispatch(actions.startUpdateWatchList(macAddress));
        $('#unpin-sensor-modal').foundation('open');
    }

    render() {
      return (
        <div id="unpin-btn" className="sensorBlock remove" onClick={() => this.handleClick(this.props.data.mac)}>Un-Pin</div>
      );

    }
};

class LinkComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick(macAddress) {
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
        "displayName": "Sensor Status",
        "customComponent": SensorBlockComponent
    },{
        "columnName": "remove",
        "order": 5,
        "locked": true,
        "visible": true,
        "sortable": false,
        "displayName": "Actions",
        "customComponent": RemoveComponent
    }

];

const rowMetaData = {
  "bodyCssClassName": "customTableRow"
}

class WatchList extends React.Component {

    constructor(props) {
        super(props);
    }

    tableClickHandler(gridRow) {

        var macAddress = gridRow.props.data.mac_address;
        console.log("macAddress", macAddress);

        if($('#unpin-sensor-modal').css('display') === 'none') {
            $('#offCanvas').foundation('open', event);

            var tobascoSauce = document.createEvent("Event");

            tobascoSauce.data = {
                macAdd: macAddress
            };

            tobascoSauce.initEvent("tobascoSauce", true, true);
            document.dispatchEvent(tobascoSauce);
        }
    }

    render() {
        var allSensorData = this.props.data;
        var dataList = [];
        var {dispatch} = this.props;

        for (var sensor in allSensorData) {
            if (allSensorData.hasOwnProperty(sensor)) {

                var coolStuff = {
                    dispatch: dispatch,
                    mac: sensor
                };

                if(allSensorData[sensor]["watchlist"]){
                    var row = {
                        "mac_address": sensor,
                        "building": allSensorData[sensor]["building"],
                        "sensor-level-id": allSensorData[sensor]["sensor-location-level"] + allSensorData[sensor]["sensor-location-id"],
                        "sensor_status": allSensorData[sensor]["sensor_status"],
                        "remove" : coolStuff
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
                          columns={["mac_address", "building", "sensor-level-id", "sensor_status", "remove"]}
                          columnMetadata={tableMetaData}
                          onRowClick={this.tableClickHandler.bind(this)}
                          rowMetaData={rowMetaData}/>
            </div>
        );
    }
}

module.exports = connect()(WatchList);
