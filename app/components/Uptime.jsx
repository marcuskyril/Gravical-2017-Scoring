var React = require('react');
var axios = require('axios');
var Recharts = require('recharts');
var retrieveUptimeDataAPI = require('retrieveUptimeDataAPI');
const {XAxis, Cell, YAxis, Legend, BarChart, Bar, CartesianGrid, Tooltip, Brush, ResponsiveContainer} = Recharts;

var colorMap = {
  "ok" : "#006600",
  "warning" : "#cc7a00",
  "danger" : "#990000",
  "down" : "#1a1b1b",
  "no data" : "#737373"
}

// const CustomTooltip  = React.createClass({
//   propTypes: {
//     type: PropTypes.string,
//     payload: PropTypes.array,
//     label: PropTypes.string,
//   },
//
//   getIntroOfPage(label) {
//     if (label === 'Page A') {
//       return "Page A is about men's clothing";
//     } else if (label === 'Page B') {
//       return "Page B is about women's dress";
//     } else if (label === 'Page C') {
//       return "Page C is about women's bag";
//     } else if (label === 'Page D') {
//       return "Page D is about household goods";
//     } else if (label === 'Page E') {
//       return "Page E is about food";
//     } else if (label === 'Page F') {
//       return "Page F is about baby food";
//     }
//   },
//
//   render() {
//     const { active } = this.props;
//
//     if (active) {
//       const { payload, label } = this.props;
//       return (
//         <div className="custom-tooltip">
//           <p className="label">{`${label} : ${payload[0].value}`}</p>
//           <p className="intro">{this.getIntroOfPage(label)}</p>
//           <p className="desc">Anything you want can be displayed here.</p>
//         </div>
//       );
//     }
//
//     return null;
//   }
// });

class SimpleBarChart extends React.Component{
	render () {

    // console.log("uptime data", this.props.uptimeData);

  	return (
      <div>
        <div className="header">{this.props.id} | {this.props.mac}</div>
        <BarChart width={1400} height={65} data={this.props.uptimeData} syncId={this.props.level}
                  margin={{top: 5, right: 30, left: 20, bottom: 5}} barGap={0} barCategoryGap={0}>
             <CartesianGrid strokeDasharray="3 3"/>
             <Tooltip/>
             <Bar dataKey="value">
               {
                 this.props.uptimeData.map((entry, index) =>(
                  <Cell key={`cell=${index}`} fill={colorMap[entry['status']]} />
                 ))
               }
             </Bar>
             <Brush height={20}/>
        </BarChart>
      </div>
    );
  }
};

class Uptime extends React.Component {

  constructor(props) {
    super(props);
    //console.log("work pls", props.params.buildingName);

    this.state = {
      buildingName: props.params.buildingName,
      data: null
    }
  }

  componentDidMount() {

    var that = this;
    //console.log("buildingName", this.state.buildingName);
    // call API here
    retrieveUptimeDataAPI.retrieveUptimeData(this.state.buildingName, 1).then(function(response) {
        // console.log("response", response);
        that.setState({
          data: response
        })
    });

  }

  render() {

    // console.log("data", this.state.data);

    return (
      <div className="margin-top-large">
        <div className="row" style={{minHeight: '100vh'}}>
          <div className="columns large-12">
            <div className="header">{this.state.buildingName}</div>
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
        // console.log("dataList", dataList);

        var rows = [];

        for(var level in dataList) {
          if (dataList.hasOwnProperty(level)) {

              var sensorsOnLevel = dataList[level];
              rows.push(<SensorList level={level} data={sensorsOnLevel}/>);
          }
        }

        return (
            <div>
                {rows}
            </div>
        );
    }
}

class SensorList extends React.Component {
  render() {
    var sensorsOnLevel = this.props.data;
    var rows = [];
    var currentLevel = `Level: ${this.props.level}`

    for(var sensor in sensorsOnLevel) {
      if(sensorsOnLevel.hasOwnProperty(sensor)) {
        var sensor = sensorsOnLevel[sensor];
        var mac = sensor["mac"];
        var building = sensor["building"];
        var level = sensor["level"];
        var id = sensor["id"];
        var uptimeData = sensor["uptimeData"];

        rows.push(<SimpleBarChart mac={mac} id={id} level={level} uptimeData={uptimeData}/>);
      }
    }

    return (
      <div className="margin-bottom-md">
        {currentLevel}
        {rows}
      </div>
    );
  }
}

module.exports = Uptime;
