var React = require('react');
var deleteModal = null;
var editModal = null;

var dataList = [];

class Building extends React.Component {
    render() {

        return (
            <div className="column row">
                <div className="header">{this.props.buildingName}</div>
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

                // console.log("buildingName", buildingName);
                // console.log("areaNames", buildings[property]["area_names"]);

                var temp = {
                    buildingName: buildingName,
                    areaNames: buildings[property]["area_names"],
                    levelNames: buildings[property]["level_names"],
                    sensors: buildings[property]["sensors"]
                }

                allBuildings.push(temp);
            }
        }

        allBuildings.forEach(function(building) {
            var buildingName = building.buildingName;
            var areaNames = building.areaNames;
            var levelNames = building.levelNames;
            var sensors = building.sensors;
            if ((buildingName.toLowerCase()).indexOf((this.props.filterText.toLowerCase())) === -1) {
                return <div></div>
            }
            rows.push(<Building key={buildingName} buildingName={buildingName} areaNames={areaNames} levelNames={levelNames} sensors={sensors}/>);
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
              <th style={{
                  textAlign: "center"
              }}>Level</th>
            <th></th>
            </thead>
        );
    }
}

class LevelList extends React.Component {

    constructor(props) {
      super(props);
    }

    handleClick(sensorShizz, action) {
        var macAddress = sensorShizz[0];
        // console.log("event", macAddress, action);

        switch(action){
          case 'EDIT_ACTION':

            // console.log("sensorShizz", sensorShizz);

            $('#inputMac').val(macAddress);
            $('#inputRegion').val(sensorShizz[3].toLowerCase());
            $('#inputLocationLevel').val(sensorShizz[5]);
            $('#inputSensorLocationID').val(sensorShizz[2]);
            $('#inputBuildingName').val(sensorShizz[4]);

            editModal = new Foundation.Reveal($('#edit-sensor-modal'));
            editModal.open();

            break;
          case 'DELETE_ACTION':

            $('#deleteMac').val(macAddress);

            deleteModal = new Foundation.Reveal($('#delete-sensor-modal'));
            deleteModal.open();

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

        var that = this;

        var tableRows = [];

        var areaArray = this.props.areaArray;
        var levelArray = this.props.levelArray;
        var sensors = this.props.sensors;

        for (var i = 0; i < levelArray.length; i++) {
            var sensorsOnThisFloor = sensors[levelArray[i]];
            var temp = [<th> {
                    levelArray[i]
                } </th>];

          //console.log("current level", levelArray[i]);


          var superTemp = [];
          for (var j = 0; j < areaArray.length; j++) {
            superTemp.push("");
          }

          for (var j = 0; j < sensorsOnThisFloor.length; j++) {
            ////console.log("sensorsOnThisFloor", sensorsOnThisFloor[j]);
            var sensorId = sensorsOnThisFloor[j]['id'];
            var status = sensorsOnThisFloor[j]['status'];
            var macAdd = sensorsOnThisFloor[j]['mac'];
            var region = sensorsOnThisFloor[j]['region'];
            var building = sensorsOnThisFloor[j]['building'];
            var level = sensorsOnThisFloor[j]['level'];
            //console.log("macAdd", macAdd);
            var thePos = areaArray.indexOf(sensorId);
            superTemp[thePos] = [macAdd, status, sensorId, region, building, level];
            //console.log("thePos" + thePos + ", sensor: " + superTemp[thePos]);
          }

          // temp.push(superTemp);
          // console.log("woah", superTemp);

          superTemp.forEach(function(sensorShizz) {

            // console.log("sensorShizz status", sensorShizz);
            var macAdd = sensorShizz[0];
            var status = sensorShizz[1];
            var id = sensorShizz[2];
            var region = sensorShizz[3];
            var building = sensorShizz[4];
            var level = sensorShizz[5];

            switch(status) {
              case "ok":
                  temp.push(
                    <li className="sensorList">
                      <div className="sensorBlockSquare green" onClick={() => that.handleClick(sensorShizz, 'NO_ACTION')}>{id}</div>
                      <div className="dropdown-pane" id={macAdd} data-dropdown data-options="data-hover:true; data-close-on-click:true">
                          <ul className="vertical menu tableOptions">
                            <li className="menuHeader">{macAdd}</li>
                            <li><a onClick={() => that.handleClick(sensorShizz, 'OPEN_CANVAS_ACTION')} data-toggle="offCanvas">More details &raquo;</a></li>
                            <li><a onClick={() => that.handleClick(sensorShizz, 'EDIT_ACTION')}>Edit</a></li>
                            <li><a onClick={() => that.handleClick(sensorShizz, 'DELETE_ACTION')}>Delete</a></li>
                          </ul>
                        </div>
                    </li>
                  );
                break;

                case "warning" :
                temp.push(
                  <li className="sensorList">
                    <div className="sensorBlockSquare orange" onClick={() => that.handleClick(sensorShizz, 'NO_ACTION')}>{id}</div>
                    <div className="dropdown-pane" id={macAdd} data-dropdown data-options="data-hover:true; data-close-on-click:true">
                        <ul className="vertical menu tableOptions">
                          <li className="menuHeader">{macAdd}</li>
                          <li><a onClick={() => that.handleClick(sensorShizz, 'OPEN_CANVAS_ACTION')} data-toggle="offCanvas">More details &raquo;</a></li>
                          <li><a onClick={() => that.handleClick(sensorShizz, 'EDIT_ACTION')}>Edit sensor</a></li>
                          <li><a onClick={() => that.handleClick(sensorShizz, 'DELETE_ACTION')}>Delete sensor</a></li>
                        </ul>
                      </div>
                  </li>
                );
                break;

                case "danger" :
                  temp.push(
                    <li className="sensorList">
                      <div className="sensorBlockSquare red" onClick={() => that.handleClick(sensorShizz, 'NO_ACTION')}>{id}</div>
                      <div className="dropdown-pane" id={macAdd} data-dropdown data-options="data-hover:true; data-close-on-click:true">
                          <ul className="vertical menu tableOptions">
                            <li className="menuHeader">{macAdd}</li>
                            <li><a onClick={() => that.handleClick(sensorShizz, 'OPEN_CANVAS_ACTION')} data-toggle="offCanvas">More details &raquo;</a></li>
                            <li><a onClick={() => that.handleClick(sensorShizz, 'EDIT_ACTION')}>Edit sensor</a></li>
                            <li><a onClick={() => that.handleClick(sensorShizz, 'DELETE_ACTION')}>Delete sensor</a></li>
                          </ul>
                        </div>
                    </li>
                );
                break;

                case "down" :
                temp.push(
                  <li className="sensorList">
                    <div className="sensorBlockSquare black" onClick={() => that.handleClick(sensorShizz, 'NO_ACTION')}>{id}</div>
                    <div className="dropdown-pane" id={macAdd} data-dropdown data-options="data-hover:true; data-close-on-click:true">
                        <ul className="vertical menu tableOptions">
                          <li className="menuHeader">{macAdd}</li>
                          <li><a onClick={() => that.handleClick(sensorShizz, 'OPEN_CANVAS_ACTION')} data-toggle="offCanvas">More details &raquo;</a></li>
                          <li><a onClick={() => that.handleClick(sensorShizz, 'EDIT_ACTION')}>Edit sensor</a></li>
                          <li><a onClick={() => that.handleClick(sensorShizz, 'DELETE_ACTION')}>Delete sensor</a></li>
                        </ul>
                      </div>
                  </li>
                );
                break;

                case "no data" :
                  temp.push(
                    <li className="sensorList">
                      <div className="sensorBlockSquare grey" onClick={() => that.handleClick(sensorShizz, 'NO_ACTION')}>{id}</div>
                      <div className="dropdown-pane" id={macAdd} data-dropdown data-options="data-hover:true; data-close-on-click:true">
                          <ul className="vertical menu tableOptions">
                            <li className="menuHeader">{macAdd}</li>
                            <li><a onClick={() => that.handleClick(sensorShizz, 'OPEN_CANVAS_ACTION')} data-toggle="offCanvas">More details &raquo;</a></li>
                            <li><a onClick={() => that.handleClick(sensorShizz, 'EDIT_ACTION')}>Edit sensor</a></li>
                            <li><a onClick={() => that.handleClick(sensorShizz, 'DELETE_ACTION')}>Delete sensor</a></li>
                          </ul>
                        </div>
                    </li>
                      );
                break;

                default :
                // temp.push(
                //     <td></td >
                //     );
                break;
            }
        });

        //console.log("Here you go, punk", temp);

        tableRows.push(
            <tr>{temp}</tr>
        );

    }

    return (
          <tbody>
                 {tableRows}
          </tbody>
    );
}
}

class SensorHealthOverviewV2 extends React.Component {

constructor(props) {
    super(props);
    this.state = {
        filterText: ''
    };
}

handleUserInput(filterText) {
    this.setState({filterText: filterText});
}

render() {
    // console.log("Cool stuff from serverOverview", this.props.serverData);

    return (
        <div>
            <ServerList data={this.props.serverData}/>
            <SearchBar filterText={this.state.filterText} onUserInput={this.handleUserInput.bind(this)}/>
            <BuildingListV2 data={this.props.data} filterText={this.state.filterText}/>
        </div>
    );
}
}

class ServerList extends React.Component {

  render() {
    console.log("ServerList: ", this.props.data);
    var serverList = this.props.data;

    var rows = [];

    for (var property in serverList) {
        if (serverList.hasOwnProperty(property)) {
            var server = serverList[property];
            rows.push(<Server serverName={property} serverData={server}/>);

        }
    }

    return (
        <div>
            {rows}
        </div>
    );
  }
}

class Server extends React.Component {
  render() {

    console.log("dr. capsicum", this.props.serverData);

      return (
          <div>
              <div className="header">{this.props.serverName}</div>
              <ServerGroupList data={this.props.serverData}/>
          </div>
      );
  }
}

class ServerGroupList extends React.Component {
    render() {

        var groups = this.props.data;
        var rows = [];

        for(var property in groups) {
            if (groups.hasOwnProperty(property)) {
                rows.push(<GroupRow data={groups[property]} />);
            }
        }

        return (
            <div>{rows}</div>
        );
    }
}

class GroupRow extends React.Component {
  render() {
    console.log("Group Row IMPT", this.props.data);

    var longAndThin = this.props.data;

    return (
        <div>
          {longAndThin.toString()}
        </div>
    );
  }
}

module.exports = SensorHealthOverviewV2;
