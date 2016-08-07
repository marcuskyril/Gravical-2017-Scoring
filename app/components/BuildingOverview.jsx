var React = require('react');
var PieChart = require('react-d3-components').PieChart;

var myColors = ["#006600", "#cc7a00", "#990000", "#1a1b1b"];
var tooltipPie = function(x, y) {
    return y.toString();
};

class Building extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var obj = this.props;
        var slices = [];

        slices.forEach(function(slice) {
          console.log("slice", slice);
        });

        //console.log("slices", obj);



        return (
            <div>
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
                            }
                        ]
                    }} width={400} height={250} tooltipHtml={tooltipPie} margin={{
                        top: 10,
                        bottom: 50,
                        left: 0,
                        right: 100
                    }}/>
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

        //console.log("BuildingList now has: ", this.props.data);

        var rows = [];
        var allBuildings = [];
        //console.log("data.data!", this.props.data.data);

        var buildings = this.props.data.data;

        for (var property in buildings) {
            if (buildings.hasOwnProperty(property)) {
                var buildingName = property;

                var temp = {
                  buildingName: buildingName,
                  danger: buildings[property]["danger"]["count"],
                  warning: buildings[property]["warning"]["count"],
                  ok: buildings[property]["ok"]["count"],
                  down: buildings[property]["down"]["count"]
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
          rows.push(<Building buildingName={buildingName} ok={building.ok} warning={building.warning} danger={building.danger} down={building.down}/>);
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
