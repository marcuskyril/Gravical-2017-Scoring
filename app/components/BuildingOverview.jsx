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

        console.log("THIS", this);
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
        //console.log("data.data!", this.props.data.data);

        var buildings = this.props.data.data;

        for (var property in buildings) {
            if (buildings.hasOwnProperty(property)) {
                var buildingName = property;

                console.log("buildingName" + buildingName);
                console.log("filter text:", this.props.filterText);
                console.log(buildingName +" === " +this.props.filterText);
                console.log("Not part of filterText?", buildingName.indexOf(this.props.filterText) === -1);

                // var search = $('#buildingFilter');
                //
                // search.on('change keyup', function (e) {
                //
                // });

                // filterText is part of the buildingName
                if ((buildingName.toLowerCase()).indexOf((this.props.filterText).toLowerCase()) !== -1) {

                      var danger = buildings[property]["danger"]["count"];
                      var warning = buildings[property]["warning"]["count"];
                      var ok = buildings[property]["ok"]["count"];
                      var down = buildings[property]["down"]["count"];

                      console.log("data: " + buildingName + " -> " + ok + warning + danger + down);

                      rows.push(<Building buildingName={buildingName} ok={ok} warning={warning} danger={danger} down={down}/>);
                } else {
                  return <div></div>;

                }
            }
        }

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
