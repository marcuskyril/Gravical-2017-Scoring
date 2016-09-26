var React = require('react');
import * as Redux from 'react-redux';
import * as actions from 'actions';
import {connect} from 'react-redux';
const HOST = 'http://opsdev.sence.io:4201/';
var store = require('configureStore').configure();

class VerticalMenu extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
        reboot_available : this.props.reboot
      }
    }

    handleClick(sensorData, action) {
        var {dispatch} = this.props;

        var macAddress = sensorData[0];
        var region = sensorData[3];
        var level = sensorData[5];
        var areaID = sensorData[2];
        var buildingName = sensorData[4];
        var port = sensorData[6];

        switch(action){
          case 'EDIT_ACTION':

            $('#inputMac').val(macAddress);
            $('#inputRegion').val(region.toLowerCase());
            $('#inputLocationLevel').val(level);
            $('#inputSensorLocationID').val(areaID);
            $('#inputBuildingName').val(buildingName);

            // editModal.open();
            //store.dispatch(actions.startEditSensor(macAddress, region.toLowerCase(), level, areaID, buildingName));
            $('#edit-sensor-modal').foundation('open');

            break;
          case 'DELETE_ACTION':

            document.getElementById('deleteDetails').innerHTML = buildingName +": " +level +areaID;
            document.getElementById('deleteMac').innerHTML = macAddress;

            // deleteModal.open();
            dispatch(actions.startDeleteSensor(macAddress));
            console.log("DELETE_ACTION", store.getState());

            $('#delete-sensor-modal').foundation('open');

            break;
          case 'REBOOT_ACTION':

            $('#rebootMac').val(macAddress);
            $('#reboot-sensor-modal').foundation('open');

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

          case 'WATCHLIST_UPDATE_ACTION':

            dispatch(actions.startUpdateWatchList(macAddress));
            $('#pin-sensor-modal').foundation('open');

            break;
          case 'LAUNCH_TERMINAL_ACTION':

            if(port.length > 0){
              document.getElementById("terminalIFrame").src = `${HOST}?username=pi&port=${port}`;
            }

            $('#terminal').foundation('open');
            break;
          default:
            console.warn('Invalid request.');
            break;
        }
    }

    renderTerminalLink() {
        var {reboot_available} = this.state;

        if(reboot_available) {
            return (
              <li><a onClick={() => this.handleClick(this.props.sensorData, 'LAUNCH_TERMINAL_ACTION')}>Launch terminal</a></li>
            );
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
                       <li><a onClick={() => this.handleClick(this.props.sensorData, 'WATCHLIST_UPDATE_ACTION')}>Pin sensor</a></li>
                       {this.renderTerminalLink()}
                    </ul>
               </div>
           </li>
       );
    }
}

module.exports = connect()(VerticalMenu);
