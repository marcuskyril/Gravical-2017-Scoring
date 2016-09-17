var React = require('react');
var ServerList = require('ServerList');
var FontAwesome = require('react-fontawesome');
var DeleteSensor = require('DeleteSensor');
var deleteModal = null;
var editModal = null;
var rebootModal = null;
var terminal = null;

var colorMap = {
  "ok" : "sensorBlockSquare green sensorList",
  "warning" : "sensorBlockSquare orange sensorList",
  "danger" : "sensorBlockSquare red sensorList",
  "down" : "sensorBlockSquare black sensorList",
  "no data" : "sensorBlockSquare grey sensorList"
}

var dataList = [];

class Building extends React.Component {
    render() {

        return (
            <div className="column row">
                <div className="header">{this.props.buildingName} | Total count: {this.props.sensorCount}</div>
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

class BuildingListV2 extends React.Component {
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

        var tableRows = [];

        // console.log("whhhhhy", this.props.areaArray);

        var areaArray = this.props.areaArray;
        var levelArray = this.props.levelArray;
        var sensors = this.props.sensors;

        for (var i = 0; i < levelArray.length; i++) {
            var sensorsOnThisFloor = sensors[levelArray[i]];
            var temp = [];
            var superTemp = [];

            for (var j = 0; j < sensorsOnThisFloor.length; j++) {
              ////console.log("sensorsOnThisFloor", sensorsOnThisFloor[j]);
              var sensorId = sensorsOnThisFloor[j]['id'];
              var status = sensorsOnThisFloor[j]['status'];
              var macAdd = sensorsOnThisFloor[j]['mac'];
              var region = sensorsOnThisFloor[j]['region'];
              var building = sensorsOnThisFloor[j]['building'];
              var level = sensorsOnThisFloor[j]['level'];
              //console.log("macAdd", macAdd);

              // console.log("areaArray", areaArray);

              var thePos = areaArray.indexOf(sensorId);
              superTemp[thePos] = [macAdd, status, sensorId, region, building, level];
              //console.log("thePos" + thePos + ", sensor: " + superTemp[thePos]);
            }

            superTemp.forEach(function(sensorData) {

              var macAdd = sensorData[0];
              var status = sensorData[1];
              var id = sensorData[2];
              var region = sensorData[3];
              var building = sensorData[4];
              level = sensorData[5];

              temp.push(<VerticalMenu key={macAdd} macAdd={macAdd} sensorData={sensorData} class={colorMap[status]} id={id}/>);

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
        filterText: ''
    };
}

componentDidMount() {
    editModal = new Foundation.Reveal($('#edit-sensor-modal'));
    deleteModal = new Foundation.Reveal($('#delete-sensor-modal'));
    rebootModal = new Foundation.Reveal($('#reboot-sensor-modal'));
    terminal = new Foundation.Reveal($('#terminal'));
}

handleUserInput(filterText) {
    this.setState({filterText: filterText});
}

launchTerminal() {
    terminal.open();
}

render() {
    // console.log("Cool stuff from serverOverview", this.props.serverData);

    return (
        <div>

            <button onClick={this.launchTerminal.bind(this)} className="test button">
              <FontAwesome name='rocket'style={{marginRight: '5px'}}/> Launch Terminal
            </button>

            <SearchBar filterText={this.state.filterText} onUserInput={this.handleUserInput.bind(this)}/>
            <BuildingListV2 data={this.props.data} filterText={this.state.filterText}/>

            <div className="header">Servers</div>

            <ServerList data={this.props.serverData}/>

        </div>
    );
  }
}

class VerticalMenu extends React.Component {

    constructor(props) {
      super(props);
    }

    handleClick(sensorData, action) {
        var macAddress = sensorData[0];
        var region = sensorData[3];
        var level = sensorData[5];
        var areaID = sensorData[2];
        var buildingName = sensorData[4];

        switch(action){
          case 'EDIT_ACTION':

            $('#inputMac').val(macAddress);
            $('#inputRegion').val(region.toLowerCase());
            $('#inputLocationLevel').val(level);
            $('#inputSensorLocationID').val(areaID);
            $('#inputBuildingName').val(buildingName);

            editModal.open();

            break;
          case 'DELETE_ACTION':

            // $('#deleteMac').val(macAddress);
            document.getElementById('deleteDetails').innerHTML = buildingName +": " +level +areaID;
            document.getElementById('deleteMac').innerHTML = macAddress;

            deleteModal.open();

            break;
          case 'REBOOT_ACTION':

            $('#rebootMac').val(macAddress);
            rebootModal.open();

            break;
          case 'NO_ACTION':
              var dropdowns = document.getElementsByClassName("dropdown-pane");

              var i;

              for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.style.visibility === "visible") {
                  openDropdown.style.visibility = "hidden";
                }
              }

              if (document.getElementById(macAddress).style.visibility === "visible") {
                  document.getElementById(macAddress).style.visibility = "hidden";
              } else {
                  document.getElementById(macAddress).style.visibility = "visible";
              }

              break;
          case 'OPEN_CANVAS_ACTION':
            document.getElementById("sensorDetailsIFrame").src = "./offCrepe.html?offCanMac=" + macAddress;
            break;
          default:
            console.warn('Invalid request.');
            break;
        }

    }
    render() {
       return (

           <li className="sensorList">
             <div className={this.props.class} onClick={() => this.handleClick(this.props.sensorData, 'NO_ACTION')}>{this.props.id}</div>
             <div className="dropdown-pane" id={this.props.macAdd} data-dropdown data-options="data-hover:true; data-close-on-click:true">
                 <ul className="vertical menu tableOptions">
                   <li className="menuHeader">{this.props.macAdd}</li>
                   <li><a onClick={() => this.handleClick(this.props.sensorData, 'OPEN_CANVAS_ACTION')} data-toggle="offCanvas">More details &raquo;</a></li>
                   <li><a onClick={() => this.handleClick(this.props.sensorData, 'EDIT_ACTION')}>Edit sensor</a></li>
                   <li><a onClick={() => this.handleClick(this.props.sensorData, 'DELETE_ACTION')}>Delete sensor</a></li>
                   <li><a onClick={() => this.handleClick(this.props.sensorData, 'REBOOT_ACTION')}>Reboot sensor</a></li>
                 </ul>
               </div>
           </li>
       );
    }
}

module.exports = SensorHealthOverview;
