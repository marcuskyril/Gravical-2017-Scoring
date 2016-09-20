var React = require('react');
var axios = require('axios');
var Recharts = require('recharts');
var retrieveUptimeDataAPI = require('retrieveUptimeDataAPI');
const {XAxis, YAxis, Legend, BarChart, Bar, CartesianGrid, Tooltip, Brush, ResponsiveContainer} = Recharts;

var colorMap = {
  "ok" : "#006600",
  "warning" : "#cc7a00",
  "danger" : "#990000",
  "down" : "#1a1b1b",
  "no data" : "#737373"
}

const data = [
    {name: '9/19/2016, 10:00 PM', status: 1, fill: '#006600'},
    {name: '9/19/2016, 11:30 PM', status: 1, fill: '#006600'},
    {name: '9/19/2016, 11:00 PM', status: 1, fill: '#006600'},
    {name: '9/19/2016, 12:00 PM', status: 1, fill: '#006600'},
    {name: '9/19/2016, 12:30 PM', status: 1, fill: '#006600'},
    {name: '9/19/2016, 13:00 PM', status: 1, fill: '#006600'},
    {name: '9/19/2016, 13:30 PM', status: 1, fill: '#006600'},
    {name: '9/19/2016, 14:00 PM', status: 1, fill: '#000'},
    {name: '9/19/2016, 14:30 PM', status: 1, fill: '#006600'},
    {name: '9/19/2016, 15:00 PM', status: 1, fill: '#000'},
    {name: '9/19/2016, 15:30 PM', status: 1, fill: '#006600'},
    {name: '9/19/2016, 16:00 PM', status: 1, fill: '#000'},
    {name: '9/19/2016, 16:30 PM', status: 1, fill: '#006600'}
];

class SimpleBarChart extends React.Component{
	render () {

    console.log("uptime data", this.props.uptimeData);

  	return (
      <div className="margin-top-large">
        <div className="header">Uptime Shizz</div>
        <BarChart width={600} height={100} data={this.props.uptimeData} syncId='uptime'
                  margin={{top: 5, right: 30, left: 20, bottom: 5}} barGap={0} barCategoryGap={0}>
             <CartesianGrid strokeDasharray="3 3"/>
             <Tooltip/>
             <Bar dataKey="timestamp" fill={colorMap[status]} />
             <Brush height={20}/>
        </BarChart>
      </div>
    );
  }
};

class Uptime extends React.Component {

  constructor(props) {
    super(props);
    // console.log(" work pls", props.params.buildingName);

    this.state = {
      buildingName: props.params.buildingName,
      data: null
    }
  }

  componentDidMount() {

    var that = this;
    // call API here
    retrieveUptimeDataAPI.retrieveUptimeData(this.state.buildingName).then(function(response) {
        console.log("response", response);
        that.setState({
          data: response
        })
    });

  }

  render() {

    console.log("data", this.state.data);

    return (
      <div>
        <div className="row" style={{minHeight: '100vh'}}>
          <div className="columns large-12">
            <UptimeList data={this.state.data}/>
          </div>
        </div>
      </div>
    );
  }
}

class UptimeList extends React.Component {
    render() {

        var dataList = this.props.data;
        console.log("dataList", dataList);

        var rows = [];

        for(var level in dataList) {
          if (dataList.hasOwnProperty(level)) {

              var sensorsOnLevel = dataList[level];

              for(var sensor in sensorsOnLevel) {
                if(sensorsOnLevel.hasOwnProperty(sensor)) {
                  console.log("not macAdd", sensorsOnLevel[sensor]);
                  var sensor = sensorsOnLevel[sensor];
                  var mac = sensor["mac"];
                  var building = sensor["building"];
                  var level = sensor["level"];
                  var id = sensor["id"];
                  var uptimeData = sensor["uptimeData"];

                  rows.push(<SimpleBarChart uptimeData={uptimeData}/>);
                }
              }
          }
        }

        return (
            <div>
                <div className="header">{level}</div>
                {rows}
            </div>
        );
    }
}

module.exports = Uptime;
