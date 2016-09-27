var React = require('react');

var colorMap = {
  "ok" : "sensorBlockSquare green sensorList",
  "warning" : "sensorBlockSquare yellow sensorList",
  "danger" : "sensorBlockSquare orange sensorList",
  "down" : "sensorBlockSquare red sensorList",
  "no data" : "sensorBlockSquare grey sensorList"
}

class ServerList extends React.Component {

  render() {
    // console.log("ServerList: ", this.props.data);
    var serverList = this.props.data;

    var rows = [];

    for (var property in serverList) {
        if (serverList.hasOwnProperty(property)) {
            var server = serverList[property];
            rows.push(<Server key={property} serverName={property} serverData={server}/>);
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

    // console.log("dr. capsicum", this.props.serverData);
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
                rows.push(<GroupRow key={property} data={groups[property]} />);
            }
        }

        return (
          <table>
            <thead>
              <tr>
                <th style={{textAlign: 'center', width: '20%'}}>Groups</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        );
    }
}

class GroupRow extends React.Component {
  render() {

    var longAndThin = this.props.data;
    var rows = [];
    var group;

    longAndThin.forEach(function(server) {
        // console.log("server", server);

        var cluster = server["cluster"];
        group = server["group"];
        var id = server["id"];
        var mac = server["mac"];
        var status = server["status"];

        // console.log("colorMap", status, colorMap[status]);

        rows.push(
            <VerticalMenu key={id} macAdd={mac} serverData={server} id={id} class={colorMap[status]}/>
        );
    });

    return (
      <tr>
        <th>
          {group.length === 1 ? `0${group}` : group}
        </th>
        <td>
            <ul style={{margin:'0px'}}>
              {rows}
            </ul>
        </td>
      </tr>
    );
  }
}

module.exports = ServerList;

class VerticalMenu extends React.Component {

    constructor(props) {
      super(props);
    }

    // var cluster = server["cluster"];
    // group = server["group"];
    // var id = server["id"];
    // var mac = server["mac"];
    // var status = server["status"];

    handleClick(serverData, action) {
        var macAddress = serverData["mac"];
        var areaID = serverData["id"];

        switch(action){
          case 'EDIT_ACTION':

            // $('#inputMac').val(macAddress);
            // $('#inputRegion').val(region.toLowerCase());
            // $('#inputLocationLevel').val(level);
            // $('#inputSensorLocationID').val(areaID);
            // $('#inputBuildingName').val(buildingName);
            //
            // // editModal.open();
            // $('#edit-sensor-modal').foundation('open');

            alert("one moment please");

            break;

          case 'DELETE_ACTION':

            // document.getElementById('deleteDetails').innerHTML = buildingName +": " +level +areaID;
            // document.getElementById('deleteMac').innerHTML = macAddress;
            //
            // // deleteModal.open();
            // $('#delete-sensor-modal').foundation('open');

            alert("one moment please");

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
             <div className={this.props.class} onClick={() => this.handleClick(this.props.serverData, 'NO_ACTION')}>{this.props.id}</div>
             <div className="dropdown-pane" id={this.props.macAdd} data-dropdown data-options="data-hover:true; data-close-on-click:true">
                 <ul className="vertical menu tableOptions">
                   <li className="menuHeader">{this.props.macAdd}</li>
                   <li><a onClick={() => this.handleClick(this.props.serverData, 'OPEN_CANVAS_ACTION')} data-toggle="offCanvas">More details &raquo;</a></li>
                   <li><a onClick={() => this.handleClick(this.props.serverData, 'EDIT_ACTION')}>Edit server</a></li>
                   <li><a onClick={() => this.handleClick(this.props.serverData, 'DELETE_ACTION')}>Delete server</a></li>
                 </ul>
               </div>
           </li>
       );
    }
}
