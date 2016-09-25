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

class SimpleBarChart extends React.Component{
	render () {

    // console.log("uptime data", this.props.uptimeData);
    var width = $('.row').width() * 0.95;
    console.log("width", width);

  	return (
      <div>
        <div className="header">{this.props.id} | {this.props.mac}</div>
        <BarChart width={width} height={50} data={this.props.uptimeData} syncId={this.props.level}
                  margin={{top: 5, right: 30, left: 20, bottom: 5}} barGap={0} barCategoryGap={0}>
             <CartesianGrid strokeDasharray="3 3"/>
             <Tooltip/>
             <Bar dataKey="value">
               {
                 this.props.uptimeData.map((entry, index) =>(
                  <Cell key={`cell=${index}`} stroke={colorMap[entry['status']]} fill={colorMap[entry['status']]} />
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

    this.setState({
      isLoading: true
    });

    this.retrieveData(3, 30);
  }

  onSubmit() {

    var numDays = parseInt(this.refs.numDays.value);
    var interval = parseInt(this.refs.interval.value);

    this.retrieveData(numDays, interval);
  }

  retrieveData(numDays, interval) {

    var that = this;

    $('.off-canvas-content').addClass('loading-overlay');

    retrieveUptimeDataAPI.retrieveUptimeData(that.state.buildingName, numDays, interval).then(function(response) {
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
            <form>
              <select ref="numDays">
                <option value="0">Select number of days</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
              </select>

              <select ref="interval">
                <option value="0">Select interval</option>
                <option value="30">30 mins</option>
                <option value="25">25 mins</option>
                <option value="20">20 mins</option>
                <option value="15">15 mins</option>
                <option value="10">10 mins</option>
              </select>

              <a className="button proceed expanded" onClick={(e) => that.onSubmit()}>Go</a>
            </form>
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
