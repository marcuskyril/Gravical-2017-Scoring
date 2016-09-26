var React = require('react');
var ServerList = require('ServerList');
var FontAwesome = require('react-fontawesome');
var VerticalMenu = require('VerticalMenu');
var deleteModal = null;
var editModal = null;
var rebootModal = null;
var terminal = null;
var {Link, IndexLink} = require('react-router');
import {connect} from 'react-redux';
const HOST = 'http://opsdev.sence.io:4201/';

var colorMap = {
  "ok" : "sensorBlockSquare green sensorList",
  "warning" : "sensorBlockSquare yellow sensorList",
  "danger" : "sensorBlockSquare orange sensorList",
  "down" : "sensorBlockSquare red sensorList",
  "no data" : "sensorBlockSquare grey sensorList"
}

var dataList = [];

class Building extends React.Component {
    render() {

        var uptimeLink = `/uptime/${this.props.buildingName}`;

        return (
            <div className="column row">
                <div className="header">{this.props.buildingName} | Total count: {this.props.sensorCount}</div>
                <IndexLink activeClassName='active' to={uptimeLink}>View historical data &raquo;</IndexLink>
                <table className="sensorHealthTable">
                    <BuildingHeader areaArray={this.props.areaNames}/>
                    <LevelList areaArray={this.props.areaNames} levelArray={this.props.levelNames} sensors={this.props.sensors}/>
                </table>
            </div>
        );
    }
}

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
    }

    handleChange() {

        this.props.onUserInput(this.refs.filterTextInput.value);
    }
    render() {

        return (
            <form id="buildingFilter">
                <input type="text" style={{
                    width: "50%"
                }} placeholder="Filter Results" value={this.props.filterText} ref="filterTextInput" onChange={this.handleChange.bind(this)}/>
            </form>
        );
    }
}

class BuildingList extends React.Component {
    render() {

        var rows = [];
        var allBuildings = [];

        var buildings = this.props.data;

        for (var property in buildings) {
            if (buildings.hasOwnProperty(property)) {
                var buildingName = property;

                // console.log("buildings[property]", buildings[property]);
                // console.log("areaNames", buildings[property]["area_names"]);

                var temp = {
                    buildingName: buildingName,
                    areaNames: buildings[property]["area_names"],
                    levelNames: buildings[property]["level_names"],
                    sensors: buildings[property]["sensors"],
                    sensorCount: buildings[property]["sensor_count"]
                }

                allBuildings.push(temp);
            }
        }

        allBuildings.forEach(function(building) {
            var buildingName = building.buildingName;
            var areaNames = building.areaNames;
            var levelNames = building.levelNames;
            var sensors = building.sensors;
            var sensorCount = building.sensorCount;
            if ((buildingName.toLowerCase()).indexOf((this.props.filterText.toLowerCase())) === -1) {
                return <div></div>
            }

            rows.push(<Building key={buildingName} buildingName={buildingName} areaNames={areaNames} levelNames={levelNames} sensors={sensors} sensorCount={sensorCount}/>);
        }.bind(this));

        return (
            <div>
                {rows}
            </div>
        );
    }
}

class BuildingHeader extends React.Component {

    render() {

        return (
            <thead>
              <tr>
                <th style={{
                    textAlign: "center",
                    width: '20%'
                }}>Level</th>
                <th></th>
              </tr>
            </thead>
        );
    }
}

class LevelList extends React.Component {

    constructor(props) {
      super(props);
    }

    render() {

        var that = this;
        var level;
        var port;

        var tableRows = [];
        var areaArray = this.props.areaArray;
        var levelArray = this.props.levelArray;
        var sensors = this.props.sensors;

        for (var i = 0; i < levelArray.length; i++) {
            var sensorsOnThisFloor = sensors[levelArray[i]];
            var temp = [];
            var superTemp = [];

            for (var j = 0; j < sensorsOnThisFloor.length; j++) {
              // console.log("sensorsOnThisFloor", sensorsOnThisFloor[j]);
              var sensorId = sensorsOnThisFloor[j]['id'];
              var status = sensorsOnThisFloor[j]['status'];
              var macAdd = sensorsOnThisFloor[j]['mac'];
              var region = sensorsOnThisFloor[j]['region'];
              var building = sensorsOnThisFloor[j]['building'];
              var level = sensorsOnThisFloor[j]['level'];
              var port = sensorsOnThisFloor[j]['port'];
              var reboot = sensorsOnThisFloor[j]['reboot_available'];
              var watchlist = sensorsOnThisFloor[j]['watchlist'];
              //console.log("macAdd", macAdd);

              // console.log("areaArray", areaArray);

              var thePos = areaArray.indexOf(sensorId);
              superTemp[thePos] = [macAdd, status, sensorId, region, building, level, port, reboot, watchlist];
            }

            superTemp.forEach(function(sensorData) {

              var macAdd = sensorData[0];
              var status = sensorData[1];
              var id = sensorData[2];
              var region = sensorData[3];
              var building = sensorData[4];
              level = sensorData[5];
              port = sensorData[6];
              var reboot = sensorData[7];
              var watchlist = sensorData[8];

              temp.push(<VerticalMenu key={macAdd} macAdd={macAdd} sensorData={sensorData} class={colorMap[status]} id={id} reboot={reboot} watchlist={watchlist}/>);

          });

          tableRows.push(
              <tr>
                <th>
                    {level.length === 1 ? `0${level}` : level}
                </th>
                <td>
                  <ul style={{margin:'0px'}}>
                    {temp}
                  </ul>
                </td>
              </tr>
          );
        }

        return (
          <tbody>
               {tableRows}
          </tbody>
        );
    }
}

class SensorHealthOverview extends React.Component {

constructor(props) {
    super(props);
    this.state = {
        filterText: this.props.filter
    };
}

componentDidMount() {
  if(this.state.filterText === undefined) {
    this.setState({
      filterText: ''
    });
  }
}

handleUserInput(filterText) {
    this.setState({filterText: filterText});
}

launchTerminal() {
    document.getElementById('terminalIFrame').src = HOST;
    $('#terminal').foundation('open');
}

render() {
    // console.log("Cool stuff from serverOverview", this.props.serverData);

    return (
        <div>
            <SearchBar filterText={this.state.filterText}
                        onUserInput={this.handleUserInput.bind(this)}/>

            <div className="page-title">Sensors</div>
            <hr className="divider"/>

            <BuildingList data={this.props.data}
                            filterText={this.state.filterText}/>

            <div className="page-title">Servers</div>
            <hr className="divider"/>

            <ServerList data={this.props.serverData}/>

        </div>
    );
  }
}

module.exports = connect()(SensorHealthOverview);
