var React = require('react');
var axios = require('axios');
var Recharts = require('recharts');
var FontAwesome = require('react-fontawesome');
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
        <BarChart width={1200} height={50} data={this.props.uptimeData} syncId={this.props.level}
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
      data: null,
      isLoading: false
    }
  }

  componentDidMount() {

    var that = this;
    //console.log("buildingName", this.state.buildingName);
    // call API here

    this.setState({
      isLoading: true
    });


    retrieveUptimeDataAPI.retrieveUptimeData(this.state.buildingName, 3).then(function(response) {
        // console.log("response", response);
        that.setState({
          data: response,
          isLoading: false
        });

        $('.off-canvas-content').removeClass('loading-overlay');
    });

  }

  minimizeAll() {
    var panels = $('.callout-dark');

    if(panels.css('display') === 'block') {
      panels.slideUp();
    } else {
      panels.slideDown();
    }
  }

  render() {

    // console.log("data", this.state.data);
    var {isLoading, data, buildingName} = this.state;
    var that = this;

    function renderMessage() {
      if(isLoading) {
        $('.off-canvas-content').addClass('loading-overlay');

        return (
          <div className="textAlignCenter">
            <FontAwesome name='refresh' size={'5x'} spin style={{color: '#fff', textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)'}}/>
          </div>
        );
      } else {
        return (
          <div>
            <div className="page-title">{buildingName}</div>
            <button onClick={that.minimizeAll}>
                <FontAwesome name='expand' style={{
                    marginRight: '0.5rem'
                }}/>
              Show/Hide all
            </button>
            <hr/>
          </div>
        );
      }
    }

    return (
      <div id="uptime-wrapper" className="margin-top-large">
        <div className="row" style={{minHeight: '100vh'}}>
          <div className="columns large-12">

            {renderMessage()}
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

  minimize(level) {
    var pane = $('#'+level);

    if(pane.css('display') === 'block') {
      pane.slideUp();
    } else {
      pane.slideDown();
    }
  }

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
        <div className="callout callout-dark-header">
          {currentLevel}
          <button onClick={() => this.minimize(this.props.level)} className="icon-btn-text-small">
              <FontAwesome name='expand'/>
          </button>
        </div>
        <div id={this.props.level} className="callout callout-dark">
          {rows}
        </div>
      </div>
    );
  }
}

module.exports = Uptime;
