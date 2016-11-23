var React = require('react');
var Recharts = require('recharts');
var FontAwesome = require('react-fontawesome');
var retrieveHistoricalDataAPI = require('retrieveHistoricalDataAPI');
var {Link, IndexLink} = require('react-router');

const {
    XAxis,
    Cell,
    YAxis,
    Legend,
    BarChart,
    Bar,
    AreaChart,
    Area,
    LineChart,
    Line,
    CartesianGrid,
    Tooltip,
    Brush,
    ResponsiveContainer,
    ReferenceLine
} = Recharts;

var colorMap = {
    "ok": "#006600",
    "warning": "#ffcc00",
    "danger": "#cc7a00",
    "down": "#990000",
    "no data": "#737373"
}

class HistoricalChart extends React.Component {

    constructor(props) {
        super(props);

        var d = new Date();
        d.setDate(d.getDate() - 6);

        var startDate = d.toISOString().substring(0, 10);
        var endDate = new Date().toISOString().substring(0, 10);

        var arr = props.params.macAddress.split("&");

        this.state = {
            macAdd: arr[1],
            buildingName: arr[0],
            data: {
                cpu: null,
                ram: null,
                storage: null,
                network: null
            },
            noData: true,
            cpuDanger: 0,
            cpuWarning: 0,
            ramDanger: 0,
            ramWarning: 0,
            storageDanger: 0,
            storageWarning: 0,
            isLoading: false,
            message: '',
            startDate: startDate,
            endDate: endDate,
            interval: 15
        }
    }

    componentDidMount() {

        $('#offCanvas').foundation('close', function(){
            console.log("Closed canvas");
        });

        this.setState({isLoading: true});
        window.scrollTo(0, 0);
        var {startDate, endDate, interval} = this.state;
        this.retrieveData(startDate, endDate, interval);
    }

    onSubmit() {

        var startDate = this.refs.startDate.value;
        var endDate = this.refs.endDate.value;
        var interval = parseInt(this.refs.interval.value);

        var diff = (Date.parse(endDate) - Date.parse(startDate)) / 1000 / 3600 / 24;

        if (Date.parse(endDate) < Date.parse(startDate)) {
            this.setState({message: 'End date is before start date. Please try again.'});
        } else if(endDate.length == 0 || startDate.length == 0) {
            this.setState({message: 'Please ensure that the date fields are filled.'});
        } else if(diff > 21) {
            this.setState({message: 'Date window selected exceeds 21 days.'});
        } else {
            this.setState({isLoading: true, message: ''});
            // console.log("holllerrrrrr", startDate, endDate, interval);
            this.retrieveData(startDate, endDate, interval);
        }
    }

    retrieveData(startDate, endDate, interval) {

        var {macAdd} = this.state;

        var that = this;

        $.when(retrieveHistoricalDataAPI.retrieveHistoricalChart(macAdd, startDate, endDate, interval, "cpu"), retrieveHistoricalDataAPI.retrieveHistoricalChart(macAdd, startDate, endDate, interval, "ram"), retrieveHistoricalDataAPI.retrieveHistoricalChart(macAdd, startDate, endDate, interval, "storage"), retrieveHistoricalDataAPI.retrieveHistoricalChart(macAdd, startDate, endDate, interval, "network")).then(function(cpuData, ramData, storageData, networkData) {

            console.log("what you asked for: ", cpuData[0][1]['danger'], ramData[0][1]['warning']);

            console.log('howdy', cpuData);

            that.setState({
                data: {
                    cpu: cpuData[0][2],
                    ram: ramData[0][2],
                    storage: storageData[0][2],
                    network: networkData[0]
                },
                noData: cpuData[0][0] === "No Data Available" ? true : false,
                cpuDanger: cpuData[0][1]['danger'],
                cpuWarning: cpuData[0][1]['warning'],
                ramDanger: ramData[0][1]['danger'],
                ramWarning: ramData[0][1]['warning'],
                storageDanger: storageData[0][1]['danger'],
                storageWarning: storageData[0][1]['warning'],
                isLoading: false,
                startDate: startDate,
                endDate: endDate,
                interval: interval
            });
        });
    }

    minimize(metric) {
      var pane = $('#'+metric);

      if(pane.css('display') === 'block') {
        pane.slideUp();
      } else {
        pane.slideDown();
      }
    }

    minimizeAll() {
        var panels = $('.callout-dark');

        if (panels.css('display') === 'block') {
            panels.slideUp();
        } else {
            panels.slideDown();
        }
    }

