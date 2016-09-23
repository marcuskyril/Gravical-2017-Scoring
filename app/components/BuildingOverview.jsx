var React = require('react');
var Recharts = require('recharts');
const {ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip} = Recharts;

var myColors = ["#006600", "#cc7a00", "#990000", "#1a1b1b", "#737373"];

class Building extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        var data = [{
          name: this.props.buildingName,
          ok: this.props.ok,
          warning: this.props.warning,
          danger: this.props.danger,
          down: this.props.down,
          noData: this.props.noData
        }];

        return (
            <div className="column row">
                <div className="header">{this.props.buildingName}</div>
                  <div className="buildingCharts" style={{height: '70px', width: '100%'}}>
                    <ResponsiveContainer>

                      <BarChart width={400} height={30}
                                data={data}
                                layout='vertical'
                                margin={{top: 20, right: 30, left: 20, bottom: 5}} >
                       <XAxis hide={true} type="number"/>
                       <YAxis hide={true} dataKey="name" type="category"/>
                       <CartesianGrid strokeDasharray="3 3"/>
                       <Tooltip/>
                       <Bar dataKey="ok" stackId="a" fill="#006600" isAnimationActive={false}/>
                       <Bar dataKey="warning" stackId="a" fill="#cc7a00" isAnimationActive={false}/>
                       <Bar dataKey="danger" stackId="a" fill="#990000" isAnimationActive={false}/>
                       <Bar dataKey="down" stackId="a" fill="#1a1b1b" isAnimationActive={false}/>
                       <Bar dataKey="noData" stackId="a" fill="#737373" isAnimationActive={false}/>
                      </BarChart>

                     </ResponsiveContainer>
                   </div>


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
                  id="buildingSearch"
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
        console.log("test", this.props.filter);
        this.state = {
            filterText: this.props.filter
        };
    }

    componentDidMount() {
        if(this.state.filterText === undefined) {
          this.setState({
            filterText: ''
          });
        }
    }

    handleUserInput(filterText) {
        this.setState({filterText: filterText});
    }

    render() {
        // console.log("BuildingOverview says hi", this.props.data);
        return (
            <div>
                <div className="callout-dark-header">
                  <div className="page-title">At A Glance</div>
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
