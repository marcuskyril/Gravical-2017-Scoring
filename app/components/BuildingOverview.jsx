var React = require('react');
var PieChart = require('react-d3-components').PieChart;

var myColors = ["#006600", "#cc7a00", "#990000", "#1a1b1b", "#737373"];
var tooltipPie = function(x, y) {
    return x.toString() +": " +y.toString();
};

class Building extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div className="column row">
                <div className="header">{this.props.buildingName}</div>

                    <PieChart colorScale={d3.scale.ordinal().range(myColors)} data={{
                        label: 'Chart',
                        values: [
                            {
                                x: "OK",
                                y: this.props.ok
                            }, {
                                x: "Warning",
                                y: this.props.warning
                            }, {
                                x: "Danger",
                                y: this.props.danger
                            }, {
                                x: "Down",
                                y: this.props.down
                            }, {
                                x: "No Data",
                                y: this.props.noData
                            }
                        ]
                    }} width={400} height={250} tooltipHtml={tooltipPie} margin={{
                        top: 10,
                        bottom: 50,
                        left: 0,
                        right: 140
                    }}/>
                  <table style={{textAlign: "center"}}>
                    <tbody>
                      <tr>
                        <th style={{backgroundColor:"#006600", height: "3px"}}></th>
                        <th style={{backgroundColor:"#cc7a00", height: "3px"}}></th>
                        <th style={{backgroundColor:"#990000", height: "3px"}}></th>
                        <th style={{backgroundColor:"#1a1b1b", height: "3px"}}></th>
                        <th style={{backgroundColor:"#737373", height: "3px"}}></th>
                      </tr>
                      <tr>
                        <th style={{color:"#006600"}}>{this.props.ok}</th>
                        <th style={{color:"#cc7a00"}}>{this.props.warning}</th>
                        <th style={{color:"#990000"}}>{this.props.danger}</th>
                        <th style={{color:"#1a1b1b"}}>{this.props.down}</th>
                        <th style={{color:"#737373"}}>{this.props.noData}</th>
                      </tr>
                    </tbody>
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

        this.props.onUserInput(
            this.refs.filterTextInput.value
        );
    }
    render() {

        return (
            <form id="buildingFilter">
                <input type="text" placeholder="Filter Results"
                  value={this.props.filterText}
                  ref="filterTextInput"
                  onChange={this.handleChange.bind(this)}/>
            </form>
        );
    }
};

class BuildingList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        var rows = [];
        var allBuildings = [];

        var buildings = this.props.data;

        for (var property in buildings) {
            if (buildings.hasOwnProperty(property)) {
                var buildingName = property;

                var temp = {
                  buildingName: buildingName,
                  danger: buildings[property]["danger"]["count"],
                  warning: buildings[property]["warning"]["count"],
                  ok: buildings[property]["ok"]["count"],
                  down: buildings[property]["down"]["count"],
                  noData: buildings[property]["no data"]["count"]
                }

                allBuildings.push(temp);
            }
        }

        // console.log("allBuildings", allBuildings);

        allBuildings.forEach(function(building){
          var buildingName = building.buildingName;
          if((buildingName.toLowerCase()).indexOf((this.props.filterText.toLowerCase())) === -1) {
            return <div></div>
          }
          rows.push(<Building key={buildingName} buildingName={buildingName} ok={building.ok} warning={building.warning} danger={building.danger} down={building.down} noData={building.noData}/>);
        }.bind(this));

        return (
            <div>
                {rows}
            </div>
        );
    }
}

class BuildingOverview extends React.Component {
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
        // console.log("BuildingOverview says hi", this.props.data);
        return (
            <div>
                <div className="callout-dark-header">
                  <div className="header">at a glance</div>
                </div>
                <div className="callout-dark">
                  <SearchBar filterText={this.state.filterText} onUserInput={this.handleUserInput.bind(this)}/>
                  <BuildingList data={this.props.data} filterText={this.state.filterText}/>
                </div>
            </div>
        );
    }
}

module.exports = BuildingOverview;
