var React = require('react');
var colorMap = {
  "up" : "sensorBlockSquare green sensorList",
  "warning" : "sensorBlockSquare orange sensorList",
  "danger" : "sensorBlockSquare red sensorList",
  "down" : "sensorBlockSquare black sensorList",
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

        rows.push(<li key={id} className={colorMap[status]}>{id}</li>)
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
