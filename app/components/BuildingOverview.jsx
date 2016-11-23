var React = require('react');
var Recharts = require('recharts');
const {ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip} = Recharts;

class Building extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        var totalSensors = this.props.ok + this.props.warning + this.props.danger + this.props.down + this.props.noData +this.props.paused;

        var data = [{
          name: this.props.buildingName,
          ok: (this.props.ok/totalSensors),
          warning: (this.props.warning/totalSensors),
          danger: (this.props.danger/totalSensors),
          down: (this.props.down/totalSensors),
          noData: (this.props.noData/totalSensors),
          paused: (this.props.paused/totalSensors)
        }];

        return (
            <div className="column row" style={{'marginBottom':'30px'}}>
                <div className="header">
                    <div>
                        {this.props.buildingName}
                        <div style={{'float':'right'}}>
                            <span style={{'color':'#008000'}}>{this.props.ok}</span>
                            &nbsp;|&nbsp;
                            <span style={{'color':'#ffcc00'}}>{this.props.warning}</span>
                            &nbsp;|&nbsp;
                            <span style={{'color':'#cc7a00'}}>{this.props.danger}</span>
                            &nbsp;|&nbsp;
                            <span style={{'color':'#990000'}}>{this.props.down}</span>
                            &nbsp;|&nbsp;
                            <span style={{'color':'#1a1b1b'}}>{this.props.paused}</span>
                            &nbsp;|&nbsp;
                            <span style={{'color':'#737373'}}>{this.props.noData}</span>
                        </div>
                    </div>
                </div>
                  <div className="buildingCharts" style={{height: '50px', width: '100%'}}>
                    <ResponsiveContainer>

                      <BarChart width={400} height={10}
                                data={data}
                                layout='vertical'
                                margin={{top: 20, right: 30, left: 20, bottom: 5}} >
                       <XAxis hide={true} type="number"/>
                       <YAxis hide={true} dataKey="name" type="category"/>
                       <CartesianGrid strokeDasharray="3 3"/>
                       <Tooltip coordinate={{ x: 1000, y: 100 }} content={
                           <div style={{'backgroundColor':'#fff', 'padding':'10px', 'paddingBottom':'5px'}}>
                               <div>{this.props.buildingName}</div>

                               <table id="glance-tooltip" style={{'minWidth':'100px'}}>
                                 <tbody>
                                   <tr style={{'color':'#008000'}}>
                                       <td>ok</td><td>{this.props.ok}</td>
                                   </tr>
                                   <tr style={{'color':'#ffcc00'}}>
                                       <td>warning</td><td>{this.props.warning}</td>
                                   </tr>
                                   <tr style={{'color':'#cc7a00'}}>
                                       <td>danger</td><td>{this.props.danger}</td>
                                   </tr>
                                   <tr style={{'color':'#990000'}}>
                                       <td>down</td><td>{this.props.down}</td>
                                   </tr>
                                   <tr style={{'color':'#1a1b1b'}}>
                                       <td>paused</td><td>{this.props.paused}</td>
                                   </tr>
                                   <tr style={{'color':'#737373'}}>
                                       <td>no data</td><td>{this.props.noData}</td>
                                   </tr>
                                 </tbody>
                               </table>
                           </div>
                       }/>
                       <Bar dataKey="ok" stackId="a" fill="#008000" isAnimationActive={false}/>
                       <Bar dataKey="warning" stackId="a" fill="#ffcc00" isAnimationActive={false}/>
                       <Bar dataKey="danger" stackId="a" fill="#cc7a00" isAnimationActive={false}/>
                       <Bar dataKey="down" stackId="a" fill="#990000" isAnimationActive={false}/>
                       <Bar dataKey="paused" stackId="a" fill="#1a1b1b" isAnimationActive={false}/>
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
                  noData: buildings[property]["no data"]["count"],
                  paused: buildings[property]["paused"]["count"]
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
          rows.push(<Building key={buildingName} buildingName={buildingName} ok={building.ok} warning={building.warning} danger={building.danger} down={building.down} noData={building.noData} paused={building.paused}/>);
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
        return (
            <div>
                <div className="callout-dark-header">
                  <div className="page-title">At A Glance</div>
                </div>
                <div className="callout-dark">
                  <SearchBar filterText={this.state.filterText}
                              onUserInput={this.handleUserInput.bind(this)}/>
                  <BuildingList data={this.props.data}
                                filterText={this.state.filterText}/>
                </div>
            </div>
        );
    }
}

module.exports = BuildingOverview;
