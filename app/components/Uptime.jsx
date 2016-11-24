var React = require('react');
var axios = require('axios');
var Recharts = require('recharts');
var FontAwesome = require('react-fontawesome');
var retrievehistoricalDataAPI = require('retrieveHistoricalDataAPI');
var {Link, IndexLink} = require('react-router');
import {StickyContainer, Sticky} from 'react-sticky';
const {XAxis, Cell, YAxis, Legend, BarChart, Bar, CartesianGrid, Tooltip, Brush, ResponsiveContainer} = Recharts;

var colorMap = {
  "ok" : "#006600",
  "warning" : "#ffcc00",
  "danger" : "#cc7a00",
  "down" : "#990000",
  "no data" : "#737373",
  "others" : "#0A083B"
}

class SimpleBarChart extends React.Component{

	render () {

        var width = $('.row').width() * 0.6;
        var historicalLink = `/historical/${this.props.buildingName}&${this.props.mac}`;

      	return (
          <div key={this.props.id}>
            <div className="row">
                <div className="columns large-3">
                    <div className="margin-top-tiny">
                        <IndexLink to={historicalLink}>{this.props.id} | {this.props.mac}</IndexLink>
                    </div>
                </div>
                <div className="columns large-9">
                    <BarChart width={width} height={40} data={this.props.uptimeData}
                              margin={{top: 5, right: 30, left: 20, bottom: 5}} barGap={0} barCategoryGap={0}>
                         <CartesianGrid strokeDasharray="3 3"/>
                         <Tooltip content={<CustomTooltip external={this.props.uptimeData}/>}/>
                         <Bar dataKey="value" isAnimationActive={false}>
                           {
                             this.props.uptimeData.map((entry, index) =>(
                              <Cell key={`cell=${index}`} stroke={colorMap[entry['status']]} fill={colorMap[entry['status']]} />
                             ))
                           }
                         </Bar>
                    </BarChart>
                </div>
            </div>
          </div>
        );
    }
};

class Uptime extends React.Component {

  constructor(props) {
    super(props);

    var d = new Date();
    d.setDate(d.getDate() - 6);

    var startDate = d.toISOString().substring(0, 10);
    var endDate = new Date().toISOString().substring(0, 10);

    this.state = {
      buildingName: props.params.buildingName,
      data: null,
      isLoading: false,
      message: '',
      startDate: startDate,
      endDate: endDate,
      interval: 15
    }
  }

  componentDidMount() {

    this.setState({
      isLoading: true
    });

    window.scrollTo(0, 0);

    var {startDate, endDate, interval} = this.state;

    this.retrieveData(startDate, endDate, interval);
  }

  onSubmit() {

    var startDate = this.refs.startDate.value;
    var endDate = this.refs.endDate.value;
    var interval = parseInt(this.refs.interval.value);

    var diff = (Date.parse(endDate) - Date.parse(startDate)) / 1000 / 3600 / 24;

    if(Date.parse(endDate) < Date.parse(startDate)) {
        this.setState({message: 'End date is before start date. Please try again.'});
    } else if(endDate.length == 0 || startDate.length == 0) {
        this.setState({message: 'Please ensure that the date fields are filled.'});
    } else if(diff > 21) {
        this.setState({message: 'Date window selected exceeds 21 days.'});
    } else {
        this.setState({
          data: "",
          isLoading: true,
          message: ''
        });

        this.retrieveData(startDate, endDate, interval);
    }
  }

