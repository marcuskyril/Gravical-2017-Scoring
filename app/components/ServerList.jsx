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

        var groups = this.props.data['sensors'];
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

    var visitedIds = [];

    longAndThin.forEach(function(server) {
        if (visitedIds.indexOf(server['id']) < 0) {

            var cluster = server["building"];
            group = server["level"];
            var id = server["id"];
            var mac = server["mac"];
            var status = server["status"];

            rows.push(
                <VerticalMenu key={id} macAdd={mac} serverData={server} id={id} class={colorMap[status]}/>
            );
            visitedIds.push(id);
        }

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

    handleClick(serverData, action) {
        var macAdd = serverData["mac"];
        var tobascoSauce = document.createEvent("Event");

        tobascoSauce.data = {
            macAdd: macAdd
        };

        this.setState({
            macAdd: macAdd
        })

        tobascoSauce.initEvent("tobascoSauce", true, true);
        document.dispatchEvent(tobascoSauce);

    }
    render() {

        var cls = colorMap[this.props.serverData['status']];
        var id = this.props.id;

        return (

           <li className="sensorList">
               <div className={cls} data-toggle="offCanvas" onClick={() => this.handleClick(this.props.serverData)}>{id}</div>
           </li>

       );
    }
}