    render() {

        var {
            macAdd,
            isLoading,
            data,
            noData,
            cpuDanger,
            cpuWarning,
            ramDanger,
            ramWarning,
            storageDanger,
            storageWarning,
            buildingName,
            startDate,
            endDate,
            interval,
            message
        } = this.state;

        console.log("warning: ", cpuDanger,
        cpuWarning,
        ramDanger,
        ramWarning,
        storageDanger,
        storageWarning);

        var desc = `You are viewing historical data for ${macAdd} between ${startDate}
                        & ${endDate} at an interval of ${interval} minutes.`;

        var that = this;

        function renderContent() {
            if (isLoading) {

                return (
                    <div className="loader"></div>
                );

            } else if(noData) {
                return (
                    <div className="row textAlignCenter">
                      <div className="columns large-12 margin-top-md">
                          <div className="page-title">No data available</div>
                          <Link to='/dashboard'>Back to dashboard</Link>
                      </div>
                    </div>
                );
            } else {
                return (
                    <div>
                        <div>
                            <div className="margin-bottom-small" style={{
                                display: 'flex'
                            }}>
                                <div className="page-title">Historical Charts ({buildingName}: {macAdd})</div>
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

                                <label className="margin-right-tiny">
                                    Interval
                                    <select defaultValue={`${interval}`} ref="interval">
                                        <option value="30">30 mins</option>
                                        <option value="15">15 mins</option>
                                    </select>
                                </label>

                                <a className="button proceed expanded" style={{height: '40px', width: '100px', alignSelf: 'flex-end'}} onClick={(e) => that.onSubmit()}>Go</a>
                            </form>

                            <div id="uptimeMessage"><UptimeMessage message={message}/></div>
                            <div className="margin-bottom-small">{desc}</div>

                            <hr/>
                        </div>

                        <div className="callout callout-dark-header">
                            <div className="page-title">CPU Usage</div>
                            <button onClick={() => that.minimize("cpu")} className="icon-btn-text-small">
                                <FontAwesome name='expand'/>
                            </button>
                        </div>

                        <div id="cpu" className="callout callout-dark">
                            <SimpleAreaChart warning={cpuWarning} danger={cpuDanger} data={data['cpu']}/>
                        </div>

                        <div className="callout callout-dark-header">
                            <div className="page-title">RAM Usage</div>
                            <button onClick={() => that.minimize("ram")} className="icon-btn-text-small">
                                <FontAwesome name='expand'/>
                            </button>
                        </div>

                        <div id="ram" className="callout callout-dark">
                            <SimpleAreaChart warning={ramWarning} danger={ramDanger} data={data['ram']}/>
                        </div>

                        <div className="callout callout-dark-header">
                            <div className="page-title">Storage</div>
                            <button onClick={() => that.minimize("storage")} className="icon-btn-text-small">
                                <FontAwesome name='expand'/>
                            </button>
                        </div>

                        <div id="storage" className="callout callout-dark">
                            <SimpleAreaChart warning={storageWarning} danger={storageDanger} data={data['storage']}/>
                        </div>

                        <div className="callout callout-dark-header">
                            <div className="page-title">Network</div>
                            <button onClick={() => that.minimize("network")} className="icon-btn-text-small">
                                <FontAwesome name='expand'/>
                            </button>
                        </div>

                        <div id="network" className="callout callout-dark">
                            <SimpleLineChart data={data['network']}/>
                        </div>
                    </div>
                );
            }
        }

        return (
            <div id="uptime-wrapper" className="margin-top-large">
                <div className="row" style={{
                    minHeight: '100vh'
                }}>
                    <div className="columns large-12">
                        {renderContent()}
                    </div>
                </div>
            </div>
        );
    }
}

// <SimpleLineChart dataUp={data['network_up'] dataDown={data['network_down']}}/>

class CustomizedAxisTick extends React.Component {
    render () {
        const {x, y, stroke, payload} = this.props;

       	return (
        	<g transform={`translate(${x},${y})`}>
            <text x={0} y={15} dy={16} textAnchor="middle" width={30} fill="#666" transform="rotate(-15)" >{payload.value}</text>
          </g>
        );
    }
}

class SimpleAreaChart extends React.Component {
    render() {
        var width = $('.row').width() * 0.90;

        console.log("warning", this.props.warning);
        console.log("danger", this.props.danger);

        return (
            <AreaChart syncId='chart' width={width} height={250} data={this.props.data} margin={{
                top: 20,
                right: 65,
                left: 20,
                bottom: 40
            }}>
                <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#009900" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#009900" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="timestamp" tick={<CustomizedAxisTick/>} padding={{right: 0}}/>
                <YAxis />
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip/>
                <ReferenceLine y={this.props.warning} label="Warning" stroke="#ffcc00" strokeDasharray="3 3" />
                <ReferenceLine y={this.props.danger} label="Danger" stroke="#cc7a00" strokeDasharray="3 3" />
                <Area type='monotone' connectNulls={true} dataKey='value' stroke='#009900' fill='url(#gradient)'/>
            </AreaChart>
        );
    }
}

const SimpleLineChart = React.createClass({
    render() {
        var width = $('.row').width() * 0.90;

        return (
            <LineChart syncId='chart' width={width} height={250} data={this.props.data} margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
            }}>
                <XAxis dataKey="name" tickCount={7} />
                <YAxis/>
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip/>
                <Legend/>
                <Line connectNulls={true} dot={false} type="monotone" dataKey="network_up" stroke="#6DBDD6" activeDot={{
                    r: 2
                }}/>
                <Line connectNulls={true} dot={false} type="monotone" dataKey="network_down" stroke="#1a1b1b" activeDot={{
                    r: 2
                }}/>
            </LineChart>
        );
    }
})

class UptimeMessage extends React.Component {
    render() {
        var message = this.props.message;
        // console.log("message from parent: ", message);

        return (
            <div className="statusText">{message}</div>
        );
    }
}

module.exports = HistoricalChart;

class CustomTooltip extends React.Component {

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
        const {active} = this.props;

        if (active) {
            const {payload, external, label} = this.props;

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
