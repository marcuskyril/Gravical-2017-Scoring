var React = require('react');
import ReactTooltip from 'react-tooltip'

var dataList = [];

class BuildingV2 extends React.Component {
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

class SearchBarV2 extends React.Component {
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
            rows.push(<BuildingV2 buildingName={buildingName} areaNames={areaNames} levelNames={levelNames} sensors={sensors}/>);
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

        var rows = [];

        rows.push(
            <th style={{
                textAlign: "center"
            }}>Level</th>
        );

        this.props.areaArray.forEach(function(area) {
            rows.push(
                <th style={{
                    textAlign: "center"
                }}>{area}</th>
            )
        });

        return (
            <thead>
                <tr>{rows}</tr>
            </thead>
        );
    }
}

class LevelList extends React.Component {

    constructor(props) {
      super(props);
    }

    handleClick(macAddress, action) {
        console.log("event", macAddress, action);

        switch(action){
          case 'EDIT_ACTION':

            $('#inputMac').val(macAddress);

            var modal = new Foundation.Reveal($('#edit-sensor-modal'));
            modal.open();

            break;
          case 'DELETE_ACTION':

            $('#deleteMac').val(macAddress);
            
            var modal = new Foundation.Reveal($('#delete-sensor-modal'));
            modal.open();

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

        //console.log("le dta oeignall", sensors);
        for (var i = 0; i < levelArray.length; i++) {
            var sensorsOnThisFloor = sensors[levelArray[i]];
            var temp = [ < th > {
                    levelArray[i]
                } < /th>];

          //console.log("current level", levelArray[i]);


          var superTemp = [];
          for (var j = 0; j < areaArray.length; j++) {
            superTemp.push("");
          }

          for (var j = 0; j < sensorsOnThisFloor.length; j++) {
            ////console.log("sensorsOnThisFloor", sensorsOnThisFloor[j]);
            var sensorId = sensorsOnThisFloor[j]['id'];
            var macAdd = sensorsOnThisFloor[j]['mac'];
            //console.log("macAdd", macAdd);
            var thePos = areaArray.indexOf(sensorId);
            superTemp[thePos] = [sensorsOnThisFloor[j]['mac'], sensorsOnThisFloor[j]['status']];
            //console.log("thePos" + thePos + ", sensor: " + superTemp[thePos]);
          }

          // temp.push(superTemp);
          superTemp.forEach(function(sensorShizz) {

            //console.log("sensorShizz status", sensorShizz);
            var macAdd = sensorShizz[0];
            var status = sensorShizz[1];

            switch(status) {
              case "ok":
                  temp.push(
                    <td>
                      <div className="sensorBlockSquare green" onClick={() => that.handleClick(macAdd, 'NO_ACTION')}></div>
                      <div className="dropdown-pane" id={macAdd} data-dropdown data-options="data-hover:true; data-close-on-click:true">
                          <ul className="vertical menu tableOptions">
                            <li className="menuHeader">{macAdd}</li>
                            <li><a onClick={() => that.handleClick(macAdd, 'OPEN_CANVAS_ACTION')} data-toggle="offCanvas">More details &raquo;</a></li>
                            <li><a onClick={() => that.handleClick(macAdd, 'EDIT_ACTION')}>Edit</a></li>
                            <li><a onClick={() => that.handleClick(macAdd, 'DELETE_ACTION')}>Delete</a></li>
                          </ul>
                        </div>
                    </td>
                  );
                break;
                case "warning" :
                temp.push(
                  <td>
                    <div className="sensorBlockSquare orange" onClick={() => that.handleClick(macAdd, 'NO_ACTION')}></div>
                    <div className="dropdown-pane" id={macAdd} data-dropdown data-options="data-hover:true; data-close-on-click:true">
                        <ul className="vertical menu tableOptions">
                          <li className="menuHeader">{macAdd}</li>
                          <li><a onClick={() => that.handleClick(macAdd, 'OPEN_CANVAS_ACTION')} data-toggle="offCanvas">More details &raquo;</a></li>
                          <li><a onClick={() => that.handleClick(macAdd, 'EDIT_ACTION')}>Edit sensor</a></li>
                          <li><a onClick={() => that.handleClick(macAdd, 'DELETE_ACTION')}>Delete sensor</a></li>
                        </ul>
                      </div>
                  </td>
                );
                break;
                case "danger" :
                  temp.push(
                    <td>
                      <div className="sensorBlockSquare red" onClick={() => that.handleClick(macAdd, 'NO_ACTION')}></div>
                      <div className="dropdown-pane" id={macAdd} data-dropdown data-options="data-hover:true; data-close-on-click:true">
                          <ul className="vertical menu tableOptions">
                            <li className="menuHeader">{macAdd}</li>
                            <li><a onClick={() => that.handleClick(macAdd, 'OPEN_CANVAS_ACTION')} data-toggle="offCanvas">More details &raquo;</a></li>
                            <li><a onClick={() => that.handleClick(macAdd, 'EDIT_ACTION')}>Edit sensor</a></li>
                            <li><a onClick={() => that.handleClick(macAdd, 'DELETE_ACTION')}>Delete sensor</a></li>
                          </ul>
                        </div>
                    </td>
                );
                break;
                case "down" :
                temp.push(
                  <td>
                    <div className="sensorBlockSquare black" onClick={() => that.handleClick(macAdd, 'NO_ACTION')}></div>
                    <div className="dropdown-pane" id={macAdd} data-dropdown data-options="data-hover:true; data-close-on-click:true">
                        <ul className="vertical menu tableOptions">
                          <li className="menuHeader">{macAdd}</li>
                          <li><a onClick={() => that.handleClick(macAdd, 'OPEN_CANVAS_ACTION')} data-toggle="offCanvas">More details &raquo;</a></li>
                          <li><a onClick={() => that.handleClick(macAdd, 'EDIT_ACTION')}>Edit sensor</a></li>
                          <li><a onClick={() => that.handleClick(macAdd, 'DELETE_ACTION')}>Delete sensor</a></li>
                        </ul>
                      </div>
                  </td>
                );
                break;
                case "no data" :
                  temp.push(
                    <td>
                      <div className="sensorBlockSquare grey" onClick={() => that.handleClick(macAdd, 'NO_ACTION')}></div>
                      <div className="dropdown-pane" id={macAdd} data-dropdown data-options="data-hover:true; data-close-on-click:true">
                          <ul className="vertical menu tableOptions">
                            <li className="menuHeader">{macAdd}</li>
                            <li><a onClick={() => that.handleClick(macAdd, 'OPEN_CANVAS_ACTION')} data-toggle="offCanvas">More details &raquo;</a></li>
                            <li><a onClick={() => that.handleClick(macAdd, 'EDIT_ACTION')}>Edit sensor</a></li>
                            <li><a onClick={() => that.handleClick(macAdd, 'DELETE_ACTION')}>Delete sensor</a></li>
                          </ul>
                        </div>
                    </td>
                      );
                break;
                default :
                temp.push(
                    <td></td >
                    );
                break;
            }
        });

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

componentDidMount() {
  $(document).foundation();
}

handleUserInput(filterText) {
    this.setState({filterText: filterText});
}

render() {
    // console.log("Cool stuff from sensorHealthOverviewV2", this.props.data);

    return (
        <div>
            <SearchBarV2 filterText={this.state.filterText} onUserInput={this.handleUserInput.bind(this)}/>
            <BuildingListV2 data={this.props.data} filterText={this.state.filterText}/>
        </div>
    );
}
}

module.exports = SensorHealthOverviewV2;