  retrieveData(startDate, endDate, interval) {

    var that = this;
    retrievehistoricalDataAPI.retrieveHistoricalData(that.state.buildingName, startDate, endDate, interval).then(function(response) {

        that.setState({
          data: response,
          isLoading: false,
          startDate: startDate,
          endDate: endDate,
          interval: interval
        });
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
    var {isLoading, data, buildingName, startDate, endDate, interval, message} = this.state;
    var that = this;

    function renderContent() {
      if(isLoading) {

        return (
          <div className="loader"></div>
        );

      } else {
        return (
          <div>
            <div className="margin-bottom-small">
                <div style={{float: 'left'}} className="page-title">Uptime Charts: {buildingName}</div>
                <button className="margin-left-small" onClick={that.minimizeAll}>
                    <FontAwesome name='expand' style={{
                        marginRight: '0.5rem'
                    }}/>
                  Show/Hide all
                </button>
            </div>
            <form id="uptime-form" style={{display: 'flex'}}>
                <label className="margin-right-tiny">Start Date
                  <input type="date" name="startDate" defaultValue={startDate} ref="startDate"/>
                </label>
                <label className="margin-right-tiny">End Date
                    <input type="date" name="endDate" defaultValue={endDate} ref="endDate"/>
                </label>

                <label className="margin-right-tiny"> Interval
                  <select defaultValue={`${interval}`} ref="interval">
                    <option value="30">30 mins</option>
                    <option value="15">15 mins</option>
                  </select>
              </label>

              <a className="button proceed expanded" style={{height: '40px', width: '100px', alignSelf: 'flex-end'}} onClick={(e) => that.onSubmit()}>Go</a>
            </form>

            <div id="uptimeMessage"><UptimeMessage message={message}/></div>
            <div className="margin-bottom-small">You are viewing historical data for {buildingName} between {startDate} & {endDate} at an interval of {interval} minutes.</div>
            <hr/>
          </div>
        );
      }
    }

    function renderSticky () {

        if(!isLoading) {
            return (
                <StickyLegend/>
            );
        }
    }

    return (
      <div id="uptime-wrapper" className="margin-top-large">
        <div className="row" style={{minHeight: '100vh'}}>
          <div className="columns small-10 large-10">
            {renderContent()}
            <UptimeList buildingName={buildingName} data={this.state.data}/>
          </div>
          <div className="columns small-2 large-2">
              {renderSticky()}
          </div>
        </div>
      </div>
    );
  }
}

class UptimeMessage extends React.Component {
    render() {
        var message = this.props.message;

        return (
          <div className="statusText">{message}</div>
        );
    }
}


class StickyLegend extends React.Component {
    render() {

        const LEGEND_VAL = [
            {status: "ok", val: "sensorBlockSquare green sensorList"},
            {status: "warning", val: "sensorBlockSquare yellow sensorList"},
            {status: "danger", val: "sensorBlockSquare orange sensorList"},
            {status: "down", val: "sensorBlockSquare red sensorList"},
            {status: "no data", val: "sensorBlockSquare grey sensorList"},
            {status: "others", val: "sensorBlockSquare blue sensorList"},
            {status: "paused", val: "sensorBlockSquare black sensorList"}
        ];

        var customStyleObject = {
            top: '30%'
        }

        var rows = []

        LEGEND_VAL.forEach(function(item) {
            rows.push(
                <tr>
                    <td>
                        <div className={item['val']}></div>
                    </td>
                    <td>
                        <div style={{textTransform: 'capitalize'}}>{item['status']}</div>
                    </td>
                </tr>
            );
        });

        return (
            <StickyContainer>
                <Sticky stickyStyle={customStyleObject}>
                    <table style={{margin: '11rem 2rem', width: '75px', float: 'right'}}>
                        <thead>
                            <tr>
                                <th colSpan={2}>Legend</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </Sticky>
            </StickyContainer>
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
              rows.push(<SensorList key={level} level={level} buildingName={this.props.buildingName} data={sensorsOnLevel}/>);
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
    var currentLevel = `Level ${this.props.level}`

    for(var sensor in sensorsOnLevel) {
      if(sensorsOnLevel.hasOwnProperty(sensor)) {
        var sensor = sensorsOnLevel[sensor];
        var mac = sensor["mac"];
        var building = sensor["building"];
        var level = sensor["level"];
        var id = sensor["id"];
        var data = sensor["data"];

        rows.push(<SimpleBarChart key={mac} mac={mac} id={id} buildingName={this.props.buildingName} level={level} uptimeData={data}/>);
      }
    }

    return (
      <div key={this.props.level} className="margin-bottom-md">
        <div className="callout callout-dark-header">
          <div className="page-title">{currentLevel}</div>
          <button onClick={() => this.minimize(this.props.level)} className="icon-btn-text-small">
              <FontAwesome name='expand'/>
          </button>
        </div>
        <div key={this.props.level} id={this.props.level} className="callout callout-dark">
          {rows}
        </div>
      </div>
    );
  }
}

module.exports = Uptime;

class CustomTooltip extends React.Component{

    getDetails(label) {

        var {external} = this.props;
        var timestamp = external[label]['timestamp'];
        var status = external[label]['status'];

        return (
            <div>
                <p className="label">{status}</p>
                <p className="desc">{timestamp}</p>
            </div>
        );
    }

    render() {
        const { active } = this.props;

        if (active) {
            const { payload, external, label } = this.props;

            return (
                <div className="custom-tooltip">
                    {this.getDetails(label)}
                </div>
            );
        }
    return null;
    }
};

CustomTooltip.propTypes = {
  type: React.PropTypes.string,
  payload: React.PropTypes.array,
  label: React.PropTypes.number
}
